import { Test, TestingModule } from '@nestjs/testing';
import { ClientService } from 'src/application/services/client.service';
import {
    CreateClientPort,
    GetClientPort,
} from 'src/application/ports/out/client.out';
import { ClientModel } from 'src/domain/models/client.model';
import {
    ConflictException,
    InternalServerErrorException,
    NotFoundException,
} from '@nestjs/common';

describe('ClientService', () => {
    let service: ClientService;
    let createClientPort: CreateClientPort;
    let getClientPort: GetClientPort;

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            providers: [
                ClientService,
                {
                    provide: 'CreateClientPort',
                    useValue: {
                        createClient: jest.fn(),
                    },
                },
                {
                    provide: 'GetClientPort',
                    useValue: {
                        getClient: jest.fn(),
                        getAllClients: jest.fn(),
                    },
                },
            ],
        }).compile();

        service = module.get<ClientService>(ClientService);
        createClientPort = module.get<CreateClientPort>('CreateClientPort');
        getClientPort = module.get<GetClientPort>('GetClientPort');
    });

    it('should be defined', () => {
        expect(service).toBeDefined();
    });

    describe('createClient', () => {
        it('should create a client', async () => {
            const client: ClientModel = {
                id: 1,
                firstName: 'John',
                lastName: 'Doe',
                email: 'john.doe@example.com',
            };
            jest.spyOn(createClientPort, 'createClient').mockResolvedValue(
                client,
            );

            await service.createClient(client);
            expect(createClientPort.createClient).toHaveBeenCalledWith(client);
        });

        it('should throw a ConflictException if createClient fails with unique constraint', async () => {
            const client: ClientModel = {
                id: 1,
                firstName: 'John',
                lastName: 'Doe',
                email: 'john.doe@example.com',
            };
            jest.spyOn(createClientPort, 'createClient').mockRejectedValue(
                new ConflictException('Client with this email already exists'),
            );

            await expect(service.createClient(client)).rejects.toThrow(
                ConflictException,
            );
            expect(createClientPort.createClient).toHaveBeenCalledWith(client);
        });

        it('should log and rethrow if createClient throws an error', async () => {
            const client: ClientModel = {
                id: 1,
                firstName: 'John',
                lastName: 'Doe',
                email: 'john.doe@example.com',
            };
            const errorMessage = 'Internal server error';
            jest.spyOn(createClientPort, 'createClient').mockRejectedValue(
                new Error(errorMessage),
            );

            await expect(service.createClient(client)).rejects.toThrow(
                InternalServerErrorException,
            );
            expect(createClientPort.createClient).toHaveBeenCalledWith(client);
        });
    });

    describe('getClient', () => {
        it('should return a client by id', async () => {
            const client: ClientModel = {
                id: 1,
                firstName: 'John',
                lastName: 'Doe',
                email: 'john.doe@example.com',
            };
            jest.spyOn(getClientPort, 'getClient').mockResolvedValue(client);
            const result = await service.getClient(1);
            expect(result).toEqual(client);
            expect(getClientPort.getClient).toHaveBeenCalledWith(1);
        });

        it('should throw a NotFoundException if client is not found', async () => {
            jest.spyOn(getClientPort, 'getClient').mockRejectedValue(
                new NotFoundException('Client with id 1 not found'),
            );

            await expect(service.getClient(1)).rejects.toThrow(
                NotFoundException,
            );
            expect(getClientPort.getClient).toHaveBeenCalledWith(1);
        });

        it('should log and rethrow if getClient throws an error', async () => {
            const errorMessage = 'Internal server error';
            jest.spyOn(getClientPort, 'getClient').mockRejectedValue(
                new Error(errorMessage),
            );

            await expect(service.getClient(1)).rejects.toThrow(
                InternalServerErrorException,
            );
            expect(getClientPort.getClient).toHaveBeenCalledWith(1);
        });
    });

    describe('getAllClients', () => {
        it('should return all clients', async () => {
            const clients: ClientModel[] = [
                {
                    id: 1,
                    firstName: 'John',
                    lastName: 'Doe',
                    email: 'john.doe@example.com',
                },
            ];
            jest.spyOn(getClientPort, 'getAllClients').mockResolvedValue(
                clients,
            );
            const result = await service.getAllClients();
            expect(result).toEqual(clients);
            expect(getClientPort.getAllClients).toHaveBeenCalled();
        });

        it('should log and rethrow if getAllClients throws an error', async () => {
            const errorMessage = 'Internal server error';
            jest.spyOn(getClientPort, 'getAllClients').mockRejectedValue(
                new InternalServerErrorException(errorMessage),
            );

            await expect(service.getAllClients()).rejects.toThrow(
                InternalServerErrorException,
            );
            expect(getClientPort.getAllClients).toHaveBeenCalled();
        });
    });
});
