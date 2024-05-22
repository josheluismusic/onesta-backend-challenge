import {
    Inject,
    Injectable,
    InternalServerErrorException,
    Logger,
    NotFoundException,
} from '@nestjs/common';
import {
    CreateFruitPort,
    CreateVarietyPort,
    GetFruitPort,
    GetVarietyPort,
} from 'src/application/ports/out/fruit-variety.out';

import { FruitModel, VarietyModel } from 'src/domain/models';
import {
    CreateFruitUseCase,
    CreateVarietyUseCase,
    GetFruitUseCase,
    GetVarietyUseCase,
} from 'src/application/ports/in/fruit-variety.use-case';

@Injectable()
export class FruitVarietyService
    implements
        CreateFruitUseCase,
        GetFruitUseCase,
        CreateVarietyUseCase,
        GetVarietyUseCase
{
    private readonly logger = new Logger(FruitVarietyService.name);

    constructor(
        @Inject('CreateFruitPort')
        private readonly createFruitPort: CreateFruitPort,
        @Inject('CreateVarietyPort')
        private readonly createVarietyPort: CreateVarietyPort,
        @Inject('GetFruitPort')
        private readonly getFruitPort: GetFruitPort,
        @Inject('GetVarietyPort')
        private readonly getVarietyPort: GetVarietyPort,
    ) {}

    async getAllFruits(): Promise<FruitModel[]> {
        return this.getFruitPort.getAllFruits();
    }

    async getFruit(id: number): Promise<FruitModel> {
        const fruit = await this.getFruitPort.getFruit(id);
        if (!fruit) {
            throw new NotFoundException(`Fruit with id ${id} not found`);
        }
        return fruit;
    }

    async createFruit(name: string): Promise<void> {
        try {
            await this.createFruitPort.createFruit(name);
        } catch (error) {
            this.logger.error(error.message);
            throw new InternalServerErrorException(error.message);
        }
    }

    async getAllVarieties(): Promise<VarietyModel[]> {
        try {
            return this.getVarietyPort.getAllVarieties();
        } catch (error) {
            this.logger.error(error.message);
            throw new InternalServerErrorException(error.message);
        }
    }

    async getVariety(id: number): Promise<VarietyModel> {
        const variety = await this.getVarietyPort.getVarietyById(id);
        if (!variety) {
            throw new NotFoundException(`Variety with id ${id} not found`);
        }
        return variety;
    }

    async GetVarietiesByFruitId(fruitId: number): Promise<VarietyModel[]> {
        try {
            return this.getVarietyPort.getVarietiesByFruitId(fruitId);
        } catch (error) {
            this.logger.error(error.message);
            throw new InternalServerErrorException(error.message);
        }
    }

    async createVariety(variety: VarietyModel): Promise<void> {
        try {
            await this.createVarietyPort.createVariety(variety);
        } catch (error) {
            this.logger.error(error.message);
            throw new InternalServerErrorException(error.message);
        }
    }
}
