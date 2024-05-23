import { Test, TestingModule } from '@nestjs/testing';
import { FieldModel } from 'src/domain/models/field.mode';
import {
    InternalServerErrorException,
    NotFoundException,
    Logger,
} from '@nestjs/common';
import { FieldService } from 'src/application/services/field.service';
import {
    CreateFieldPort,
    GetFieldPort,
} from 'src/application/ports/out/field.out';

describe('FieldService', () => {
    let service: FieldService;
    let createFieldPort: CreateFieldPort;
    let getFieldPort: GetFieldPort;

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

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            providers: [
                FieldService,
                {
                    provide: 'CreateFieldPort',
                    useValue: {
                        createField: jest.fn(),
                    },
                },
                {
                    provide: 'GetFieldPort',
                    useValue: {
                        getField: jest.fn(),
                        getAllFields: jest.fn(),
                        getFieldByFarmer: jest.fn(),
                    },
                },
                Logger,
            ],
        }).compile();

        service = module.get<FieldService>(FieldService);
        createFieldPort = module.get<CreateFieldPort>('CreateFieldPort');
        getFieldPort = module.get<GetFieldPort>('GetFieldPort');
    });

    it('should be defined', () => {
        expect(service).toBeDefined();
    });

    describe('createField', () => {
        it('should create a field successfully', async () => {
            jest.spyOn(createFieldPort, 'createField').mockResolvedValue(
                undefined,
            );

            await expect(
                service.createField(fieldModel),
            ).resolves.toBeUndefined();
            expect(createFieldPort.createField).toHaveBeenCalledWith(
                fieldModel,
            );
        });

        it('should throw InternalServerErrorException on error', async () => {
            jest.spyOn(createFieldPort, 'createField').mockRejectedValue(
                new Error('Create error'),
            );

            await expect(service.createField(fieldModel)).rejects.toThrow(
                InternalServerErrorException,
            );
        });
    });

    describe('getField', () => {
        it('should return a field successfully', async () => {
            jest.spyOn(getFieldPort, 'getField').mockResolvedValue(fieldModel);

            await expect(service.getField(1)).resolves.toEqual(fieldModel);
            expect(getFieldPort.getField).toHaveBeenCalledWith(1);
        });

        it('should throw NotFoundException if field not found', async () => {
            jest.spyOn(getFieldPort, 'getField').mockRejectedValue(
                new NotFoundException('Field not found'),
            );

            await expect(service.getField(1)).rejects.toThrow(
                NotFoundException,
            );
        });

        it('should throw InternalServerErrorException on other errors', async () => {
            jest.spyOn(getFieldPort, 'getField').mockRejectedValue(
                new InternalServerErrorException('Get error'),
            );

            await expect(service.getField(1)).rejects.toThrow(
                InternalServerErrorException,
            );
        });
    });

    describe('getAllFields', () => {
        it('should return all fields successfully', async () => {
            jest.spyOn(getFieldPort, 'getAllFields').mockResolvedValue([
                fieldModel,
            ]);

            await expect(service.getAllFields()).resolves.toEqual([fieldModel]);
            expect(getFieldPort.getAllFields).toHaveBeenCalled();
        });

        it('should throw InternalServerErrorException on error', async () => {
            jest.spyOn(getFieldPort, 'getAllFields').mockRejectedValue(
                new InternalServerErrorException('Get all error'),
            );

            await expect(service.getAllFields()).rejects.toThrow(
                InternalServerErrorException,
            );
        });
    });

    describe('getFieldByFarmer', () => {
        it('should return fields by farmer successfully', async () => {
            jest.spyOn(getFieldPort, 'getFieldByFarmer').mockResolvedValue([
                fieldModel,
            ]);

            await expect(service.getFieldByFarmer(1)).resolves.toEqual([
                fieldModel,
            ]);
            expect(getFieldPort.getFieldByFarmer).toHaveBeenCalledWith(1);
        });

        it('should throw NotFoundException if fields not found', async () => {
            jest.spyOn(getFieldPort, 'getFieldByFarmer').mockRejectedValue(
                new NotFoundException('Fields not found'),
            );

            await expect(service.getFieldByFarmer(1)).rejects.toThrow(
                NotFoundException,
            );
        });

        it('should throw InternalServerErrorException on other errors', async () => {
            jest.spyOn(getFieldPort, 'getFieldByFarmer').mockRejectedValue(
                new InternalServerErrorException('Get by farmer error'),
            );

            await expect(service.getFieldByFarmer(1)).rejects.toThrow(
                InternalServerErrorException,
            );
        });
    });
});
