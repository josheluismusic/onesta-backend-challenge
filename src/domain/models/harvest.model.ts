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

export class HarvestUploadModel {
    recordNumber: number;
    // Mail Agricultor
    farmerEmail: string;

    // Nombre Agricultor
    farmerFirstName: string;

    // Apellido Agricultor
    farmerLastName: string;

    // Mail Cliente
    clientEmail: string;

    // Nombre Cliente
    clientFirstName: string;

    // Apellido Cliente
    clientLastName: string;

    // Nombre Campo
    fieldName: string;

    // Ubicación de Campo
    fieldLocation: string;

    // Fruta Cosechada
    harvestedFruit: string;

    // Variedad Cosechada
    harvestedVariety: string;
}
