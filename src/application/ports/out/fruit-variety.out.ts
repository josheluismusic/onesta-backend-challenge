import { FruitModel, VarietyModel } from 'src/domain/models';

/*
 * Interfaces for interaction with database to manage fruits. Only adapater should implement this port.
 */
export interface CreateFruitPort {
    createFruit(name: string): Promise<FruitModel>;
}

export interface GetFruitPort {
    getFruit(id: number): Promise<FruitModel>;
    getAllFruits(): Promise<FruitModel[]>;
}

/*
 * Interfaces for interaction with database to manage varieties. Only adapater should implement this port.
 */
export interface CreateVarietyPort {
    createVariety(variety: VarietyModel): Promise<VarietyModel>;
}

export interface GetVarietyPort {
    getAllVarieties(): Promise<VarietyModel[]>;
    getVarietyById(id: number): Promise<VarietyModel>;
    getVarietiesByFruitId(fruitId: number): Promise<VarietyModel[]>;
}
