import {
    ConflictException,
    Injectable,
    Logger,
    NotFoundException,
} from '@nestjs/common';
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

    async getOrCreateFruitByName(name: string): Promise<FruitModel> {
        const fruit = await this.fruitRepository.findOne({
            where: { name: name.toUpperCase() },
            relations: ['varieties'],
        });
        if (fruit) {
            return {
                id: fruit.id,
                name: fruit.name,
                varieties: fruit.varieties.map((variety) => variety.name),
            };
        }

        return this.createFruit(name);
    }

    async getFruit(id: number): Promise<FruitModel> {
        this.logger.log(`Getting fruit with id ${id}`);
        return this.fruitRepository
            .findOne({ where: { id }, relations: ['varieties'] })
            .then((fruit) => {
                if (!fruit) {
                    this.logger.error(`Fruit with id ${id} not found`);
                    throw new NotFoundException(
                        `Fruit with id ${id} not found`,
                    );
                }

                return {
                    id: fruit.id,
                    name: fruit.name,
                    varieties: fruit.varieties.map((variety) => variety.name),
                };
            });
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
        const fruitToUpperCase = name.toUpperCase();

        this.logger.log(`Creating fruit ${fruitToUpperCase}`);

        const existingFruit = await this.fruitRepository.findOneBy({
            name: fruitToUpperCase,
        });

        if (existingFruit) {
            this.logger.error(
                `Fruit with name ${fruitToUpperCase} already exists`,
            );
            throw new ConflictException(
                `Fruit with name ${fruitToUpperCase} already exists`,
            );
        }

        const fruit = this.fruitRepository.create({ name: fruitToUpperCase });
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
            .then((variety) => {
                if (!variety) {
                    this.logger.error(`Variety with id ${id} not found`);
                    throw new NotFoundException(
                        `Variety with id ${id} not found`,
                    );
                }

                return {
                    id: variety.id,
                    name: variety.name,
                    fruit: {
                        id: variety.fruit.id,
                        name: variety.fruit.name,
                    },
                    uniqueKey: variety.uniqueKey,
                };
            });
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

    async getOrCreateVariety(variety: VarietyModel): Promise<VarietyModel> {
        const { uniqueKey, fruit } =
            await this.getUniqueVarietyConstraint(variety);

        const existingVariety = await this.varietyRepository.findOne({
            where: { uniqueKey },
        });

        if (existingVariety) {
            return {
                id: existingVariety.id,
                name: existingVariety.name,
                fruit: {
                    id: fruit.id,
                    name: fruit.name,
                },
                uniqueKey,
            };
        }

        return await this.createVariety(variety);
    }

    async createVariety(variety: VarietyModel): Promise<VarietyModel> {
        const { uniqueKey, fruit } =
            await this.getUniqueVarietyConstraint(variety);

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

    private async getUniqueVarietyConstraint(variety: VarietyModel) {
        this.logger.log(`Creating variety ${variety.name}`);
        const fruit = await this.fruitRepository.findOneBy({
            id: variety.fruit.id,
        });

        if (!fruit) {
            this.logger.error(`Fruit with id ${variety.fruit.id} not found`);
            throw new ConflictException(
                `Fruit with id ${variety.fruit.id} not found`,
            );
        }

        const uniqueKey =
            `${fruit.name}-${variety.name.replace(' ', '-')}`.toUpperCase();
        return { uniqueKey, fruit };
    }
}
