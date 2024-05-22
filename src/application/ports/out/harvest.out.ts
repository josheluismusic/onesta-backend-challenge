import { HarvestModel } from 'src/domain/models/harvest.model';

export interface CreateHarvestPort {
    createHarvest(harvest: HarvestModel): Promise<any>;
}

export interface GetHarvestPort {
    getHarvest(id: number): Promise<HarvestModel>;
    getAllHarvests(): Promise<HarvestModel[]>;
}
