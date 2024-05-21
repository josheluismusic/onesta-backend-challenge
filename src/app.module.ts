import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import {
    ClientAdapterProvider,
    FruitVarietyAdapterProvider,
} from './adapters/persistence';
import {
    ClientServiceProvider,
    FruitVarietyServiceProvider,
} from './application/services';
import {
    ClientEntity,
    FruitEntity,
    VarietyEntity,
} from './adapters/persistence/entities';
import { FruitVarietyController } from './adapters/api/fruit-variety.controller';
import { ClientController } from './adapters/api/client.controller';

const adapters = [...FruitVarietyAdapterProvider, ...ClientAdapterProvider];
const services = [...FruitVarietyServiceProvider, ...ClientServiceProvider];
const controllers = [FruitVarietyController, ClientController];

@Module({
    imports: [
        TypeOrmModule.forRoot({
            type: 'sqlite',
            database: 'onesta.db',
            entities: [FruitEntity, VarietyEntity, ClientEntity],
            synchronize: true,
        }),
        TypeOrmModule.forFeature([FruitEntity, VarietyEntity, ClientEntity]),
    ],
    controllers: [...controllers],
    providers: [...services, ...adapters],
})
export class AppModule {}
