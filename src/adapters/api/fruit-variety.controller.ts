import {
    Body,
    Controller,
    Get,
    HttpCode,
    HttpStatus,
    Inject,
    InternalServerErrorException,
    Logger,
    Param,
    Post,
} from '@nestjs/common';
import {
    CreateFruitUseCase,
    CreateVarietyUseCase,
    GetFruitUseCase,
    GetVarietyUseCase,
} from 'src/application/ports/in/fruit-variety.use-case';
import {
    CreateFruitRequestBodyDTO,
    CreateVarietyRequestBodyDTO,
} from './dto/fruit-variety.dto';

@Controller('fruit-variety')
export class FruitVarietyController {
    private readonly logger = new Logger(FruitVarietyController.name);

    constructor(
        @Inject('CreateFruitUseCase')
        private readonly createFruitUseCase: CreateFruitUseCase,
        @Inject('CreateVarietyUseCase')
        private readonly createVarietyUseCase: CreateVarietyUseCase,
        @Inject('GetFruitUseCase')
        private readonly getFruitUseCase: GetFruitUseCase,
        @Inject('GetVarietyUseCase')
        private readonly getVarietyUseCase: GetVarietyUseCase,
    ) {}

    @Post('fruit')
    @HttpCode(HttpStatus.NO_CONTENT)
    async createFruit(
        @Body() createFruitRequestBodyDTO: CreateFruitRequestBodyDTO,
    ): Promise<void> {
        try {
            this.createFruitUseCase.createFruit(createFruitRequestBodyDTO.name);
        } catch (error) {
            this.logger.error(error.message);
            throw new InternalServerErrorException({
                message: 'Error creating fruit',
            });
        }
    }

    @Get('fruit')
    @HttpCode(HttpStatus.OK)
    async getFruit() {
        try {
            return this.getFruitUseCase.getAllFruits();
        } catch (error) {
            this.logger.error(error.message);
            throw new InternalServerErrorException({
                message: 'Error getting fruits',
            });
        }
    }

    @Get('fruit/:id')
    @HttpCode(HttpStatus.OK)
    async getFruitById(@Param('id') id: number) {
        try {
            return this.getFruitUseCase.getFruit(id);
        } catch (error) {
            this.logger.error(error.message);
            throw new InternalServerErrorException({
                message: 'Error getting fruits',
            });
        }
    }

    @Post('variety')
    @HttpCode(HttpStatus.NO_CONTENT)
    async createVariety(
        @Body() createVarietyRequestBodyDTO: CreateVarietyRequestBodyDTO,
    ): Promise<void> {
        try {
            this.createVarietyUseCase.createVariety({
                name: createVarietyRequestBodyDTO.name,
                fruitId: createVarietyRequestBodyDTO.fruitId,
            });
        } catch (error) {
            this.logger.error(error.message);
            throw new InternalServerErrorException({
                message: 'Error creating fruit',
            });
        }
    }

    @Get('variety')
    @HttpCode(HttpStatus.OK)
    async getVariety() {
        try {
            return this.getVarietyUseCase.getAllVarieties();
        } catch (error) {
            this.logger.error(error.message);
            throw new InternalServerErrorException({
                message: 'Error getting varieties',
            });
        }
    }
}
