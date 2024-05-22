import { ClientService } from './client.service';
import { FarmerService } from './farmer.service';
import { FruitVarietyService } from './fruit-variety.service';

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
