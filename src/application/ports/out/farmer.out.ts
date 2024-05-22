import { FarmerModel } from '../../../domain/models/Farmer.model';

export interface CreateFarmerPort {
    createFarmer(Farmer: FarmerModel): Promise<FarmerModel>;
}

export interface GetFarmerPort {
    getFarmer(id: number): Promise<FarmerModel>;
    getAllFarmers(): Promise<FarmerModel[]>;
}
