import { Inject, Injectable, Logger } from '@nestjs/common';
import {
    CreateClientUseCase,
    GetClientUseCase,
} from '../ports/in/client.user-case';
import { ClientModel } from 'src/domain/models/client.model';
import { CreateClientPort, GetClientPort } from '../ports/out/client.out';

@Injectable()
export class ClientService implements CreateClientUseCase, GetClientUseCase {
    private readonly logger = new Logger(ClientService.name);
    constructor(
        @Inject('CreateClientPort')
        private readonly createClientPort: CreateClientPort,
        @Inject('GetClientPort')
        private readonly getClientPort: GetClientPort,
    ) {}

    async getClient(id: number): Promise<ClientModel> {
        this.logger.log(`Getting client by id ${id}`);
        return await this.getClientPort.getClient(id);
    }
    async getAllClients(): Promise<ClientModel[]> {
        this.logger.log('Getting all clients');
        return this.getClientPort.getAllClients();
    }
    async createClient(client: ClientModel): Promise<void> {
        this.logger.log('Creating client');
        const newClient = await this.createClientPort.createClient(client);
        if (!newClient) {
            throw new Error('Client not created');
        }
    }
}
