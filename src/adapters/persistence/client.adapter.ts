import { NotFoundException, ConflictException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import {
    CreateClientPort,
    GetClientPort,
} from 'src/application/ports/out/client.out';
import { ClientEntity } from './entities';
import { ClientModel } from 'src/domain/models/client.model';

export class ClientAdapter implements CreateClientPort, GetClientPort {
    constructor(
        @InjectRepository(ClientEntity)
        private readonly clientRepository: Repository<ClientEntity>,
    ) {}

    async getOrCreateClientByEmail(client: ClientModel): Promise<ClientModel> {
        const clientExists = await this.getClientByEmail(client.email);

        if (clientExists) {
            clientExists.firstName = client.firstName;
            clientExists.lastName = client.lastName;
            await this.clientRepository.update(clientExists.id, clientExists);
            return {
                id: clientExists.id,
                email: clientExists.email,
                firstName: clientExists.firstName,
                lastName: clientExists.lastName,
            };
        }

        return this.createClient(client);
    }

    async createClient(client: ClientModel): Promise<ClientModel> {
        const clientExists = await this.getClientByEmail(client.email);
        if (clientExists) {
            throw new ConflictException(
                'Client with this email already exists',
            );
        }

        const newClient = this.clientRepository.create(client);
        await this.clientRepository.save(newClient);
        return {
            id: newClient.id,
            firstName: newClient.firstName,
            lastName: newClient.lastName,
            email: newClient.email,
        };
    }

    async getClient(id: number): Promise<ClientModel> {
        const client = await this.clientRepository.findOneBy({ id });
        if (!client) {
            throw new NotFoundException(`Client with id ${id} not found`);
        }
        return {
            id: client.id,
            firstName: client.firstName,
            lastName: client.lastName,
            email: client.email,
        };
    }

    async getAllClients(): Promise<ClientModel[]> {
        return this.clientRepository.find().then((clients) => {
            return clients.map((client) => ({
                id: client.id,
                firstName: client.firstName,
                lastName: client.lastName,
                email: client.email,
            }));
        });
    }

    async getClientByEmail(email: string) {
        return await this.clientRepository.findOneBy({
            email: email,
        });
    }
}
