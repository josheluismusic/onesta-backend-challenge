import { FieldModel } from 'src/domain/models/field.mode';

export interface CreateFieldUseCase {
    createField(field: FieldModel): Promise<void>;
}

export interface GetFieldUseCase {
    getField(id: number): Promise<FieldModel>;
    getAllFields(): Promise<FieldModel[]>;
    getFieldByFarmer(farmerId: number): Promise<FieldModel[]>;
}
