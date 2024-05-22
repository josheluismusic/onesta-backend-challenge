import {
    Inject,
    Injectable,
    InternalServerErrorException,
    Logger,
} from '@nestjs/common';
import {
    CreateHarvestUseCase,
    GetHarvestUseCase,
} from '../ports/in/harvest.use-case';
import { HarvestModel } from 'src/domain/models/harvest.model';

@Injectable()
export class HarvestService implements CreateHarvestUseCase, GetHarvestUseCase {
    private readonly logger = new Logger(HarvestService.name);
    constructor(
        @Inject('CreateHarvestPort')
        private readonly createHarvestPort: CreateHarvestUseCase,
        @Inject('GetHarvestPort')
        private readonly getHarvestPort: GetHarvestUseCase,
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
}
