import {
    Inject,
    Injectable,
    InternalServerErrorException,
} from '@nestjs/common';
import {
    CreateFieldUseCase,
    GetFieldUseCase,
} from '../ports/in/field.use-case';
import { CreateFieldPort, GetFieldPort } from '../ports/out/field.out';
import { FieldModel } from 'src/domain/models/field.mode';

@Injectable()
export class FieldService implements CreateFieldUseCase, GetFieldUseCase {
    constructor(
        @Inject('CreateFieldPort')
        private readonly createFieldPort: CreateFieldPort,
        @Inject('GetFieldPort')
        private readonly getFieldPort: GetFieldPort,
    ) {}

    async createField(field: FieldModel): Promise<void> {
        try {
            await this.createFieldPort.createField(field);
        } catch (error) {
            throw new InternalServerErrorException(error.message);
        }
    }

    async getField(id: number): Promise<FieldModel> {
        return this.getFieldPort.getField(id);
    }

    async getAllFields(): Promise<FieldModel[]> {
        return this.getFieldPort.getAllFields();
    }

    async getFieldByFarmer(farmerId: number): Promise<FieldModel[]> {
        return this.getFieldPort.getFieldByFarmer(farmerId);
    }
}
