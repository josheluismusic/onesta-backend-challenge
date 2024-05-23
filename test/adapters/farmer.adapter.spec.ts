import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository, Unique } from 'typeorm';
import { FarmerModel } from 'src/domain/models/Farmer.model';
import { NotFoundException, ConflictException } from '@nestjs/common';
import { FarmerAdapter } from 'src/adapters/persistence/farmer.adapter';
import { FarmerEntity } from 'src/adapters/persistence/entities';

describe('FarmerAdapter', () => {
    let adapter: FarmerAdapter;
    let repository: Repository<FarmerEntity>;

    const farmerEntity = new FarmerEntity();
    farmerEntity.id = 1;
    farmerEntity.firstName = 'John';
    farmerEntity.lastName = 'Doe';
    farmerEntity.email = 'john.doe@example.com';
    farmerEntity.fields = [
        {
            id: 1,
            name: 'Field1',
            location: 'Location1',
            farmer: new FarmerEntity(),
            harvests: [],
        },
    ];

    const farmerModel: FarmerModel = {
        id: 1,
        firstName: 'John',
        lastName: 'Doe',
        email: 'john.doe@example.com',
        fields: [{ name: 'Field1', location: 'Location1' }],
    };

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
        repository = module.get<Repository<FarmerEntity>>(
            getRepositoryToken(FarmerEntity),
        );
    });

    it('should be defined', () => {
        expect(adapter).toBeDefined();
    });

    describe('getOrCreateFarmerByEmail', () => {
        it('should return an existing farmer', async () => {
            jest.spyOn(adapter, 'getFarmerByEmail').mockResolvedValue(
                farmerEntity,
            );
            jest.spyOn(repository, 'update').mockResolvedValue(undefined);

            const result = await adapter.getOrCreateFarmerByEmail(farmerModel);
            expect(result).toEqual({
                id: 1,
                firstName: 'John',
                lastName: 'Doe',
                email: 'john.doe@example.com',
            });
        });

        it('should create a new farmer if it does not exist', async () => {
            jest.spyOn(adapter, 'getFarmerByEmail').mockResolvedValue(
                undefined,
            );
            jest.spyOn(repository, 'findOneBy').mockReturnValue(null);
            jest.spyOn(repository, 'create').mockReturnValue(farmerEntity);
            jest.spyOn(repository, 'save').mockResolvedValue(farmerEntity);

            const result = await adapter.getOrCreateFarmerByEmail({
                firstName: 'John',
                lastName: 'Doe',
                email: 'john.doe@example.com',
            });
            expect(result).toEqual({
                id: 1,
                firstName: 'John',
                lastName: 'Doe',
                email: 'john.doe@example.com',
            });
        });
    });

    describe('createFarmer', () => {
        it('should throw ConflictException if farmer already exists', async () => {
            jest.spyOn(repository, 'findOneBy').mockResolvedValue(farmerEntity);

            await expect(adapter.createFarmer(farmerModel)).rejects.toThrow(
                ConflictException,
            );
        });

        it('should create and return a new farmer', async () => {
            jest.spyOn(repository, 'findOneBy').mockResolvedValue(undefined);
            jest.spyOn(repository, 'create').mockReturnValue(farmerEntity);
            jest.spyOn(repository, 'save').mockResolvedValue(farmerEntity);

            const result = await adapter.createFarmer(farmerModel);
            expect(result).toEqual({
                id: 1,
                firstName: 'John',
                lastName: 'Doe',
                email: 'john.doe@example.com',
            });
        });
    });

    describe('getFarmer', () => {
        it('should return a farmer if found', async () => {
            jest.spyOn(repository, 'findOne').mockResolvedValue(farmerEntity);

            const result = await adapter.getFarmer(1);
            expect(result).toEqual(farmerModel);
        });

        it('should throw NotFoundException if farmer not found', async () => {
            jest.spyOn(repository, 'findOne').mockResolvedValue(undefined);

            await expect(adapter.getFarmer(1)).rejects.toThrow(
                NotFoundException,
            );
        });
    });

    describe('getAllFarmers', () => {
        it('should return an array of farmers', async () => {
            jest.spyOn(repository, 'find').mockResolvedValue([farmerEntity]);

            const result = await adapter.getAllFarmers();
            expect(result).toEqual([farmerModel]);
        });
    });

    describe('getFarmerByEmail', () => {
        it('should return a farmer if found by email', async () => {
            jest.spyOn(repository, 'findOneBy').mockResolvedValue(farmerEntity);

            const result = await adapter.getFarmerByEmail(farmerModel.email);
            expect(result).toEqual(farmerEntity);
        });

        it('should return undefined if farmer not found by email', async () => {
            jest.spyOn(repository, 'findOneBy').mockResolvedValue(undefined);

            const result = await adapter.getFarmerByEmail(farmerModel.email);
            expect(result).toBeUndefined();
        });
    });
});
