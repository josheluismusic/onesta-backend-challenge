import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { FruitVarietyAdapterProvider } from './adapters/persistence';
import { FruitVarietyServiceProvider } from './application/services';
import { FruitEntity, VarietyEntity } from './adapters/persistence/entities';
import { FruitVarietyController } from './adapters/api/fruit-variety.controller';

const adapters = [...FruitVarietyAdapterProvider];
const services = [...FruitVarietyServiceProvider];
const controllers = [FruitVarietyController];

@Module({
    imports: [
        TypeOrmModule.forRoot({
            type: 'sqlite',
            database: 'onesta.db',
            entities: [FruitEntity, VarietyEntity],
            synchronize: true,
        }),
        TypeOrmModule.forFeature([FruitEntity, VarietyEntity]),
    ],
    controllers: [...controllers],
    providers: [...services, ...adapters],
})
export class AppModule {}
