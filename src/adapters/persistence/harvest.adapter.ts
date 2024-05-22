import { ConflictException, Injectable } from '@nestjs/common';
import {
    CreateHarvestPort,
    GetHarvestPort,
} from 'src/application/ports/out/harvest.out';
import { Repository } from 'typeorm';
import { HarvestEntity } from './entities/harvest.entity';
import { HarvestModel } from 'src/domain/models/harvest.model';
import { InjectRepository } from '@nestjs/typeorm';
import { ClientEntity, VarietyEntity } from './entities';
import { FieldEntity } from './entities/filed.entity';
@Injectable()
export class HarvestAdapter implements CreateHarvestPort, GetHarvestPort {
    constructor(
        @InjectRepository(HarvestEntity)
        private readonly harvestRepository: Repository<HarvestEntity>,
        @InjectRepository(ClientEntity)
        private readonly clientRepository: Repository<ClientEntity>,
        @InjectRepository(FieldEntity)
        private readonly fieldRepository: Repository<FieldEntity>,
        @InjectRepository(VarietyEntity)
        private readonly fruitVarietyRepository: Repository<VarietyEntity>,
    ) {}

    async getHarvest(id: number): Promise<HarvestModel> {
        return this.harvestRepository
            .findOne({
                where: { id },
                relations: ['variety', 'client', 'field'],
            })
            .then((harvest) => {
                if (!harvest) {
                    return null;
                }
                return {
                    id: harvest.id,
                    fruitVariety: null,
                    variety: {
                        id: harvest.variety.id,
                        name: harvest.variety.name,
                    },
                    field: null,
                    client: {
                        id: harvest.client.id,
                        firstName: harvest.client.firstName,
                        lastName: harvest.client.lastName,
                    },
                    date: harvest.date,
                    origin: harvest.origin,
                };
            });
    }

    getAllHarvests(): Promise<HarvestModel[]> {
        return this.harvestRepository
            .find({ relations: ['variety', 'client', 'field'] })
            .then((harvests) => {
                return harvests.map((harvest) => ({
                    id: harvest.id,
                    fruitVariety: harvest.variety,
                    field: harvest.field,
                    client: harvest.client,
                    date: harvest.date,
                    origin: harvest.origin,
                }));
            });
    }
    async createHarvest(harvest: HarvestModel): Promise<HarvestModel> {
        const fruitVarietyExists = await this.fruitVarietyRepository.findOne({
            where: { id: harvest.fruitVariety.id },
        });

        if (!fruitVarietyExists) {
            throw new ConflictException(
                `Fruit variety with id ${harvest.fruitVariety.id} not found`,
            );
        }

        const fieldExists = await this.fieldRepository.findOne({
            where: { id: harvest.field.id },
        });

        if (!fieldExists) {
            throw new ConflictException(
                `Field with id ${harvest.field.id} not found`,
            );
        }

        const clientExists = await this.clientRepository.findOne({
            where: { id: harvest.client.id },
        });

        if (!clientExists) {
            throw new ConflictException(
                `Client with id ${harvest.client.id} not found`,
            );
        }

        const newHarvest = this.harvestRepository.create({
            variety: fruitVarietyExists,
            field: fieldExists,
            client: clientExists,
            date: Date.now(),
            origin: harvest.origin,
        });

        await this.harvestRepository.save(newHarvest);
        return {
            id: newHarvest.id,
            fruitVariety: newHarvest.variety,
            field: newHarvest.field,
            client: newHarvest.client,
            date: newHarvest.date,
            origin: newHarvest.origin,
        };
    }
}
