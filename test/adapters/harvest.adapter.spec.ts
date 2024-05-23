import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { HarvestAdapter } from 'src/adapters/persistence/harvest.adapter';
import { HarvestEntity } from 'src/adapters/persistence/entities/harvest.entity';
import { ClientEntity } from 'src/adapters/persistence/entities/client.entity';
import { VarietyEntity } from 'src/adapters/persistence/entities/variety.entity';
import { HarvestModel } from 'src/domain/models/harvest.model';
import { ConflictException, NotFoundException } from '@nestjs/common';
import { FieldEntity } from 'src/adapters/persistence/entities/filed.entity';

describe('HarvestAdapter', () => {
    let adapter: HarvestAdapter;
    let harvestRepository: Repository<HarvestEntity>;
    let clientRepository: Repository<ClientEntity>;
    let fieldRepository: Repository<FieldEntity>;
    let varietyRepository: Repository<VarietyEntity>;

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            providers: [
                HarvestAdapter,
                {
                    provide: getRepositoryToken(HarvestEntity),
                    useClass: Repository,
                },
                {
                    provide: getRepositoryToken(ClientEntity),
                    useClass: Repository,
                },
                {
                    provide: getRepositoryToken(FieldEntity),
                    useClass: Repository,
                },
                {
                    provide: getRepositoryToken(VarietyEntity),
                    useClass: Repository,
                },
            ],
        }).compile();

        adapter = module.get<HarvestAdapter>(HarvestAdapter);
        harvestRepository = module.get<Repository<HarvestEntity>>(
            getRepositoryToken(HarvestEntity),
        );
        clientRepository = module.get<Repository<ClientEntity>>(
            getRepositoryToken(ClientEntity),
        );
        fieldRepository = module.get<Repository<FieldEntity>>(
            getRepositoryToken(FieldEntity),
        );
        varietyRepository = module.get<Repository<VarietyEntity>>(
            getRepositoryToken(VarietyEntity),
        );
    });

    afterEach(() => {
        jest.clearAllMocks(); // Clear all mocks after each test
    });

    it('should be defined', () => {
        expect(adapter).toBeDefined();
    });

    describe('createHarvest', () => {
        it('should create a harvest', async () => {
            const harvest: HarvestModel = {
                fruitVariety: { id: 1, name: 'Variety 1' },
                field: { id: 1, name: 'Field 1', location: 'Location 1' },
                client: { id: 1, firstName: 'John', lastName: 'Doe' },
                origin: 'MANUAL',
            };
            const harvestEntity = new HarvestEntity();
            Object.assign(harvestEntity, {
                id: 1,
                variety: { id: 1, name: undefined },
                field: { id: 1, name: undefined, location: undefined },
                client: { id: 1, firstName: undefined, lastName: undefined },
                date: new Date(),
                origin: harvest.origin,
            });

            jest.spyOn(varietyRepository, 'findOne').mockResolvedValue(
                harvestEntity.variety,
            );
            jest.spyOn(fieldRepository, 'findOne').mockResolvedValue(
                harvestEntity.field,
            );
            jest.spyOn(clientRepository, 'findOne').mockResolvedValue(
                harvestEntity.client,
            );
            jest.spyOn(harvestRepository, 'create').mockReturnValue(
                harvestEntity,
            );
            jest.spyOn(harvestRepository, 'save').mockResolvedValue(
                harvestEntity,
            );

            const result = await adapter.createHarvest(harvest);
            expect(result).toEqual({
                id: 1,
                fruitVariety: { id: 1, name: undefined },
                field: { id: 1, name: undefined, location: undefined },
                client: { id: 1, firstName: undefined, lastName: undefined },
                date: harvestEntity.date,
                origin: harvest.origin,
            });
            expect(varietyRepository.findOne).toHaveBeenCalledWith({
                where: { id: harvest.fruitVariety.id },
            });
            expect(fieldRepository.findOne).toHaveBeenCalledWith({
                where: { id: harvest.field.id },
            });
            expect(clientRepository.findOne).toHaveBeenCalledWith({
                where: { id: harvest.client.id },
            });
            expect(harvestRepository.create).toHaveBeenCalledWith({
                variety: harvestEntity.variety,
                field: harvestEntity.field,
                client: harvestEntity.client,
                date: expect.any(Number),
                origin: harvest.origin,
            });
            expect(harvestRepository.save).toHaveBeenCalledWith(harvestEntity);
        });

        it('should throw a ConflictException if variety is not found', async () => {
            const harvest: HarvestModel = {
                fruitVariety: { id: 1 },
                field: { id: 1 },
                client: { id: 1 },
                origin: 'MANUAL',
            };

            jest.spyOn(varietyRepository, 'findOne').mockResolvedValue(null);

            await expect(adapter.createHarvest(harvest)).rejects.toThrow(
                ConflictException,
            );
            expect(varietyRepository.findOne).toHaveBeenCalledWith({
                where: { id: harvest.fruitVariety.id },
            });
        });

        it('should throw a ConflictException if field is not found', async () => {
            const harvest: HarvestModel = {
                fruitVariety: { id: 1 },
                field: { id: 1 },
                client: { id: 1 },
                origin: 'MANUAL',
            };

            jest.spyOn(varietyRepository, 'findOne').mockResolvedValue(
                new VarietyEntity(),
            );
            jest.spyOn(fieldRepository, 'findOne').mockResolvedValue(null);

            await expect(adapter.createHarvest(harvest)).rejects.toThrow(
                ConflictException,
            );
            expect(fieldRepository.findOne).toHaveBeenCalledWith({
                where: { id: harvest.field.id },
            });
        });

        it('should throw a ConflictException if client is not found', async () => {
            const harvest: HarvestModel = {
                fruitVariety: { id: 1 },
                field: { id: 1 },
                client: { id: 1 },
                origin: 'MANUAL',
            };

            jest.spyOn(varietyRepository, 'findOne').mockResolvedValue(
                new VarietyEntity(),
            );
            jest.spyOn(fieldRepository, 'findOne').mockResolvedValue(
                new FieldEntity(),
            );
            jest.spyOn(clientRepository, 'findOne').mockResolvedValue(null);

            await expect(adapter.createHarvest(harvest)).rejects.toThrow(
                ConflictException,
            );
            expect(clientRepository.findOne).toHaveBeenCalledWith({
                where: { id: harvest.client.id },
            });
        });
    });

    describe('getHarvest', () => {
        it('should return a harvest by id', async () => {
            const harvestEntity = new HarvestEntity();
            harvestEntity.id = 1;
            harvestEntity.client = new ClientEntity();
            harvestEntity.client.id = 1;
            harvestEntity.client.firstName = 'John';
            harvestEntity.client.lastName = 'Doe';
            harvestEntity.field = new FieldEntity();
            harvestEntity.field.id = 1;
            harvestEntity.field.name = 'Field 1';
            harvestEntity.field.location = 'Location 1';
            harvestEntity.variety = new VarietyEntity();
            harvestEntity.variety.id = 1;
            harvestEntity.variety.name = 'Variety 1';
            harvestEntity.date = new Date();
            harvestEntity.origin = 'MANUAL';

            jest.spyOn(harvestRepository, 'findOne').mockResolvedValue(
                harvestEntity,
            );

            const result = await adapter.getHarvest(1);
            expect(result).toEqual({
                id: harvestEntity.id,
                fruitVariety: {
                    id: harvestEntity.variety.id,
                    name: harvestEntity.variety.name,
                },
                field: {
                    id: harvestEntity.field.id,
                    name: harvestEntity.field.name,
                    location: harvestEntity.field.location,
                },
                client: {
                    id: harvestEntity.client.id,
                    firstName: harvestEntity.client.firstName,
                    lastName: harvestEntity.client.lastName,
                },
                date: harvestEntity.date,
                origin: harvestEntity.origin,
            });
            expect(harvestRepository.findOne).toHaveBeenCalledWith({
                where: { id: 1 },
                relations: ['variety', 'client', 'field'],
            });
        });

        it('should throw a NotFoundException if harvest is not found', async () => {
            jest.spyOn(harvestRepository, 'findOne').mockResolvedValue(null);

            await expect(adapter.getHarvest(1)).rejects.toThrow(
                NotFoundException,
            );
            expect(harvestRepository.findOne).toHaveBeenCalledWith({
                where: { id: 1 },
                relations: ['variety', 'client', 'field'],
            });
        });
    });

    describe('getAllHarvests', () => {
        it('should return all harvests', async () => {
            const harvestEntities = [
                {
                    id: 1,
                    client: { id: 1, firstName: 'John', lastName: 'Doe' },
                    field: { id: 1, name: 'Field 1', location: 'Location 1' },
                    variety: { id: 1, name: 'Variety 1' },
                    date: new Date(),
                    origin: 'MANUAL',
                },
            ];

            jest.spyOn(harvestRepository, 'find').mockResolvedValue(
                harvestEntities as any,
            );

            const result = await adapter.getAllHarvests();
            expect(result).toEqual([
                {
                    id: 1,
                    fruitVariety: {
                        id: 1,
                        name: 'Variety 1',
                    },
                    field: {
                        id: 1,
                        name: 'Field 1',
                        location: 'Location 1',
                    },
                    client: {
                        id: 1,
                        firstName: 'John',
                        lastName: 'Doe',
                    },
                    date: harvestEntities[0].date,
                    origin: 'MANUAL',
                },
            ]);
            expect(harvestRepository.find).toHaveBeenCalledWith({
                relations: ['variety', 'client', 'field'],
            });
        });
    });
});
