import { Test, TestingModule } from '@nestjs/testing';

import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { FruitModel, VarietyModel } from 'src/domain/models';
import { ConflictException, Logger, NotFoundException } from '@nestjs/common';
import { FruitVarietyAdapter } from 'src/adapters/persistence/fruit-variety.adapter';
import { FruitEntity, VarietyEntity } from 'src/adapters/persistence/entities';

describe('FruitVarietyAdapter', () => {
    let adapter: FruitVarietyAdapter;
    let fruitRepository: Repository<FruitEntity>;
    let varietyRepository: Repository<VarietyEntity>;

    const fruitEntity = new FruitEntity();
    fruitEntity.id = 1;
    fruitEntity.name = 'APPLE'.toUpperCase();
    fruitEntity.varieties = [];

    const varietyEntity = new VarietyEntity();
    varietyEntity.id = 1;
    varietyEntity.name = 'GRANNY SMITH'.toUpperCase();
    varietyEntity.fruit = fruitEntity;
    varietyEntity.uniqueKey = 'APPLE-GRANNY-SMITH';

    const fruitModel: FruitModel = {
        id: 1,
        name: 'APPLE',
    };

    const varietyModel: VarietyModel = {
        id: 1,
        name: 'GRANNY SMITH',
        fruit: { id: 1, name: 'APPLE' },
        uniqueKey: 'APPLE-GRANNY-SMITH',
    };

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            providers: [
                FruitVarietyAdapter,
                {
                    provide: getRepositoryToken(FruitEntity),
                    useClass: Repository,
                },
                {
                    provide: getRepositoryToken(VarietyEntity),
                    useClass: Repository,
                },
                Logger,
            ],
        }).compile();

        adapter = module.get<FruitVarietyAdapter>(FruitVarietyAdapter);
        fruitRepository = module.get<Repository<FruitEntity>>(
            getRepositoryToken(FruitEntity),
        );
        varietyRepository = module.get<Repository<VarietyEntity>>(
            getRepositoryToken(VarietyEntity),
        );
    });

    it('should be defined', () => {
        expect(adapter).toBeDefined();
    });

    describe('getOrCreateFruitByName', () => {
        it('should return an existing fruit', async () => {
            jest.spyOn(fruitRepository, 'findOne').mockResolvedValue(
                fruitEntity,
            );

            const result = await adapter.getOrCreateFruitByName(
                fruitModel.name,
            );
            expect(result).toEqual({
                id: fruitEntity.id,
                name: fruitEntity.name,
                varieties: [],
            });
        });

        it('should create a new fruit if it does not exist', async () => {
            jest.spyOn(fruitRepository, 'findOne').mockResolvedValue(undefined);
            jest.spyOn(adapter, 'createFruit').mockResolvedValue(fruitModel);

            const result = await adapter.getOrCreateFruitByName(
                fruitModel.name,
            );
            expect(result).toEqual(fruitModel);
        });
    });

    describe('createFruit', () => {
        it('should throw ConflictException if fruit already exists', async () => {
            jest.spyOn(fruitRepository, 'findOneBy').mockResolvedValue(
                fruitEntity,
            );

            await expect(adapter.createFruit(fruitModel.name)).rejects.toThrow(
                ConflictException,
            );
        });

        it('should create and return a new fruit', async () => {
            jest.spyOn(fruitRepository, 'findOneBy').mockResolvedValue(
                undefined,
            );
            jest.spyOn(fruitRepository, 'create').mockReturnValue(fruitEntity);
            jest.spyOn(fruitRepository, 'save').mockResolvedValue(fruitEntity);

            const result = await adapter.createFruit(fruitModel.name);
            expect(result).toEqual({
                id: fruitEntity.id,
                name: fruitEntity.name,
                varieties: [],
            });
        });
    });

    describe('getFruit', () => {
        it('should return a fruit if found', async () => {
            jest.spyOn(fruitRepository, 'findOne').mockResolvedValue(
                fruitEntity,
            );

            const result = await adapter.getFruit(1);
            expect(result).toEqual({
                id: fruitEntity.id,
                name: fruitEntity.name,
                varieties: [],
            });
        });

        it('should throw NotFoundException if fruit not found', async () => {
            jest.spyOn(fruitRepository, 'findOne').mockResolvedValue(undefined);

            await expect(adapter.getFruit(1)).rejects.toThrow(
                NotFoundException,
            );
        });
    });

    describe('getAllFruits', () => {
        it('should return an array of fruits', async () => {
            jest.spyOn(fruitRepository, 'find').mockResolvedValue([
                fruitEntity,
            ]);

            const result = await adapter.getAllFruits();
            expect(result).toEqual([
                {
                    id: fruitEntity.id,
                    name: fruitEntity.name,
                    varieties: [],
                },
            ]);
        });
    });

    describe('getVarietyById', () => {
        it('should return a variety if found', async () => {
            jest.spyOn(varietyRepository, 'findOne').mockResolvedValue(
                varietyEntity,
            );

            const result = await adapter.getVarietyById(1);
            expect(result).toEqual({
                id: varietyEntity.id,
                name: varietyEntity.name,
                fruit: { id: fruitEntity.id, name: fruitEntity.name },
                uniqueKey: varietyEntity.uniqueKey,
            });
        });

        it('should throw NotFoundException if variety not found', async () => {
            jest.spyOn(varietyRepository, 'findOne').mockResolvedValue(
                undefined,
            );

            await expect(adapter.getVarietyById(1)).rejects.toThrow(
                NotFoundException,
            );
        });
    });

    describe('getOrCreateVariety', () => {
        it('should return an existing variety', async () => {
            jest.spyOn(fruitRepository, 'findOneBy').mockResolvedValue({
                id: 1,
                name: 'APPLE',
                varieties: [],
            });

            jest.spyOn(varietyRepository, 'findOne').mockResolvedValue(
                varietyEntity,
            );

            const result = await adapter.getOrCreateVariety(varietyModel);
            expect(result).toEqual(varietyModel);
        });

        it('should create a new variety if it does not exist', async () => {
            jest.spyOn(fruitRepository, 'findOneBy').mockResolvedValue(
                fruitEntity,
            );

            jest.spyOn(varietyRepository, 'findOne').mockResolvedValue(
                undefined,
            );
            jest.spyOn(adapter, 'createVariety').mockResolvedValue(
                varietyModel,
            );

            const result = await adapter.getOrCreateVariety(varietyModel);
            expect(result).toEqual(varietyModel);
        });
    });

    describe('createVariety', () => {
        it('should throw ConflictException if variety already exists', async () => {
            jest.spyOn(fruitRepository, 'findOneBy').mockResolvedValue(
                fruitEntity,
            );
            jest.spyOn(varietyRepository, 'findOneBy').mockResolvedValue(
                varietyEntity,
            );

            await expect(adapter.createVariety(varietyModel)).rejects.toThrow(
                ConflictException,
            );
        });

        it('should create and return a new variety', async () => {
            jest.spyOn(varietyRepository, 'findOneBy').mockResolvedValue(
                undefined,
            );
            jest.spyOn(fruitRepository, 'findOneBy').mockResolvedValue(
                fruitEntity,
            );
            jest.spyOn(varietyRepository, 'create').mockReturnValue(
                varietyEntity,
            );
            jest.spyOn(varietyRepository, 'save').mockResolvedValue(
                varietyEntity,
            );

            const result = await adapter.createVariety(varietyModel);
            expect(result).toEqual(varietyModel);
        });
    });

    describe('getUniqueVarietyConstraint', () => {
        it('should return unique key and fruit for a given variety', async () => {
            jest.spyOn(fruitRepository, 'findOneBy').mockResolvedValue(
                fruitEntity,
            );

            const result =
                await adapter['getUniqueVarietyConstraint'](varietyModel);
            expect(result).toEqual({
                uniqueKey: 'APPLE-GRANNY-SMITH',
                fruit: fruitEntity,
            });
        });

        it('should throw an error if fruit not found', async () => {
            jest.spyOn(fruitRepository, 'findOneBy').mockResolvedValue(
                undefined,
            );

            await expect(
                adapter['getUniqueVarietyConstraint'](varietyModel),
            ).rejects.toThrow(Error);
        });
    });
});
