/* eslint-disable @typescript-eslint/no-unused-vars */
import { Test, TestingModule } from '@nestjs/testing';

import { Logger, InternalServerErrorException } from '@nestjs/common';
import * as fs from 'fs';
import * as csv from 'csv-parser';
import { HarvestService } from 'src/application/services/harvest.service';
import {
    CreateHarvestPort,
    GetHarvestPort,
} from 'src/application/ports/out/harvest.out';
import { CreateClientPort } from 'src/application/ports/out/client.out';
import { CreateFarmerPort } from 'src/application/ports/out/Farmer.out';
import { CreateFieldPort } from 'src/application/ports/out/field.out';
import {
    CreateFruitPort,
    CreateVarietyPort,
} from 'src/application/ports/out/fruit-variety.out';

jest.mock('fs');
jest.mock('csv-parser');

describe('HarvestService', () => {
    let service: HarvestService;
    let createHarvestPort: CreateHarvestPort;
    let getHarvestPort: GetHarvestPort;
    let createClientPort: CreateClientPort;
    let createFarmerPort: CreateFarmerPort;
    let createFieldPort: CreateFieldPort;
    let createFruitPort: CreateFruitPort;
    let createVarietyPort: CreateVarietyPort;

    const mockFilePath = 'test.csv';
    const mockHarvestUploadModel = {
        recordNumber: 1,
        farmerEmail: 'farmer@example.com',
        farmerFirstName: 'John',
        farmerLastName: 'Doe',
        clientEmail: 'client@example.com',
        clientFirstName: 'Jane',
        clientLastName: 'Doe',
        fieldName: 'Field1',
        fieldLocation: 'Location1',
        harvestedFruit: 'Apple',
        harvestedVariety: 'Fuji',
    };

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            providers: [
                HarvestService,
                {
                    provide: 'CreateHarvestPort',
                    useValue: {
                        createHarvest: jest.fn(),
                    },
                },
                {
                    provide: 'GetHarvestPort',
                    useValue: {},
                },
                {
                    provide: 'CreateClientPort',
                    useValue: {
                        getOrCreateClientByEmail: jest.fn(),
                    },
                },
                {
                    provide: 'CreateFarmerPort',
                    useValue: {
                        getOrCreateFarmerByEmail: jest.fn(),
                    },
                },
                {
                    provide: 'CreateFieldPort',
                    useValue: {
                        getOrCreateFieldByNameAndLocation: jest.fn(),
                    },
                },
                {
                    provide: 'CreateFruitPort',
                    useValue: {
                        getOrCreateFruitByName: jest.fn(),
                    },
                },
                {
                    provide: 'CreateVarietyPort',
                    useValue: {
                        getOrCreateVariety: jest.fn(),
                    },
                },
                Logger,
            ],
        }).compile();

        service = module.get<HarvestService>(HarvestService);
        createHarvestPort = module.get<CreateHarvestPort>('CreateHarvestPort');
        getHarvestPort = module.get<GetHarvestPort>('GetHarvestPort');
        createClientPort = module.get<CreateClientPort>('CreateClientPort');
        createFarmerPort = module.get<CreateFarmerPort>('CreateFarmerPort');
        createFieldPort = module.get<CreateFieldPort>('CreateFieldPort');
        createFruitPort = module.get<CreateFruitPort>('CreateFruitPort');
        createVarietyPort = module.get<CreateVarietyPort>('CreateVarietyPort');
    });

    it('should be defined', () => {
        expect(service).toBeDefined();
    });

    describe('uploadHarvestFile', () => {
        it('should process the harvest file and create records', async () => {
            const mockProcessFile = jest
                .spyOn(service, 'processFile')
                .mockResolvedValue([mockHarvestUploadModel]);
            const mockProcessHarvestUploadModel = jest
                .spyOn(service, 'processHarvestUploadModel')
                .mockResolvedValue(undefined);

            await service.uploadHarvestFile(mockFilePath);

            expect(mockProcessFile).toHaveBeenCalledWith(mockFilePath);
            expect(mockProcessHarvestUploadModel).toHaveBeenCalledWith(
                mockHarvestUploadModel,
            );
        });

        it('should log an error if processFile throws an error', async () => {
            const mockError = new Error('Test error');
            const mockProcessFile = jest
                .spyOn(service, 'processFile')
                .mockRejectedValue(mockError);
            const loggerErrorSpy = jest
                .spyOn(service['logger'], 'error')
                .mockImplementation();

            await expect(
                service.uploadHarvestFile(mockFilePath),
            ).rejects.toThrow(InternalServerErrorException);
            expect(mockProcessFile).toHaveBeenCalledWith(mockFilePath);
            expect(loggerErrorSpy).toHaveBeenCalledWith(mockError);
        });
    });
});
