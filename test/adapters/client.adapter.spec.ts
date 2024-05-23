import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ClientModel } from 'src/domain/models/client.model';
import { NotFoundException, ConflictException } from '@nestjs/common';
import { ClientEntity } from 'src/adapters/persistence/entities';
import { ClientAdapter } from 'src/adapters/persistence/client.adapter';

describe('ClientAdapter', () => {
    let adapter: ClientAdapter;
    let repository: Repository<ClientEntity>;

    const clientEntity = new ClientEntity();
    clientEntity.id = 1;
    clientEntity.firstName = 'John';
    clientEntity.lastName = 'Doe';
    clientEntity.email = 'john.doe@example.com';

    const clientModel: ClientModel = {
        id: 1,
        firstName: 'John',
        lastName: 'Doe',
        email: 'john.doe@example.com',
    };

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
        repository = module.get<Repository<ClientEntity>>(
            getRepositoryToken(ClientEntity),
        );
    });

    it('should be defined', () => {
        expect(adapter).toBeDefined();
    });

    describe('getOrCreateClientByEmail', () => {
        it('should return an existing client', async () => {
            jest.spyOn(adapter, 'getClientByEmail').mockResolvedValue(
                clientEntity,
            );
            jest.spyOn(repository, 'update').mockResolvedValue(undefined);

            const result = await adapter.getOrCreateClientByEmail(clientModel);
            expect(result).toEqual(clientModel);
        });

        it('should create a new client if it does not exist', async () => {
            jest.spyOn(adapter, 'getClientByEmail').mockResolvedValue(
                undefined,
            );
            jest.spyOn(repository, 'create').mockReturnValue(clientEntity);
            jest.spyOn(repository, 'save').mockResolvedValue(clientEntity);

            const result = await adapter.getOrCreateClientByEmail(clientModel);
            expect(result).toEqual(clientModel);
        });
    });

    describe('createClient', () => {
        it('should throw ConflictException if client already exists', async () => {
            jest.spyOn(adapter, 'getClientByEmail').mockResolvedValue(
                clientEntity,
            );

            await expect(adapter.createClient(clientModel)).rejects.toThrow(
                ConflictException,
            );
        });

        it('should create and return a new client', async () => {
            jest.spyOn(adapter, 'getClientByEmail').mockResolvedValue(
                undefined,
            );
            jest.spyOn(repository, 'create').mockReturnValue(clientEntity);
            jest.spyOn(repository, 'save').mockResolvedValue(clientEntity);

            const result = await adapter.createClient(clientModel);
            expect(result).toEqual(clientModel);
        });
    });

    describe('getClient', () => {
        it('should return a client if found', async () => {
            jest.spyOn(repository, 'findOneBy').mockResolvedValue(clientEntity);

            const result = await adapter.getClient(1);
            expect(result).toEqual(clientModel);
        });

        it('should throw NotFoundException if client not found', async () => {
            jest.spyOn(repository, 'findOneBy').mockResolvedValue(undefined);

            await expect(adapter.getClient(1)).rejects.toThrow(
                NotFoundException,
            );
        });
    });

    describe('getAllClients', () => {
        it('should return an array of clients', async () => {
            jest.spyOn(repository, 'find').mockResolvedValue([clientEntity]);

            const result = await adapter.getAllClients();
            expect(result).toEqual([clientModel]);
        });
    });

    describe('getClientByEmail', () => {
        it('should return a client if found by email', async () => {
            jest.spyOn(repository, 'findOneBy').mockResolvedValue(clientEntity);

            const result = await adapter.getClientByEmail(clientModel.email);
            expect(result).toEqual(clientEntity);
        });

        it('should return undefined if client not found by email', async () => {
            jest.spyOn(repository, 'findOneBy').mockResolvedValue(undefined);

            const result = await adapter.getClientByEmail(clientModel.email);
            expect(result).toBeUndefined();
        });
    });
});
