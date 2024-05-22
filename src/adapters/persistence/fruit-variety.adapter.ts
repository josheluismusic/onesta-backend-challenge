import { ConflictException, Injectable, Logger } from '@nestjs/common';
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
        return this.fruitRepository
            .findOne({ where: { id }, relations: ['varieties'] })
            .then((fruit) => ({
                id: fruit.id,
                name: fruit.name,
                varieties: fruit.varieties.map((variety) => variety.name),
            }));
    }

    getAllFruits(): Promise<FruitModel[]> {
        this.logger.log(`Getting all fruits`);
        return this.fruitRepository
            .find({
                relations: ['varieties'],
            })
            .then((fruits) => {
                return fruits.map((fruit) => ({
                    id: fruit.id,
                    name: fruit.name,
                    varieties: fruit.varieties.map((variety) => variety.name),
                }));
            });
    }

    async createFruit(name: string): Promise<FruitModel> {
        this.logger.log(`Creating fruit ${name}`);

        const existingFruit = await this.fruitRepository.findOneBy({ name });

        if (existingFruit) {
            this.logger.error(`Fruit with name ${name} already exists`);
            throw new ConflictException(
                `Fruit with name ${name} already exists`,
            );
        }

        const fruit = this.fruitRepository.create({ name });
        const savedFruit = await this.fruitRepository.save(fruit);
        return {
            id: savedFruit.id,
            name: savedFruit.name,
            varieties: [],
        };
    }

    async getAllVarieties(): Promise<VarietyModel[]> {
        this.logger.log(`Getting all varieties`);
        return this.varietyRepository
            .find({
                relations: ['fruit'],
            })
            .then((varieties) => {
                return varieties.map((variety) => ({
                    id: variety.id,
                    name: variety.name,
                    fruit: {
                        id: variety.fruit.id,
                        name: variety.fruit.name,
                    },
                    uniqueKey: variety.uniqueKey,
                }));
            });
    }
    async getVarietyById(id: number): Promise<VarietyModel> {
        this.logger.log(`Getting variety with id ${id}`);
        return this.varietyRepository
            .findOne({
                where: { id },
                relations: ['fruit'],
            })
            .then((variety) => ({
                id: variety.id,
                name: variety.name,
                fruit: {
                    id: variety.fruit.id,
                    name: variety.fruit.name,
                },
                uniqueKey: variety.uniqueKey,
            }));
    }

    async getVarietiesByFruitId(fruitId: number): Promise<VarietyModel[]> {
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
            id: variety.fruit.id,
        });

        if (!fruit) {
            this.logger.error(`Fruit with id ${variety.fruit.id} not found`);
            throw new Error(`Fruit with id ${variety.fruit.id} not found`);
        }

        const uniqueKey = `${fruit.name}-${variety.name}`;

        const existingVariety = await this.varietyRepository.findOneBy({
            uniqueKey,
        });

        if (existingVariety) {
            this.logger.error(`Variety with name ${uniqueKey} already exists`);
            throw new ConflictException(
                `Variety with name ${uniqueKey} already exists`,
            );
        }

        const varietyEntity = this.varietyRepository.create({
            name: variety.name,
            fruit,
            uniqueKey,
        });
        const savedVariety = await this.varietyRepository.save(varietyEntity);
        return {
            id: savedVariety.id,
            name: savedVariety.name,
            fruit: {
                id: fruit.id,
                name: fruit.name,
            },
            uniqueKey,
        };
    }
}
