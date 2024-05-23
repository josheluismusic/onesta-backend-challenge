import { InjectRepository } from '@nestjs/typeorm';
import { ConflictException, NotFoundException } from '@nestjs/common';
import { Repository } from 'typeorm';

import {
    CreateFarmerPort,
    GetFarmerPort,
} from 'src/application/ports/out/farmer.out';
import { FarmerEntity } from './entities';
import { FarmerModel } from 'src/domain/models/farmer.model';

export class FarmerAdapter implements CreateFarmerPort, GetFarmerPort {
    constructor(
        @InjectRepository(FarmerEntity)
        private readonly farmerRepository: Repository<FarmerEntity>,
    ) {}

    async getOrCreateFarmerByEmail(client: FarmerModel): Promise<FarmerModel> {
        const farmerExists = await this.getFarmerByEmail(client.email);

        if (farmerExists) {
            farmerExists.firstName = client.firstName;
            farmerExists.lastName = client.lastName;
            await this.farmerRepository.update(farmerExists.id, farmerExists);
            return {
                id: farmerExists.id,
                email: farmerExists.email,
                firstName: farmerExists.firstName,
                lastName: farmerExists.lastName,
            };
        }

        return this.createFarmer(client);
    }

    async createFarmer(farmer: FarmerModel): Promise<FarmerModel> {
        const farmerExists = await this.farmerRepository.findOneBy({
            email: farmer.email,
        });

        if (farmerExists) {
            throw new ConflictException(
                'Farmer with this email already exists',
            );
        }

        const newFarmer = this.farmerRepository.create(farmer);
        await this.farmerRepository.save(newFarmer);
        return {
            id: newFarmer.id,
            firstName: newFarmer.firstName,
            lastName: newFarmer.lastName,
            email: newFarmer.email,
        };
    }

    async getFarmer(id: number): Promise<FarmerModel> {
        const farmer = await this.farmerRepository.findOne({
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
        return this.farmerRepository
            .find({
                relations: ['fields'],
            })
            .then((farmer) => {
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

    async getFarmerByEmail(email: string) {
        return await this.farmerRepository.findOneBy({
            email: email,
        });
    }
}
