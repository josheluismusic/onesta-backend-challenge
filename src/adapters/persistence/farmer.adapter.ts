import {
    CreateFarmerPort,
    GetFarmerPort,
} from 'src/application/ports/out/Farmer.out';
import { FarmerEntity } from './entities';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { FarmerModel } from 'src/domain/models/Farmer.model';
import { ConflictException, NotFoundException } from '@nestjs/common';

export class FarmerAdapter implements CreateFarmerPort, GetFarmerPort {
    constructor(
        @InjectRepository(FarmerEntity)
        private readonly FarmerRepository: Repository<FarmerEntity>,
    ) {}

    async createFarmer(farmer: FarmerModel): Promise<FarmerModel> {
        const farmerExists = await this.FarmerRepository.findOneBy({
            email: farmer.email,
        });

        if (farmerExists) {
            throw new ConflictException(
                'Farmer with this email already exists',
            );
        }

        const newFarmer = this.FarmerRepository.create(farmer);
        await this.FarmerRepository.save(newFarmer);
        return {
            id: newFarmer.id,
            firstName: newFarmer.firstName,
            lastName: newFarmer.lastName,
            email: newFarmer.email,
        };
    }

    async getFarmer(id: number): Promise<FarmerModel> {
        const farmer = await this.FarmerRepository.findOne({
            where: { id },
            relations: ['fields'],
        });
        if (!farmer) {
            throw new NotFoundException(`Farmer with id ${id} not found`);
        }
        return {
            id: farmer.id,
            firstName: farmer.firstName,
            lastName: farmer.lastName,
            email: farmer.email,
            fields: farmer.fields.map((field) => ({
                name: field.name,
                location: field.location,
            })),
        };
    }

    async getAllFarmers(): Promise<FarmerModel[]> {
        return this.FarmerRepository.find({
            relations: ['fields'],
        }).then((farmer) => {
            return farmer.map((farmer) => ({
                id: farmer.id,
                firstName: farmer.firstName,
                lastName: farmer.lastName,
                email: farmer.email,
                fields: farmer.fields.map((field) => ({
                    name: field.name,
                    location: field.location,
                })),
            }));
        });
    }
}
