import { Body, Controller, Get, Inject, Param, Post } from '@nestjs/common';
import { CreateFieldRequestBodyDTO } from './dto/field.dto';
import {
    CreateFieldUseCase,
    GetFieldUseCase,
} from 'src/application/ports/in/field.use-case';

@Controller('field')
export class FieldController {
    constructor(
        @Inject('CreateFieldUseCase')
        private readonly createFieldUseCase: CreateFieldUseCase,
        @Inject('GetFieldUseCase')
        private readonly getFieldUseCase: GetFieldUseCase,
    ) {}

    @Post('')
    async createField(@Body() field: CreateFieldRequestBodyDTO): Promise<void> {
        await this.createFieldUseCase.createField({
            farmer: {
                id: field.farmerId,
            },
            name: field.name,
            location: field.location,
        });
    }

    @Get('/:id')
    async getField(@Param('id') id: number) {
        return await this.getFieldUseCase.getField(id);
    }

    @Get('')
    async getAllFields() {
        return this.getFieldUseCase.getAllFields();
    }
}
