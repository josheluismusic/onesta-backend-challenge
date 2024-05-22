import { HarvestOriginInfomation } from '../types/harvest.types';

export class HarvestModel {
    id?: number;
    fruitVariety: {
        id: number;
        name?: string;
    };
    field: {
        id: number;
        name?: string;
        location?: string;
    };
    client: {
        id: number;
        firstName?: string;
        lastName?: string;
    };
    date?: Date;
    origin: HarvestOriginInfomation;
}
