import { FieldModel } from 'src/domain/models/field.mode';

export interface CreateFieldPort {
    createField(field: FieldModel): Promise<FieldModel>;
}

export interface GetFieldPort {
    getField(id: number): Promise<FieldModel>;
    getAllFields(): Promise<FieldModel[]>;
    getFieldByFarmer(farmerId: number): Promise<FieldModel[]>;
}
