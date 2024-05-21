import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ClientAdapter } from 'src/adapters/persistence/client.adapter';
import { ClientEntity } from 'src/adapters/persistence/entities';
import { ClientModel } from 'src/domain/models/client.model';
import { NotFoundException } from '@nestjs/common';

describe('ClientAdapter', () => {
    let adapter: ClientAdapter;
    let clientRepository: Repository<ClientEntity>;

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            providers: [
                ClientAdapter,
                {
                    provide: getRepositoryToken(ClientEntity),
                    useClass: Repository,
                },
            ],
        }).compile();

        adapter = module.get<ClientAdapter>(ClientAdapter);
        clientRepository = module.get<Repository<ClientEntity>>(
            getRepositoryToken(ClientEntity),
        );
    });

    it('should be defined', () => {
        expect(adapter).toBeDefined();
    });

    describe('createClient', () => {
        it('should create a client', async () => {
            const client: ClientModel = {
                id: 1,
                firstName: 'John',
                lastName: 'Doe',
                email: 'john.doe@example.com',
            };
            const clientEntity = new ClientEntity();
            Object.assign(clientEntity, client);

            jest.spyOn(clientRepository, 'create').mockReturnValue(
                clientEntity,
            );
            jest.spyOn(clientRepository, 'save').mockResolvedValue(
                clientEntity,
            );

            const result = await adapter.createClient(client);
            expect(result).toEqual(client);
            expect(clientRepository.create).toHaveBeenCalledWith(client);
            expect(clientRepository.save).toHaveBeenCalledWith(clientEntity);
        });
    });

    describe('getClient', () => {
        it('should return a client by id', async () => {
            const clientEntity = new ClientEntity();
            clientEntity.id = 1;
            clientEntity.firstName = 'John';
            clientEntity.lastName = 'Doe';
            clientEntity.email = 'john.doe@example.com';

            jest.spyOn(clientRepository, 'findOneBy').mockResolvedValue(
                clientEntity,
            );

            const result = await adapter.getClient(1);
            expect(result).toEqual({
                id: 1,
                firstName: 'John',
                lastName: 'Doe',
                email: 'john.doe@example.com',
            });
            expect(clientRepository.findOneBy).toHaveBeenCalledWith({ id: 1 });
        });

        it('should throw NotFoundException if client is not found', async () => {
            jest.spyOn(clientRepository, 'findOneBy').mockResolvedValue(null);

            await expect(adapter.getClient(1)).rejects.toThrow(
                NotFoundException,
            );
            expect(clientRepository.findOneBy).toHaveBeenCalledWith({ id: 1 });
        });
    });

    describe('getAllClients', () => {
        it('should return all clients', async () => {
            const clients = [
                {
                    id: 1,
                    firstName: 'John',
                    lastName: 'Doe',
                    email: 'john.doe@example.com',
                },
            ];
            const clientEntities = clients.map((client) => {
                const entity = new ClientEntity();
                Object.assign(entity, client);
                return entity;
            });

            jest.spyOn(clientRepository, 'find').mockResolvedValue(
                clientEntities,
            );

            const result = await adapter.getAllClients();
            expect(result).toEqual(clients);
            expect(clientRepository.find).toHaveBeenCalled();
        });
    });
});
