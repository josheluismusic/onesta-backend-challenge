import { Inject, Injectable, Logger } from '@nestjs/common';
import {
    CreateFruitPort,
    CreateVarietyPort,
    GetFruitPort,
    GetVarietyPort,
} from '../ports/out/fruit-variety.out';
import {
    CreateFruitUseCase,
    CreateVarietyUseCase,
    GetFruitUseCase,
    GetVarietyUseCase,
} from '../ports/in/fruit-variety.use-case';
import { FruitModel, VarietyModel } from 'src/domain/models';

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
        return this.getFruitPort.getFruit(id);
    }
    async createFruit(name: string): Promise<void> {
        try {
            this.createFruitPort.createFruit(name);
        } catch (error) {
            this.logger.error(error.message);
            // TODO: change for persistence exception
            throw new Error('Error creating fruit');
        }
    }

    async getAllVarieties(): Promise<VarietyModel[]> {
        return this.getVarietyPort.getAllVarieties();
    }
    async getVariety(id: number): Promise<VarietyModel> {
        return this.getVarietyPort.getVarietyById(id);
    }
    async GetVarietiesByFruitId(fruitId: number): Promise<VarietyModel[]> {
        return this.getVarietyPort.getVarietiesByFruitId(fruitId);
    }

    async createVariety(variety: VarietyModel): Promise<void> {
        try {
            await this.createVarietyPort.createVariety(variety);
        } catch (error) {
            this.logger.error(error.message);
            // TODO: change for persistence exception
            throw new Error('Error creating variety');
        }
    }
}
