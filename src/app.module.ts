import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import {
    ClientAdapterProvider,
    FarmerAdapterProvider,
    FieldAdapterProvider,
    FruitVarietyAdapterProvider,
    HarvestAdapterProvider,
} from './adapters/persistence';
import {
    ClientServiceProvider,
    FarmerServiceProvider,
    FieldServiceProvider,
    FruitVarietyServiceProvider,
    HarvestServiceProvider,
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
import { FieldEntity } from './adapters/persistence/entities/filed.entity';
import { FieldController } from './adapters/api/field.controller';
import { HarvestEntity } from './adapters/persistence/entities/harvest.entity';
import { HarvestController } from './adapters/api/harvest.controller';

const adapters = [
    ...FruitVarietyAdapterProvider,
    ...ClientAdapterProvider,
    ...FarmerAdapterProvider,
    ...FieldAdapterProvider,
    ...HarvestAdapterProvider,
];
const services = [
    ...FruitVarietyServiceProvider,
    ...ClientServiceProvider,
    ...FarmerServiceProvider,
    ...FieldServiceProvider,
    ...HarvestServiceProvider,
];
const controllers = [
    FruitVarietyController,
    ClientController,
    FarmerController,
    FieldController,
    HarvestController,
];

const ormEntities = [
    FruitEntity,
    VarietyEntity,
    ClientEntity,
    FarmerEntity,
    FieldEntity,
    HarvestEntity,
];

@Module({
    imports: [
        TypeOrmModule.forRoot({
            type: 'sqlite',
            database: 'onesta.db',
            entities: ormEntities,
            synchronize: true,
        }),
        TypeOrmModule.forFeature([...ormEntities]),
    ],
    controllers: [...controllers],
    providers: [...services, ...adapters],
})
export class AppModule {}
