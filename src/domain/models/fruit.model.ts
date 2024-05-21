import { VarietyModel } from './variety.model';

export class FruitModel {
    id: number;
    name: string;
    varieties?: VarietyModel[];
}
