import { FarmerModel } from 'src/domain/models/farmer.model';

export interface CreateFarmerUseCase {
    createFarmer(farmer: FarmerModel): Promise<void>;
}

export interface GetFarmerUseCase {
    getFarmer(id: number): Promise<FarmerModel>;
    getAllFarmers(): Promise<FarmerModel[]>;
}
