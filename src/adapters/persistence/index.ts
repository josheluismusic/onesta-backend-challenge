import { FruitVarietyAdapter } from './fruit-variety.adapter';

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
