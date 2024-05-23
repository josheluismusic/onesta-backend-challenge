import {
    Body,
    Controller,
    Get,
    Inject,
    Param,
    Post,
    UploadedFile,
    UseInterceptors,
} from '@nestjs/common';
import {
    CreateHarvestUseCase,
    GetHarvestUseCase,
    UploadHarvestFileUseCase,
} from 'src/application/ports/in/harvest.use-case';
import { CreateHarvestRequestBodyDTO } from './dto/harvest.dto';
import { FileInterceptor } from '@nestjs/platform-express';

@Controller('harvest')
export class HarvestController {
    constructor(
        @Inject('CreateHarvestUseCase')
        private readonly createHarvestUseCase: CreateHarvestUseCase,
        @Inject('GetHarvestUseCase')
        private readonly getHarvestUseCase: GetHarvestUseCase,
        @Inject('GetHarvestUseCase')
        private readonly uploadHarvestFileUseCase: UploadHarvestFileUseCase,
    ) {}

    @Post()
    async createHarvest(
        @Body() createHarvestRequestBodyDTO: CreateHarvestRequestBodyDTO,
    ) {
        return await this.createHarvestUseCase.createHarvest({
            fruitVariety: { id: createHarvestRequestBodyDTO.fruitVarietyId },
            field: { id: createHarvestRequestBodyDTO.fieldId },
            client: { id: createHarvestRequestBodyDTO.clientId },
            origin: 'MANUAL',
        });
    }

    @Get(':id')
    async getHarvest(@Param('id') id: number) {
        return await this.getHarvestUseCase.getHarvest(id);
    }

    @Get()
    async getAllHarvests() {
        return await this.getHarvestUseCase.getAllHarvests();
    }

    @Post('upload')
    @UseInterceptors(FileInterceptor('file'))
    async uploadHarvestFile(@UploadedFile() file: Express.Multer.File) {
        await this.uploadHarvestFileUseCase.uploadHarvestFile(file.filename);
        return {
            message: 'file uploaded successfully',
            fileName: file.originalname,
        };
    }
}
