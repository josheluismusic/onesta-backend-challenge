import { FruitVarietyAdapter } from './fruit-variety.adapter';
import { ClientAdapter } from './client.adapter';
import { FarmerAdapter } from './farmer.adapter';
import { FieldAdapter } from './field.adapter';
import { HarvestAdapter } from './harvest.adapter';

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

export const FarmerAdapterProvider = [
    {
        provide: 'CreateFarmerPort',
        useClass: FarmerAdapter,
    },
    {
        provide: 'GetFarmerPort',
        useClass: FarmerAdapter,
    },
];

export const FieldAdapterProvider = [
    {
        provide: 'CreateFieldPort',
        useClass: FieldAdapter,
    },
    {
        provide: 'GetFieldPort',
        useClass: FieldAdapter,
    },
];

export const HarvestAdapterProvider = [
    {
        provide: 'CreateHarvestPort',
        useClass: HarvestAdapter,
    },
    {
        provide: 'GetHarvestPort',
        useClass: HarvestAdapter,
    },
];
