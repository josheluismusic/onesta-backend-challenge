import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import {
    ClientAdapterProvider,
    FarmerAdapterProvider,
    FieldAdapterProvider,
    FruitVarietyAdapterProvider,
} from './adapters/persistence';
import {
    ClientServiceProvider,
    FarmerServiceProvider,
    FieldServiceProvider,
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
import { FieldEntity } from './adapters/persistence/entities/filed.entity';
import { FieldController } from './adapters/api/field.controller';

const adapters = [
    ...FruitVarietyAdapterProvider,
    ...ClientAdapterProvider,
    ...FarmerAdapterProvider,
    ...FieldAdapterProvider,
];
const services = [
    ...FruitVarietyServiceProvider,
    ...ClientServiceProvider,
    ...FarmerServiceProvider,
    ...FieldServiceProvider,
];
const controllers = [
    FruitVarietyController,
    ClientController,
    FarmerController,
    FieldController,
];

const ormEntities = [
    FruitEntity,
    VarietyEntity,
    ClientEntity,
    FarmerEntity,
    FieldEntity,
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
