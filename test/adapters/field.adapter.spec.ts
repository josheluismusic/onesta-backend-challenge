import { Test, TestingModule } from '@nestjs/testing';

import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { FieldModel } from 'src/domain/models/field.mode';
import { ConflictException, NotFoundException } from '@nestjs/common';
import { FieldEntity } from 'src/adapters/persistence/entities/filed.entity';
import { FarmerEntity } from 'src/adapters/persistence/entities';
import { FieldAdapter } from 'src/adapters/persistence/field.adapter';

describe('FieldAdapter', () => {
    let adapter: FieldAdapter;
    let fieldRepository: Repository<FieldEntity>;
    let farmerRepository: Repository<FarmerEntity>;

    const fieldEntity = new FieldEntity();
    fieldEntity.id = 1;
    fieldEntity.name = 'Field1'.toUpperCase();
    fieldEntity.location = 'Location1'.toUpperCase();
    fieldEntity.farmer = new FarmerEntity();

    const fieldModel: FieldModel = {
        id: 1,
        name: 'Field1',
        location: 'Location1',
        farmer: {
            id: 1,
            firstName: 'John',
            lastName: 'Doe',
        },
    };

    const farmerEntity = new FarmerEntity();
    farmerEntity.id = 1;
    farmerEntity.firstName = 'John';
    farmerEntity.lastName = 'Doe';
    farmerEntity.email = 'john.doe@example.com';

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            providers: [
                FieldAdapter,
                {
                    provide: getRepositoryToken(FieldEntity),
                    useClass: Repository,
                },
                {
                    provide: getRepositoryToken(FarmerEntity),
                    useClass: Repository,
                },
            ],
        }).compile();

        adapter = module.get<FieldAdapter>(FieldAdapter);
        fieldRepository = module.get<Repository<FieldEntity>>(
            getRepositoryToken(FieldEntity),
        );
        farmerRepository = module.get<Repository<FarmerEntity>>(
            getRepositoryToken(FarmerEntity),
        );
    });

    it('should be defined', () => {
        expect(adapter).toBeDefined();
    });

    describe('getOrCreateFieldByNameAndLocation', () => {
        it('should return an existing field', async () => {
            jest.spyOn(fieldRepository, 'findOne').mockResolvedValue(
                fieldEntity,
            );

            const result =
                await adapter.getOrCreateFieldByNameAndLocation(fieldModel);
            expect(result).toEqual({
                id: fieldEntity.id,
                name: fieldEntity.name,
                location: fieldEntity.location,
                farmer: fieldEntity.farmer,
            });
        });

        it('should create a new field if it does not exist', async () => {
            jest.spyOn(fieldRepository, 'findOne').mockResolvedValue(undefined);
            jest.spyOn(adapter, 'createField').mockResolvedValue({
                id: fieldEntity.id,
                name: fieldEntity.name,
                location: fieldEntity.location,
                farmer: fieldEntity.farmer,
            });

            const result =
                await adapter.getOrCreateFieldByNameAndLocation(fieldModel);
            expect(result).toEqual({
                id: fieldEntity.id,
                name: fieldEntity.name,
                location: fieldEntity.location,
                farmer: fieldEntity.farmer,
            });
        });
    });

    describe('createField', () => {
        it('should throw ConflictException if field already exists', async () => {
            jest.spyOn(fieldRepository, 'findOneBy').mockResolvedValue(
                fieldEntity,
            );

            await expect(adapter.createField(fieldModel)).rejects.toThrow(
                ConflictException,
            );
        });

        it('should throw ConflictException if farmer does not exist', async () => {
            jest.spyOn(fieldRepository, 'findOneBy').mockResolvedValue(
                undefined,
            );
            jest.spyOn(farmerRepository, 'findOneBy').mockResolvedValue(
                undefined,
            );

            await expect(adapter.createField(fieldModel)).rejects.toThrow(
                ConflictException,
            );
        });

        it('should create and return a new field', async () => {
            jest.spyOn(fieldRepository, 'findOneBy').mockResolvedValue(
                undefined,
            );
            jest.spyOn(farmerRepository, 'findOneBy').mockResolvedValue(
                farmerEntity,
            );
            jest.spyOn(fieldRepository, 'create').mockReturnValue(fieldEntity);
            jest.spyOn(fieldRepository, 'save').mockResolvedValue(fieldEntity);

            const result = await adapter.createField(fieldModel);
            expect(result).toEqual({
                id: fieldEntity.id,
                name: fieldEntity.name,
                location: fieldEntity.location,
                farmer: farmerEntity,
            });
        });
    });

    describe('getField', () => {
        it('should return a field if found', async () => {
            jest.spyOn(fieldRepository, 'findOne').mockResolvedValue(
                fieldEntity,
            );

            const result = await adapter.getField(1);
            expect(result).toEqual({
                id: fieldEntity.id,
                name: fieldEntity.name,
                location: fieldEntity.location,
                farmer: fieldEntity.farmer,
            });
        });

        it('should throw NotFoundException if field not found', async () => {
            jest.spyOn(fieldRepository, 'findOne').mockResolvedValue(undefined);

            await expect(adapter.getField(1)).rejects.toThrow(
                NotFoundException,
            );
        });
    });

    describe('getAllFields', () => {
        it('should return an array of fields', async () => {
            jest.spyOn(fieldRepository, 'find').mockResolvedValue([
                fieldEntity,
            ]);

            const result = await adapter.getAllFields();
            expect(result).toEqual([
                {
                    id: fieldEntity.id,
                    name: fieldEntity.name,
                    location: fieldEntity.location,
                    farmer: fieldEntity.farmer,
                },
            ]);
        });
    });

    describe('getFieldByFarmer', () => {
        it('should return fields for a given farmer', async () => {
            jest.spyOn(fieldRepository, 'find').mockResolvedValue([
                fieldEntity,
            ]);

            const result = await adapter.getFieldByFarmer(1);
            expect(result).toEqual([
                {
                    id: fieldEntity.id,
                    name: fieldEntity.name,
                    location: fieldEntity.location,
                    farmer: null,
                },
            ]);
        });
    });
});
