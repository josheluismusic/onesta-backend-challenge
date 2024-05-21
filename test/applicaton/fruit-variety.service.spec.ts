import { Test, TestingModule } from '@nestjs/testing';
import { FruitVarietyService } from 'src/application/services/fruit-variety.service';
import {
    CreateFruitPort,
    CreateVarietyPort,
    GetFruitPort,
    GetVarietyPort,
} from 'src/application/ports/out/fruit-variety.out';
import { FruitModel, VarietyModel } from 'src/domain/models';

describe('FruitVarietyService', () => {
    let service: FruitVarietyService;
    let createFruitPort: CreateFruitPort;
    let createVarietyPort: CreateVarietyPort;
    let getFruitPort: GetFruitPort;
    let getVarietyPort: GetVarietyPort;

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            providers: [
                FruitVarietyService,
                {
                    provide: 'CreateFruitPort',
                    useValue: {
                        createFruit: jest.fn(),
                    },
                },
                {
                    provide: 'CreateVarietyPort',
                    useValue: {
                        createVariety: jest.fn(),
                    },
                },
                {
                    provide: 'GetFruitPort',
                    useValue: {
                        getFruit: jest.fn(),
                        getAllFruits: jest.fn(),
                    },
                },
                {
                    provide: 'GetVarietyPort',
                    useValue: {
                        getVarietyById: jest.fn(),
                        getVarietiesByFruitId: jest.fn(),
                        getAllVarieties: jest.fn(),
                    },
                },
            ],
        }).compile();

        service = module.get<FruitVarietyService>(FruitVarietyService);
        createFruitPort = module.get<CreateFruitPort>('CreateFruitPort');
        createVarietyPort = module.get<CreateVarietyPort>('CreateVarietyPort');
        getFruitPort = module.get<GetFruitPort>('GetFruitPort');
        getVarietyPort = module.get<GetVarietyPort>('GetVarietyPort');
    });

    it('should be defined', () => {
        expect(service).toBeDefined();
    });

    describe('getAllFruits', () => {
        it('should return all fruits', async () => {
            const fruits: FruitModel[] = [
                { id: 1, name: 'Apple', varieties: [] },
            ];
            jest.spyOn(getFruitPort, 'getAllFruits').mockResolvedValue(fruits);

            const result = await service.getAllFruits();
            expect(result).toEqual(fruits);
            expect(getFruitPort.getAllFruits).toHaveBeenCalled();
        });
    });

    describe('getFruit', () => {
        it('should return a fruit by id', async () => {
            const fruit: FruitModel = { id: 1, name: 'Apple', varieties: [] };
            jest.spyOn(getFruitPort, 'getFruit').mockResolvedValue(fruit);

            const result = await service.getFruit(1);
            expect(result).toEqual(fruit);
            expect(getFruitPort.getFruit).toHaveBeenCalledWith(1);
        });

        it('should throw an error if fruit is not found', async () => {
            jest.spyOn(getFruitPort, 'getFruit').mockResolvedValue(null);
            await expect(service.getFruit(2)).rejects.toThrow(
                'Fruit with id 2 not found',
            );
            expect(getFruitPort.getFruit).toHaveBeenCalledWith(2);
        });
    });

    describe('createFruit', () => {
        it('should create a fruit', async () => {
            const createFruitSpy = jest
                .spyOn(createFruitPort, 'createFruit')
                .mockResolvedValue(undefined);

            await service.createFruit('Apple');
            expect(createFruitSpy).toHaveBeenCalledWith('Apple');
        });

        it('should log an error and throw if createFruit fails', async () => {
            const errorMessage = 'Error creating fruit';
            jest.spyOn(createFruitPort, 'createFruit').mockRejectedValue(
                new Error(errorMessage),
            );
            const loggerSpy = jest.spyOn(service['logger'], 'error');

            await expect(service.createFruit('Apple')).rejects.toThrow(
                'Error creating fruit',
            );
            expect(loggerSpy).toHaveBeenCalledWith(errorMessage);
        });
    });

    describe('getAllVarieties', () => {
        it('should return all varieties', async () => {
            const varieties: VarietyModel[] = [
                {
                    id: 1,
                    name: 'Golden',
                    fruitId: 1,
                    fruit: 'Apple',
                    uniqueKey: '1-Golden',
                },
            ];
            jest.spyOn(getVarietyPort, 'getAllVarieties').mockResolvedValue(
                varieties,
            );

            const result = await service.getAllVarieties();
            expect(result).toEqual(varieties);
            expect(getVarietyPort.getAllVarieties).toHaveBeenCalled();
        });
    });

    describe('getVariety', () => {
        it('should return a variety by id', async () => {
            const variety: VarietyModel = {
                id: 1,
                name: 'Golden',
                fruitId: 1,
                fruit: 'Apple',
                uniqueKey: '1-Golden',
            };
            jest.spyOn(getVarietyPort, 'getVarietyById').mockResolvedValue(
                variety,
            );

            const result = await service.getVariety(1);
            expect(result).toEqual(variety);
            expect(getVarietyPort.getVarietyById).toHaveBeenCalledWith(1);
        });

        it('should throw an error if variety is not found', async () => {
            jest.spyOn(getVarietyPort, 'getVarietyById').mockResolvedValue(
                null,
            );
            await expect(service.getVariety(2)).rejects.toThrow(
                'Variety with id 2 not found',
            );
            expect(getVarietyPort.getVarietyById).toHaveBeenCalledWith(2);
        });
    });

    describe('GetVarietiesByFruitId', () => {
        it('should return all varieties by fruit id', async () => {
            const varieties: VarietyModel[] = [
                {
                    id: 1,
                    name: 'Golden',
                    fruitId: 1,
                    fruit: 'Apple',
                    uniqueKey: '1-Golden',
                },
            ];
            jest.spyOn(
                getVarietyPort,
                'getVarietiesByFruitId',
            ).mockResolvedValue(varieties);

            const result = await service.GetVarietiesByFruitId(1);
            expect(result).toEqual(varieties);
            expect(getVarietyPort.getVarietiesByFruitId).toHaveBeenCalledWith(
                1,
            );
        });
    });

    describe('createVariety', () => {
        it('should create a variety', async () => {
            const variety: VarietyModel = {
                id: 1,
                name: 'Golden',
                fruitId: 1,
                fruit: 'Apple',
                uniqueKey: '1-Golden',
            };
            const createVarietySpy = jest
                .spyOn(createVarietyPort, 'createVariety')
                .mockResolvedValue(undefined);

            await service.createVariety(variety);
            expect(createVarietySpy).toHaveBeenCalledWith(variety);
        });

        it('should log an error and throw if createVariety fails', async () => {
            const errorMessage = 'Error creating variety';
            const variety: VarietyModel = {
                id: 1,
                name: 'Golden',
                fruitId: 1,
                fruit: 'Apple',
                uniqueKey: '1-Golden',
            };
            jest.spyOn(createVarietyPort, 'createVariety').mockRejectedValue(
                new Error(errorMessage),
            );
            const loggerSpy = jest.spyOn(service['logger'], 'error');

            await expect(service.createVariety(variety)).rejects.toThrow(
                'Error creating variety',
            );
            expect(loggerSpy).toHaveBeenCalledWith(errorMessage);
        });
    });
});
