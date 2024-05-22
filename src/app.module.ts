import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import {
    ClientAdapterProvider,
    FarmerAdapterProvider,
    FruitVarietyAdapterProvider,
} from './adapters/persistence';
import {
    ClientServiceProvider,
    FarmerServiceProvider,
    FruitVarietyServiceProvider,
} from './application/services';
import {
    ClientEntity,
    FarmerEntity,
    FruitEntity,
    VarietyEntity,
} from './adapters/persistence/entities';
import { FruitVarietyController } from './adapters/api/fruit-variety.controller';
import { ClientController } from './adapters/api/client.controller';
import { FarmerController } from './adapters/api/farmer.controller';

const adapters = [
    ...FruitVarietyAdapterProvider,
    ...ClientAdapterProvider,
    ...FarmerAdapterProvider,
];
const services = [
    ...FruitVarietyServiceProvider,
    ...ClientServiceProvider,
    ...FarmerServiceProvider,
];
const controllers = [
    FruitVarietyController,
    ClientController,
    FarmerController,
];

@Module({
    imports: [
        TypeOrmModule.forRoot({
            type: 'sqlite',
            database: 'onesta.db',
            entities: [FruitEntity, VarietyEntity, ClientEntity, FarmerEntity],
            synchronize: true,
        }),
        TypeOrmModule.forFeature([
            FruitEntity,
            VarietyEntity,
            ClientEntity,
            FarmerEntity,
        ]),
    ],
    controllers: [...controllers],
    providers: [...services, ...adapters],
})
export class AppModule {}
