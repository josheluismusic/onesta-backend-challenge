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
import { CreateFarmerPort } from '../ports/out/farmer.out';
import { CreateHarvestPort, GetHarvestPort } from '../ports/out/harvest.out';
import { CreateFieldPort } from '../ports/out/field.out';
import {
    CreateFruitPort,
    CreateVarietyPort,
} from '../ports/out/fruit-variety.out';
import { ClientModel } from 'src/domain/models/client.model';
import { FarmerModel } from 'src/domain/models/farmer.model';
import { FieldModel } from 'src/domain/models/field.mode';
import { FruitModel, VarietyModel } from 'src/domain/models';

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
        try {
            return this.getHarvestPort.getHarvest(id);
        } catch (error) {
            this.logger.error(error);
            throw new InternalServerErrorException('Error getting harvest');
        }
    }
    async getAllHarvests(): Promise<HarvestModel[]> {
        try {
            return this.getHarvestPort.getAllHarvests();
        } catch (error) {
            this.logger.error(error);
            throw new InternalServerErrorException(
                'Error getting all harvests',
            );
        }
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

        try {
            const results = await this.processFile(filePath);

            for (const result of results) {
                this.logger.log(
                    `Processing record number: ${result.recordNumber}`,
                );
                await this.processHarvestUploadModel(result);
            }
        } catch (error) {
            this.logger.error(error);
            throw new InternalServerErrorException('Error processing file');
        }
    }

    async processFile(filePath): Promise<any> {
        return new Promise((resolve, reject) => {
            const results: HarvestUploadModel[] = [];

            fs.createReadStream(`./uploads/${filePath}`)
                .pipe(csv({ separator: ';' }))
                .on('data', (data) =>
                    results.push({
                        recordNumber: results.length + 1,
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
        let client: ClientModel;
        let farmer: FarmerModel;
        let field: FieldModel;
        let fruit: FruitModel;
        let variety: VarietyModel;

        if (haervestUpload.clientEmail) {
            client = await this.createClientPort.getOrCreateClientByEmail({
                email: haervestUpload.clientEmail,
                firstName: haervestUpload.clientFirstName,
                lastName: haervestUpload.clientLastName,
            });
        }

        if (!client) {
            this.logger.error(
                `Record [${haervestUpload.recordNumber}] withoutCLIENT. Skipping...`,
            );
            return;
        }

        if (haervestUpload.farmerEmail) {
            farmer = await this.createFarmerPort.getOrCreateFarmerByEmail({
                email: haervestUpload.farmerEmail,
                firstName: haervestUpload.farmerFirstName,
                lastName: haervestUpload.farmerLastName,
            });
        }

        if (
            haervestUpload.fieldName &&
            haervestUpload.fieldLocation &&
            farmer
        ) {
            field =
                await this.createFieldPort.getOrCreateFieldByNameAndLocation({
                    name: haervestUpload.fieldName,
                    location: haervestUpload.fieldLocation,
                    farmer: { id: farmer.id },
                });
        }

        if (!field) {
            this.logger.error(
                `Record [${haervestUpload.recordNumber}] without FIELD. Skipping...`,
            );
            return;
        }

        if (haervestUpload.harvestedFruit && haervestUpload.harvestedVariety) {
            fruit = await this.createFruitPort.getOrCreateFruitByName(
                haervestUpload.harvestedFruit,
            );

            variety = await this.createVarietyPort.getOrCreateVariety({
                name: haervestUpload.harvestedVariety,
                fruit: fruit,
            });
        }

        if (!variety) {
            this.logger.error(
                `Record [${haervestUpload.recordNumber}] without VARIETY. Skipping...`,
            );
            return;
        }

        await this.createHarvest({
            fruitVariety: { id: variety.id },
            field: { id: field.id },
            client: { id: client.id },
            origin: 'FILE',
        });

        this.logger.log(
            `Record [${haervestUpload.recordNumber}] processed successfully`,
        );
    }
}
