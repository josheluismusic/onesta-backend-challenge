import { ClientModel } from 'src/domain/models/client.model';

export interface CreateClientUseCase {
    createClient(client: ClientModel): Promise<void>;
}

export interface GetClientUseCase {
    getClient(id: number): Promise<ClientModel>;
    getAllClients(): Promise<ClientModel[]>;
}
