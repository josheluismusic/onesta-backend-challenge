import {
    Inject,
    Injectable,
    Logger,
    ConflictException,
    InternalServerErrorException,
    NotFoundException,
} from '@nestjs/common';
import {
    CreateClientUseCase,
    GetClientUseCase,
} from '../ports/in/client.use-case';
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
        try {
            return await this.getClientPort.getClient(id);
        } catch (error) {
            this.logger.error(`Failed to get client by id ${id}`, error.stack);
            if (error instanceof NotFoundException) {
                throw error;
            }
            throw new InternalServerErrorException(error.message);
        }
    }

    async getAllClients(): Promise<ClientModel[]> {
        this.logger.log('Getting all clients');
        try {
            return this.getClientPort.getAllClients();
        } catch (error) {
            this.logger.error('Failed to get all clients', error.stack);
            throw new InternalServerErrorException(error.message);
        }
    }

    async createClient(client: ClientModel): Promise<void> {
        this.logger.log('Creating client');
        try {
            const newClient = await this.createClientPort.createClient(client);
            if (!newClient) {
                throw new Error('Client not created');
            }
        } catch (error) {
            this.logger.error('Failed to create client', error.stack);
            if (error instanceof ConflictException) {
                throw error;
            }
            throw new InternalServerErrorException(error.message);
        }
    }
}
