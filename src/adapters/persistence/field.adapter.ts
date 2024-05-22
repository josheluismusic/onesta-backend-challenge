import { ConflictException, Injectable } from '@nestjs/common';
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
        const fieldExist = await this.fieldRepository.findOne({
            where: { name: field.name, location: field.location },
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

        return this.createField(field);
    }

    async createField(field: FieldModel): Promise<FieldModel> {
        const fieldExist = await this.fieldRepository.findOneBy({
            name: field.name,
            location: field.location,
        });

        if (fieldExist) {
            throw new ConflictException(
                `Field with this name ${field.name} and location ${field.location} already exists`,
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
            name: field.name,
            location: field.location,
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
