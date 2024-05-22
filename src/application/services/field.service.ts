import {
    Inject,
    Injectable,
    InternalServerErrorException,
    Logger,
    NotFoundException,
} from '@nestjs/common';
import {
    CreateFieldUseCase,
    GetFieldUseCase,
} from '../ports/in/field.use-case';
import { CreateFieldPort, GetFieldPort } from '../ports/out/field.out';
import { FieldModel } from 'src/domain/models/field.mode';

@Injectable()
export class FieldService implements CreateFieldUseCase, GetFieldUseCase {
    private readonly logger = new Logger(FieldService.name);
    constructor(
        @Inject('CreateFieldPort')
        private readonly createFieldPort: CreateFieldPort,
        @Inject('GetFieldPort')
        private readonly getFieldPort: GetFieldPort,
    ) {}

    async createField(field: FieldModel): Promise<void> {
        try {
            this.logger.log('Creating field');
            await this.createFieldPort.createField(field);
        } catch (error) {
            throw new InternalServerErrorException(error.message);
        }
    }

    async getField(id: number): Promise<FieldModel> {
        try {
            this.logger.log(`Getting field by id ${id}`);
            return this.getFieldPort.getField(id);
        } catch (error) {
            this.logger.error(`Failed to get field by id ${id}`, error.stack);
            if (error instanceof NotFoundException) {
                throw error;
            }
            throw new InternalServerErrorException(error.message);
        }
    }

    async getAllFields(): Promise<FieldModel[]> {
        try {
            this.logger.log('Getting all fields');
            return this.getFieldPort.getAllFields();
        } catch (error) {
            this.logger.error('Failed to get all fields', error.stack);
            if (error instanceof NotFoundException) {
                throw error;
            }
            throw new InternalServerErrorException(error.message);
        }
    }

    async getFieldByFarmer(farmerId: number): Promise<FieldModel[]> {
        try {
            this.logger.log(`Getting fields by farmer id ${farmerId}`);
            return this.getFieldPort.getFieldByFarmer(farmerId);
        } catch (error) {
            this.logger.error(
                `Failed to get fields by farmer id ${farmerId}`,
                error.stack,
            );
            if (error instanceof NotFoundException) {
                throw error;
            }
            throw new InternalServerErrorException(error.message);
        }
    }
}
