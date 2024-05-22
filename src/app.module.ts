import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { diskStorage } from 'multer';
import { extname } from 'path';

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
import { MulterModule } from '@nestjs/platform-express';

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
        MulterModule.register({
            storage: diskStorage({
                destination: './uploads',
                filename: (req, file, callback) => {
                    const uniqueSuffix =
                        Date.now() + '-' + Math.round(Math.random() * 1e9);
                    const ext = extname(file.originalname);
                    callback(null, `${file.fieldname}-${uniqueSuffix}${ext}`);
                },
            }),
        }),
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
