import {
    Body,
    Controller,
    Get,
    HttpCode,
    HttpStatus,
    Inject,
    InternalServerErrorException,
    Logger,
    NotFoundException,
    Param,
    Post,
} from '@nestjs/common';
import {
    CreateFarmerUseCase,
    GetFarmerUseCase,
} from 'src/application/ports/in/Farmer.use-case';
import { CreateFarmerRequestBodyDTO } from './dto/Farmer.dto';

@Controller('farmer')
export class FarmerController {
    private readonly logger = new Logger(FarmerController.name);
    constructor(
        @Inject('CreateFarmerUseCase')
        private readonly createFarmerUseCase: CreateFarmerUseCase,
        @Inject('GetFarmerUseCase')
        private readonly getFarmerUseCase: GetFarmerUseCase,
    ) {}

    @Post('')
    @HttpCode(HttpStatus.NO_CONTENT)
    async createFarmer(
        @Body() createFarmerRequestBodyDTO: CreateFarmerRequestBodyDTO,
    ): Promise<void> {
        try {
            await this.createFarmerUseCase.createFarmer({
                firstName: createFarmerRequestBodyDTO.firstName,
                lastName: createFarmerRequestBodyDTO.lastName,
                email: createFarmerRequestBodyDTO.email,
            });
        } catch (error) {
            this.logger.error(error.message);
            throw new InternalServerErrorException({
                message: error.message,
            });
        }
    }

    @Get('/:id')
    @HttpCode(HttpStatus.OK)
    async getFarmer(@Param('id') id: number) {
        try {
            return this.getFarmerUseCase.getFarmer(id);
        } catch (error) {
            this.logger.error(error.message);
            this.logger.error('Farmer not found');
            throw new NotFoundException({
                message: error.message,
            });
        }
    }

    @Get('')
    @HttpCode(HttpStatus.OK)
    async getAllFarmers() {
        try {
            return this.getFarmerUseCase.getAllFarmers();
        } catch (error) {
            this.logger.error(error.message);
            throw new InternalServerErrorException({
                message: error.message,
            });
        }
    }
}
