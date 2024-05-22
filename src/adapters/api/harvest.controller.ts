import { Body, Controller, Get, Inject, Param, Post } from '@nestjs/common';
import {
    CreateHarvestUseCase,
    GetHarvestUseCase,
} from 'src/application/ports/in/harvest.use-case';
import { CreateHarvestRequestBodyDTO } from './dto/harvest.dto';

@Controller('harvest')
export class HarvestController {
    constructor(
        @Inject('CreateHarvestUseCase')
        private readonly createHarvestUseCase: CreateHarvestUseCase,
        @Inject('GetHarvestUseCase')
        private readonly getHarvestUseCase: GetHarvestUseCase,
    ) {}

    @Post()
    async createHarvest(
        @Body() createHarvestRequestBodyDTO: CreateHarvestRequestBodyDTO,
    ) {
        return this.createHarvestUseCase.createHarvest({
            fruitVariety: { id: createHarvestRequestBodyDTO.fruitVarietyId },
            field: { id: createHarvestRequestBodyDTO.fieldId },
            client: { id: createHarvestRequestBodyDTO.clientId },
            origin: 'MANUAL',
        });
    }

    @Get(':id')
    async getHarvest(@Param('id') id: number) {
        return this.getHarvestUseCase.getHarvest(id);
    }

    @Get()
    async getAllHarvests() {
        return this.getHarvestUseCase.getAllHarvests();
    }
}
