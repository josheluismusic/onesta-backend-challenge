import {
    Inject,
    Injectable,
    InternalServerErrorException,
    Logger,
} from '@nestjs/common';

import * as fs from 'fs';
import * as csv from 'csv-parser';

import {
    CreateHarvestUseCase,
    GetHarvestUseCase,
    UploadHarvestFileUseCase,
} from '../ports/in/harvest.use-case';
import {
    HarvestModel,
    HarvestUploadModel,
} from 'src/domain/models/harvest.model';
import { CreateClientPort } from '../ports/out/client.out';
import { CreateFarmerPort } from '../ports/out/Farmer.out';
import { CreateHarvestPort, GetHarvestPort } from '../ports/out/harvest.out';
import { CreateFieldPort } from '../ports/out/field.out';
import {
    CreateFruitPort,
    CreateVarietyPort,
} from '../ports/out/fruit-variety.out';

@Injectable()
export class HarvestService
    implements
        CreateHarvestUseCase,
        GetHarvestUseCase,
        UploadHarvestFileUseCase
{
    private readonly logger = new Logger(HarvestService.name);
    constructor(
        @Inject('CreateHarvestPort')
        private readonly createHarvestPort: CreateHarvestPort,
        @Inject('GetHarvestPort')
        private readonly getHarvestPort: GetHarvestPort,
        @Inject('CreateClientPort')
        private readonly createClientPort: CreateClientPort,
        @Inject('CreateFarmerPort')
        private readonly createFarmerPort: CreateFarmerPort,
        @Inject('CreateFieldPort')
        private readonly createFieldPort: CreateFieldPort,
        @Inject('CreateFruitPort')
        private readonly createFruitPort: CreateFruitPort,
        @Inject('CreateVarietyPort')
        private readonly createVarietyPort: CreateVarietyPort,
    ) {}

    async getHarvest(id: number): Promise<HarvestModel> {
        return this.getHarvestPort.getHarvest(id);
    }
    async getAllHarvests(): Promise<HarvestModel[]> {
        return this.getHarvestPort.getAllHarvests();
    }
    async createHarvest(harvest: HarvestModel): Promise<HarvestModel> {
        try {
            return this.createHarvestPort.createHarvest(harvest);
        } catch (error) {
            this.logger.error(error);
            throw new InternalServerErrorException('Error creating harvest');
        }
    }
    async uploadHarvestFile(filePath: string): Promise<void> {
        this.logger.log(`Uploading file: ${filePath}`);

        const results = await this.processFile(filePath);

        this.logger.log(`Processing ${results.length} records`);
        for (const result of results) {
            await this.processHarvestUploadModel(result);
        }
    }

    async processFile(filePath): Promise<any> {
        return new Promise((resolve, reject) => {
            const results: HarvestUploadModel[] = [];

            fs.createReadStream(`./uploads/${filePath}`)
                .pipe(csv({ separator: ';' }))
                .on('data', (data) =>
                    results.push({
                        farmerEmail: data['Mail Agricultor'],
                        farmerFirstName: data['Nombre Agricultor'],
                        farmerLastName: data['Apellido Agricultor'],
                        clientEmail: data['Mail Cliente'],
                        clientFirstName: data['Nombre Cliente'],
                        clientLastName: data['Apellido Cliente'],
                        fieldName: data['Nombre Campo'],
                        fieldLocation: data['Ubicación de Campo'],
                        harvestedFruit: data['Fruta Cosechada'],
                        harvestedVariety: data['Variedad Cosechada'],
                    }),
                )
                .on('end', () => {
                    this.logger.log(
                        `File uploaded successfully. Data Size: ${results.length}`,
                    );
                    resolve(results);
                })
                .on('error', (error) => {
                    this.logger.error(error);
                    reject(error.message);
                });
        });
    }

    async processHarvestUploadModel(haervestUpload: HarvestUploadModel) {
        if (
            haervestUpload.clientEmail === '' ||
            haervestUpload.farmerEmail === '' ||
            haervestUpload.fieldName === '' ||
            haervestUpload.harvestedFruit === ''
        ) {
            return;
        }

        const client = await this.createClientPort.getOrCreateClientByEmail({
            email: haervestUpload.clientEmail,
            firstName: haervestUpload.clientFirstName,
            lastName: haervestUpload.clientLastName,
        });

        const farmer = await this.createFarmerPort.getOrCreateFarmerByEmail({
            email: haervestUpload.farmerEmail,
            firstName: haervestUpload.farmerFirstName,
            lastName: haervestUpload.farmerLastName,
        });

        const field =
            await this.createFieldPort.getOrCreateFieldByNameAndLocation({
                name: haervestUpload.fieldName,
                location: haervestUpload.fieldLocation,
                farmer: { id: farmer.id },
            });

        const fruit = await this.createFruitPort.getOrCreateFruitByName(
            haervestUpload.harvestedFruit,
        );

        const variety = await this.createVarietyPort.getOrCreateVariety({
            name: haervestUpload.harvestedVariety,
            fruit: fruit,
        });

        await this.createHarvest({
            fruitVariety: { id: variety.id },
            field: { id: field.id },
            client: { id: client.id },
            origin: 'FILE',
        });
    }
}
