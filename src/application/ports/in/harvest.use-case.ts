import { HarvestModel } from 'src/domain/models/harvest.model';

export interface CreateHarvestUseCase {
    createHarvest(harvest: HarvestModel): Promise<HarvestModel>;
}

export interface GetHarvestUseCase {
    getHarvest(id: number): Promise<HarvestModel>;
    getAllHarvests(): Promise<HarvestModel[]>;
}

export interface UploadHarvestFileUseCase {
    uploadHarvestFile(filePath: string): Promise<void>;
}
