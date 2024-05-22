import {
    ConflictException,
    Inject,
    Injectable,
    InternalServerErrorException,
    Logger,
    NotFoundException,
} from '@nestjs/common';

import { FarmerModel } from 'src/domain/models/Farmer.model';
import { CreateFarmerPort, GetFarmerPort } from '../ports/out/Farmer.out';
import {
    CreateFarmerUseCase,
    GetFarmerUseCase,
} from '../ports/in/farmer.use-case';

@Injectable()
export class FarmerService implements CreateFarmerUseCase, GetFarmerUseCase {
    private readonly logger = new Logger(FarmerService.name);
    constructor(
        @Inject('CreateFarmerPort')
        private readonly createFarmerPort: CreateFarmerPort,
        @Inject('GetFarmerPort')
        private readonly getFarmerPort: GetFarmerPort,
    ) {}

    async getFarmer(id: number): Promise<FarmerModel> {
        try {
            this.logger.log(`Getting Farmer by id ${id}`);
            return await this.getFarmerPort.getFarmer(id);
        } catch (error) {
            this.logger.error(`Failed to get Farmer by id ${id}`, error.stack);
            if (error instanceof NotFoundException) {
                throw error;
            }
            throw new InternalServerErrorException(error.message);
        }
    }
    async getAllFarmers(): Promise<FarmerModel[]> {
        try {
            this.logger.log('Getting all Farmers');
            return this.getFarmerPort.getAllFarmers();
        } catch (error) {
            this.logger.error('Failed to get all Farmers', error.stack);
            if (error instanceof NotFoundException) {
                throw error;
            }
            throw new InternalServerErrorException(error.message);
        }
    }
    async createFarmer(farmer: FarmerModel): Promise<void> {
        try {
            this.logger.log('Creating Farmer');
            const newFarmer = await this.createFarmerPort.createFarmer(farmer);
            if (!newFarmer) {
                throw new Error('Farmer not created');
            }
        } catch (error) {
            if (error instanceof ConflictException) {
                throw error;
            }
            throw new InternalServerErrorException(error.message);
        }
    }
}
