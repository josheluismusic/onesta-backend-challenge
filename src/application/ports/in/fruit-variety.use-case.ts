import { FruitModel, VarietyModel } from 'src/domain/models';
/*
 * Use cases to manage fruits
 * Use cases are implemented by services and used by controllers.
 */
export interface CreateFruitUseCase {
    createFruit(name: string): Promise<void>;
}

export interface GetFruitUseCase {
    getAllFruits(): Promise<FruitModel[]>;
    getFruit(id: number): Promise<FruitModel>;
}

/*
 * Use cases to manage varieties
 * Use cases are implemented by services and used by controllers.
 */
export interface CreateVarietyUseCase {
    createVariety(variety: VarietyModel): Promise<void>;
}

export interface GetVarietyUseCase {
    getAllVarieties(): Promise<VarietyModel[]>;
    getVariety(id: number): Promise<VarietyModel>;
    GetVarietiesByFruitId(fruitId: number): Promise<VarietyModel[]>;
}
