import {
    ConflictException,
    Injectable,
    NotFoundException,
} from '@nestjs/common';
import {
    CreateFieldPort,
    GetFieldPort,
} from 'src/application/ports/out/field.out';
import { Repository } from 'typeorm';
import { FieldEntity } from './entities/filed.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { FieldModel } from 'src/domain/models/field.mode';
import { FarmerEntity } from './entities';

@Injectable()
export class FieldAdapter implements CreateFieldPort, GetFieldPort {
    constructor(
        @InjectRepository(FieldEntity)
        private readonly fieldRepository: Repository<FieldEntity>,
        @InjectRepository(FarmerEntity)
        private readonly farmerRepository: Repository<FarmerEntity>,
    ) {}

    async getOrCreateFieldByNameAndLocation(
        field: FieldModel,
    ): Promise<FieldModel> {
        const name = field.name.toUpperCase();
        const location = field.location.toUpperCase();

        const fieldExist = await this.fieldRepository.findOne({
            where: {
                name,
                location,
            },
            relations: ['farmer'],
        });

        if (fieldExist) {
            return {
                id: fieldExist.id,
                name: fieldExist.name,
                location: fieldExist.location,
                farmer: fieldExist.farmer,
            };
        }

        return this.createField({ ...field, name, location });
    }

    async createField(field: FieldModel): Promise<FieldModel> {
        const name = field.name.toUpperCase();
        const location = field.location.toUpperCase();

        const fieldExist = await this.fieldRepository.findOneBy({
            name,
            location,
        });

        if (fieldExist) {
            throw new ConflictException(
                `Field with this name ${name} and location ${location} already exists`,
            );
        }

        const farmer = await this.farmerRepository.findOneBy({
            id: field.farmer.id,
        });

        if (!farmer) {
            throw new ConflictException(
                `Farmer with id ${field.farmer.id} not found`,
            );
        }

        const newField = this.fieldRepository.create({
            name,
            location,
            farmer: farmer,
        });

        await this.fieldRepository.save(newField);

        return {
            id: newField.id,
            name: newField.name,
            location: newField.location,
            farmer: farmer,
        };
    }

    async getField(id: number): Promise<FieldModel> {
        return this.fieldRepository
            .findOne({
                where: { id },
                relations: ['farmer'],
            })
            .then((field) => {
                if (!field) {
                    throw new NotFoundException(
                        `Field with id ${id} not found`,
                    );
                }
                return {
                    id: field.id,
                    name: field.name,
                    location: field.location,
                    farmer: field.farmer,
                };
            });
    }

    async getAllFields(): Promise<FieldModel[]> {
        return this.fieldRepository
            .find({
                relations: ['farmer'],
            })
            .then((fields) => {
                return fields.map((field) => ({
                    id: field.id,
                    name: field.name,
                    location: field.location,
                    farmer: field.farmer,
                }));
            });
    }

    async getFieldByFarmer(farmerId: number): Promise<FieldModel[]> {
        return this.fieldRepository
            .find({
                where: { farmer: { id: farmerId } },
            })
            .then((fields) => {
                return fields.map((field) => ({
                    id: field.id,
                    name: field.name,
                    location: field.location,
                    farmer: null,
                }));
            });
    }
}
