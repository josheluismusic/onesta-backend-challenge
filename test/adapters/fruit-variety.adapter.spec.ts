import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { FruitEntity, VarietyEntity } from 'src/adapters/persistence/entities';
import { FruitVarietyAdapter } from 'src/adapters/persistence/fruit-variety.adapter';

describe('FruitVarietyAdapter', () => {
    let adapter: FruitVarietyAdapter;
    let fruitRepository: Repository<FruitEntity>;
    let varietyRepository: Repository<VarietyEntity>;

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

    describe('createFruit', () => {
        it('should create a fruit', async () => {
            const fruitName = 'Apple';
            const fruitEntity = new FruitEntity();
            fruitEntity.id = 1;
            fruitEntity.name = fruitName;
            jest.spyOn(fruitRepository, 'create').mockReturnValue(fruitEntity);
            jest.spyOn(fruitRepository, 'save').mockResolvedValue(fruitEntity);

            const result = await adapter.createFruit(fruitName);
            expect(result).toEqual({ id: 1, name: fruitName, varieties: [] });
        });
    });

    describe('getFruit', () => {
        it('should return a fruit by id', async () => {
            const fruitEntity = new FruitEntity();
            fruitEntity.id = 1;
            fruitEntity.name = 'Apple';
            jest.spyOn(fruitRepository, 'findOneBy').mockResolvedValue(
                fruitEntity,
            );

            const result = await adapter.getFruit(1);
            expect(result).toEqual({ id: 1, name: 'Apple', varieties: [] });
        });
    });

    describe('getAllFruits', () => {
        it('should return all fruits', async () => {
            const fruitEntity = new FruitEntity();
            fruitEntity.id = 1;
            fruitEntity.name = 'Apple';
            jest.spyOn(fruitRepository, 'find').mockResolvedValue([
                fruitEntity,
            ]);

            const result = await adapter.getAllFruits();
            expect(result).toEqual([{ id: 1, name: 'Apple', varieties: [] }]);
        });
    });

    describe('getAllVarieties', () => {
        it('should return all varieties', async () => {
            const varietyEntity = new VarietyEntity();
            varietyEntity.id = 1;
            varietyEntity.name = 'brocoli';
            varietyEntity.uniqueKey = 'brocoli-large';
            jest.spyOn(varietyRepository, 'find').mockResolvedValue([
                varietyEntity,
            ]);

            const result = await adapter.getAllVarieties();
            expect(result).toEqual([
                {
                    id: 1,
                    name: 'brocoli',
                    fruitId: null,
                    fruit: null,
                    uniqueKey: 'brocoli-large',
                },
            ]);
        });
    });

    describe('getVarietyById', () => {
        it('should return a variety by id', async () => {
            const varietyEntity = new VarietyEntity();
            varietyEntity.id = 1;
            varietyEntity.name = 'brocoli';
            varietyEntity.uniqueKey = 'brocoli-large';
            jest.spyOn(varietyRepository, 'findOneBy').mockResolvedValue(
                varietyEntity,
            );

            const result = await adapter.getVarietyById(1);
            expect(result).toEqual({
                id: 1,
                name: 'brocoli',
                fruitId: null,
                fruit: null,
                uniqueKey: 'brocoli-large',
            });
        });
    });

    describe('getVarietiesByFruitId', () => {
        it('should return all varieties by fruit id', async () => {
            const varietyEntity = new VarietyEntity();
            varietyEntity.id = 1;
            varietyEntity.name = 'brocoli';
            varietyEntity.uniqueKey = 'brocoli-large';
            jest.spyOn(varietyRepository, 'find').mockResolvedValue([
                varietyEntity,
            ]);

            const result = await adapter.getVarietiesByFruitId(1);
            expect(result).toEqual([
                {
                    id: 1,
                    name: 'brocoli',
                    fruitId: null,
                    fruit: null,
                    uniqueKey: 'brocoli-large',
                },
            ]);
        });
    });

    describe('createVariety', () => {
        it('should create a variety', async () => {
            const varietyName = 'large';
            const varietyEntity = new VarietyEntity();
            varietyEntity.id = 1;
            varietyEntity.name = varietyName;
            varietyEntity.uniqueKey = 'brocoli-large';

            const fruitEntity = new FruitEntity();
            fruitEntity.id = 1;
            fruitEntity.name = 'brocoli';

            jest.spyOn(fruitRepository, 'findOneBy').mockResolvedValue(
                fruitEntity,
            );

            jest.spyOn(varietyRepository, 'create').mockReturnValue(
                varietyEntity,
            );
            jest.spyOn(varietyRepository, 'save').mockResolvedValue(
                varietyEntity,
            );

            const result = await adapter.createVariety({
                fruitId: 1,
                name: varietyName,
            });
            expect(result).toEqual({
                id: 1,
                name: varietyName,
                fruitId: fruitEntity.id,
                fruit: fruitEntity.name,
                uniqueKey: 'brocoli-large',
            });
        });

        it('should throw an error if fruit does not exist', async () => {
            jest.spyOn(fruitRepository, 'findOneBy').mockResolvedValue(null);

            await expect(
                adapter.createVariety({
                    fruitId: 1,
                    name: 'large',
                    uniqueKey: 'brocoli-large',
                }),
            ).rejects.toThrow('Fruit with id 1 not found');
        });
    });
});
