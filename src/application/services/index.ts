import { ClientService } from './client.service';
import { FarmerService } from './farmer.service';
import { FieldService } from './field.service';
import { FruitVarietyService } from './fruit-variety.service';
import { HarvestService } from './harvest.service';

export const FruitVarietyServiceProvider = [
    {
        provide: 'CreateFruitUseCase',
        useClass: FruitVarietyService,
    },
    {
        provide: 'GetFruitUseCase',
        useClass: FruitVarietyService,
    },
    {
        provide: 'CreateVarietyUseCase',
        useClass: FruitVarietyService,
    },
    {
        provide: 'GetVarietyUseCase',
        useClass: FruitVarietyService,
    },
];

export const ClientServiceProvider = [
    {
        provide: 'CreateClientUseCase',
        useClass: ClientService,
    },
    {
        provide: 'GetClientUseCase',
        useClass: ClientService,
    },
];

export const FarmerServiceProvider = [
    {
        provide: 'CreateFarmerUseCase',
        useClass: FarmerService,
    },
    {
        provide: 'GetFarmerUseCase',
        useClass: FarmerService,
    },
];

export const FieldServiceProvider = [
    {
        provide: 'CreateFieldUseCase',
        useClass: FieldService,
    },
    {
        provide: 'GetFieldUseCase',
        useClass: FieldService,
    },
];

export const HarvestServiceProvider = [
    {
        provide: 'CreateHarvestUseCase',
        useClass: HarvestService,
    },
    {
        provide: 'GetHarvestUseCase',
        useClass: HarvestService,
    },
    {
        provide: 'UploadHarvestFileUseCase',
        useClass: HarvestService,
    },
];
