import { Test, TestingModule } from '@nestjs/testing';
import { FarmerService } from 'src/application/services/farmer.service';
import {
    CreateFarmerPort,
    GetFarmerPort,
} from 'src/application/ports/out/farmer.out';
import { FarmerModel } from 'src/domain/models/farmer.model';
import {
    ConflictException,
    InternalServerErrorException,
    NotFoundException,
} from '@nestjs/common';

describe('FarmerService', () => {
    let service: FarmerService;
    let createFarmerPort: CreateFarmerPort;
    let getFarmerPort: GetFarmerPort;

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            providers: [
                FarmerService,
                {
                    provide: 'CreateFarmerPort',
                    useValue: {
                        createFarmer: jest.fn(),
                    },
                },
                {
                    provide: 'GetFarmerPort',
                    useValue: {
                        getFarmer: jest.fn(),
                        getAllFarmers: jest.fn(),
                    },
                },
            ],
        }).compile();

        service = module.get<FarmerService>(FarmerService);
        createFarmerPort = module.get<CreateFarmerPort>('CreateFarmerPort');
        getFarmerPort = module.get<GetFarmerPort>('GetFarmerPort');
    });

    it('should be defined', () => {
        expect(service).toBeDefined();
    });

    describe('createFarmer', () => {
        it('should create a farmer', async () => {
            const farmer: FarmerModel = {
                id: 1,
                firstName: 'John',
                lastName: 'Doe',
                email: 'john.doe@example.com',
            };
            jest.spyOn(createFarmerPort, 'createFarmer').mockResolvedValue(
                farmer,
            );

            await service.createFarmer(farmer);
            expect(createFarmerPort.createFarmer).toHaveBeenCalledWith(farmer);
        });

        it('should throw a ConflictException if createFarmer fails with unique constraint', async () => {
            const farmer: FarmerModel = {
                id: 1,
                firstName: 'John',
                lastName: 'Doe',
                email: 'john.doe@example.com',
            };
            jest.spyOn(createFarmerPort, 'createFarmer').mockRejectedValue(
                new ConflictException('Farmer with this email already exists'),
            );

            await expect(service.createFarmer(farmer)).rejects.toThrow(
                ConflictException,
            );
            expect(createFarmerPort.createFarmer).toHaveBeenCalledWith(farmer);
        });

        it('should log and rethrow if createFarmer throws an error', async () => {
            const farmer: FarmerModel = {
                id: 1,
                firstName: 'John',
                lastName: 'Doe',
                email: 'john.doe@example.com',
            };
            const errorMessage = 'Internal server error';
            jest.spyOn(createFarmerPort, 'createFarmer').mockRejectedValue(
                new Error(errorMessage),
            );

            await expect(service.createFarmer(farmer)).rejects.toThrow(
                InternalServerErrorException,
            );
            expect(createFarmerPort.createFarmer).toHaveBeenCalledWith(farmer);
        });
    });

    describe('getFarmer', () => {
        it('should return a farmer by id', async () => {
            const farmer: FarmerModel = {
                id: 1,
                firstName: 'John',
                lastName: 'Doe',
                email: 'john.doe@example.com',
            };
            jest.spyOn(getFarmerPort, 'getFarmer').mockResolvedValue(farmer);

            const result = await service.getFarmer(1);
            expect(result).toEqual(farmer);
            expect(getFarmerPort.getFarmer).toHaveBeenCalledWith(1);
        });

        it('should throw a NotFoundException if farmer is not found', async () => {
            jest.spyOn(getFarmerPort, 'getFarmer').mockRejectedValue(
                new NotFoundException('Farmer with id 1 not found'),
            );

            await expect(service.getFarmer(1)).rejects.toThrow(
                NotFoundException,
            );
            expect(getFarmerPort.getFarmer).toHaveBeenCalledWith(1);
        });

        it('should log and rethrow if getFarmer throws an error', async () => {
            const errorMessage = 'Internal server error';
            jest.spyOn(getFarmerPort, 'getFarmer').mockRejectedValue(
                new InternalServerErrorException(errorMessage),
            );
            await expect(service.getFarmer(1)).rejects.toThrow(
                InternalServerErrorException,
            );
            expect(getFarmerPort.getFarmer).toHaveBeenCalledWith(1);
        });
    });

    describe('getAllFarmers', () => {
        it('should return all farmers', async () => {
            const farmers: FarmerModel[] = [
                {
                    id: 1,
                    firstName: 'John',
                    lastName: 'Doe',
                    email: 'john.doe@example.com',
                },
            ];
            jest.spyOn(getFarmerPort, 'getAllFarmers').mockResolvedValue(
                farmers,
            );

            const result = await service.getAllFarmers();
            expect(result).toEqual(farmers);
            expect(getFarmerPort.getAllFarmers).toHaveBeenCalled();
        });

        it('should log and rethrow if getAllFarmers throws an error', async () => {
            const errorMessage = 'Internal server error';
            jest.spyOn(getFarmerPort, 'getAllFarmers').mockRejectedValue(
                new InternalServerErrorException(errorMessage),
            );
            await expect(service.getAllFarmers()).rejects.toThrow(
                InternalServerErrorException,
            );
            expect(getFarmerPort.getAllFarmers).toHaveBeenCalled();
        });
    });
});
