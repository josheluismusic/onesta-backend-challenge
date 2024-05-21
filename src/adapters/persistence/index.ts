import { FruitVarietyAdapter } from './fruit-variety.adapter';
import { ClientAdapter } from './client.adapter';

export const FruitVarietyAdapterProvider = [
    {
        provide: 'CreateFruitPort',
        useClass: FruitVarietyAdapter,
    },
    {
        provide: 'GetFruitPort',
        useClass: FruitVarietyAdapter,
    },
    {
        provide: 'CreateVarietyPort',
        useClass: FruitVarietyAdapter,
    },
    {
        provide: 'GetVarietyPort',
        useClass: FruitVarietyAdapter,
    },
];

export const ClientAdapterProvider = [
    {
        provide: 'CreateClientPort',
        useClass: ClientAdapter,
    },
    {
        provide: 'GetClientPort',
        useClass: ClientAdapter,
    },
];
