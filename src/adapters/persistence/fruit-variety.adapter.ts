import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { FruitEntity, VarietyEntity } from './entities';
import { VarietyModel, FruitModel } from 'src/domain/models';
import {
    CreateFruitPort,
    CreateVarietyPort,
    GetFruitPort,
    GetVarietyPort,
} from 'src/application/ports/out/fruit-variety.out';

/*
 * Adapter to interact with the database to manage fruits and varieties.
 * This adapter could be injected on services to interact with the database.
 */
@Injectable()
export class FruitVarietyAdapter
    implements CreateFruitPort, CreateVarietyPort, GetFruitPort, GetVarietyPort
{
    private readonly logger = new Logger(FruitVarietyAdapter.name);
    constructor(
        @InjectRepository(FruitEntity)
        private readonly fruitRepository: Repository<FruitEntity>,
        @InjectRepository(VarietyEntity)
        private readonly varietyRepository: Repository<VarietyEntity>,
    ) {}

    async getFruit(id: number): Promise<FruitModel> {
        this.logger.log(`Getting fruit with id ${id}`);
        return this.fruitRepository.findOneBy({ id }).then((fruit) => ({
            id: fruit.id,
            name: fruit.name,
            varieties: [],
        }));
    }

    getAllFruits(): Promise<FruitModel[]> {
        this.logger.log(`Getting all fruits`);
        return this.fruitRepository.find().then((fruits) => {
            return fruits.map((fruit) => ({
                id: fruit.id,
                name: fruit.name,
                varieties: [],
            }));
        });
    }

    async createFruit(name: string): Promise<FruitModel> {
        this.logger.log(`Creating fruit ${name}`);
        const fruit = this.fruitRepository.create({ name });
        const savedFruit = await this.fruitRepository.save(fruit);
        return {
            id: savedFruit.id,
            name: savedFruit.name,
            varieties: [],
        };
    }

    getAllVarieties(): Promise<VarietyModel[]> {
        this.logger.log(`Getting all varieties`);
        return this.varietyRepository.find().then((varieties) => {
            return varieties.map((variety) => ({
                id: variety.id,
                name: variety.name,
                fruitId: null, //variety.fruit.id,
                fruit: null, // variety.fruit.name,
                uniqueKey: variety.uniqueKey,
            }));
        });
    }
    getVarietyById(id: number): Promise<VarietyModel> {
        this.logger.log(`Getting variety with id ${id}`);
        return this.varietyRepository.findOneBy({ id }).then((variety) => ({
            id: variety.id,
            name: variety.name,
            fruitId: null, //variety.fruit.id,
            fruit: null, //variety.fruit.name,
            uniqueKey: variety.uniqueKey,
        }));
    }

    getVarietiesByFruitId(fruitId: number): Promise<VarietyModel[]> {
        this.logger.log(`Getting varieties by fruit id ${fruitId}`);
        return this.varietyRepository
            .find({
                where: { fruit: { id: fruitId } },
            })
            .then((varieties) => {
                return varieties.map((variety) => ({
                    id: variety.id,
                    name: variety.name,
                    fruitId: null, //variety.fruit.id,
                    fruit: null, //variety.fruit.name,
                    uniqueKey: variety.uniqueKey,
                }));
            });
    }

    async createVariety(variety: VarietyModel): Promise<VarietyModel> {
        this.logger.log(`Creating variety ${variety.name}`);
        const fruit = await this.fruitRepository.findOneBy({
            id: variety.fruitId,
        });

        if (!fruit) {
            this.logger.error(`Fruit with id ${variety.fruitId} not found`);
            throw new Error(`Fruit with id ${variety.fruitId} not found`);
        }

        const uniqueKey = `${fruit.name}-${variety.name}`;
        const varietyEntity = this.varietyRepository.create({
            name: variety.name,
            fruit,
            uniqueKey,
        });
        const savedVariety = await this.varietyRepository.save(varietyEntity);
        return {
            id: savedVariety.id,
            name: savedVariety.name,
            fruitId: fruit.id,
            fruit: fruit.name,
            uniqueKey,
        };
    }
}
