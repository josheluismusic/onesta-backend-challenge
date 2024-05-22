import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { FarmerAdapter } from 'src/adapters/persistence/farmer.adapter';
import { FarmerEntity } from 'src/adapters/persistence/entities/farmer.entity';
import { FarmerModel } from 'src/domain/models/farmer.model';
import { ConflictException, NotFoundException } from '@nestjs/common';

describe('FarmerAdapter', () => {
    let adapter: FarmerAdapter;
    let farmerRepository: Repository<FarmerEntity>;

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            providers: [
                FarmerAdapter,
                {
                    provide: getRepositoryToken(FarmerEntity),
                    useClass: Repository,
                },
            ],
        }).compile();

        adapter = module.get<FarmerAdapter>(FarmerAdapter);
        farmerRepository = module.get<Repository<FarmerEntity>>(
            getRepositoryToken(FarmerEntity),
        );
    });

    it('should be defined', () => {
        expect(adapter).toBeDefined();
    });

    describe('createFarmer', () => {
        it('should create a farmer', async () => {
            const farmer: FarmerModel = {
                id: 1,
                firstName: 'John',
                lastName: 'Doe',
                email: 'john.doe@example.com',
            };
            const farmerEntity = new FarmerEntity();
            Object.assign(farmerEntity, farmer);

            jest.spyOn(farmerRepository, 'findOneBy').mockResolvedValue(null);
            jest.spyOn(farmerRepository, 'create').mockReturnValue(
                farmerEntity,
            );
            jest.spyOn(farmerRepository, 'save').mockResolvedValue(
                farmerEntity,
            );

            const result = await adapter.createFarmer(farmer);
            expect(result).toEqual(farmer);
            expect(farmerRepository.findOneBy).toHaveBeenCalledWith({
                email: farmer.email,
            });
            expect(farmerRepository.create).toHaveBeenCalledWith(farmer);
            expect(farmerRepository.save).toHaveBeenCalledWith(farmerEntity);
        });

        it('should throw a ConflictException if farmer with email already exists', async () => {
            const farmer: FarmerModel = {
                id: 1,
                firstName: 'John',
                lastName: 'Doe',
                email: 'john.doe@example.com',
            };
            const farmerEntity = new FarmerEntity();
            Object.assign(farmerEntity, farmer);

            jest.spyOn(farmerRepository, 'findOneBy').mockResolvedValue(
                farmerEntity,
            );

            await expect(adapter.createFarmer(farmer)).rejects.toThrow(
                ConflictException,
            );
            expect(farmerRepository.findOneBy).toHaveBeenCalledWith({
                email: farmer.email,
            });
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
            const farmerEntity = new FarmerEntity();
            Object.assign(farmerEntity, farmer);

            jest.spyOn(farmerRepository, 'findOneBy').mockResolvedValue(
                farmerEntity,
            );

            const result = await adapter.getFarmer(1);
            expect(result).toEqual(farmer);
            expect(farmerRepository.findOneBy).toHaveBeenCalledWith({ id: 1 });
        });

        it('should throw a NotFoundException if farmer is not found', async () => {
            jest.spyOn(farmerRepository, 'findOneBy').mockResolvedValue(null);

            await expect(adapter.getFarmer(1)).rejects.toThrow(
                NotFoundException,
            );
            expect(farmerRepository.findOneBy).toHaveBeenCalledWith({ id: 1 });
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
            const farmerEntities = farmers.map((farmer) => {
                const entity = new FarmerEntity();
                Object.assign(entity, farmer);
                return entity;
            });

            jest.spyOn(farmerRepository, 'find').mockResolvedValue(
                farmerEntities,
            );

            const result = await adapter.getAllFarmers();
            expect(result).toEqual(farmers);
            expect(farmerRepository.find).toHaveBeenCalled();
        });
    });
});
