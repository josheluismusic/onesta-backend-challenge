import { FarmerModel } from '../../../domain/models/farmer.model';

export interface CreateFarmerPort {
    createFarmer(Farmer: FarmerModel): Promise<FarmerModel>;
    getOrCreateFarmerByEmail(client: FarmerModel): Promise<FarmerModel>;
}

export interface GetFarmerPort {
    getFarmer(id: number): Promise<FarmerModel>;
    getAllFarmers(): Promise<FarmerModel[]>;
}
