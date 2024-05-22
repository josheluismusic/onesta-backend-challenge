import { ClientModel } from '../../../domain/models/client.model';

export interface CreateClientPort {
    createClient(client: ClientModel): Promise<ClientModel>;
    getOrCreateClientByEmail(client: ClientModel): Promise<ClientModel>;
}

export interface GetClientPort {
    getClient(id: number): Promise<ClientModel>;
    getAllClients(): Promise<ClientModel[]>;
}
