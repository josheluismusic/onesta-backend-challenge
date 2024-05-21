import {
    Body,
    Controller,
    Get,
    Inject,
    InternalServerErrorException,
    Logger,
    NotFoundException,
    Param,
    Post,
} from '@nestjs/common';
import {
    CreateClientUseCase,
    GetClientUseCase,
} from 'src/application/ports/in/client.user-case';
import { CreateClientRequestBodyDTO } from './dto/client.dto';

@Controller('client')
export class ClientController {
    private readonly logger = new Logger(ClientController.name);
    constructor(
        @Inject('CreateClientUseCase')
        private readonly createClientUseCase: CreateClientUseCase,
        @Inject('GetClientUseCase')
        private readonly getClientUseCase: GetClientUseCase,
    ) {}

    @Post('')
    async createClient(
        @Body() createClientRequestBodyDTO: CreateClientRequestBodyDTO,
    ): Promise<void> {
        try {
            this.createClientUseCase.createClient({
                firstName: createClientRequestBodyDTO.firstName,
                lastName: createClientRequestBodyDTO.lastName,
                email: createClientRequestBodyDTO.email,
            });
        } catch (error) {
            this.logger.error(error.message);
            throw new InternalServerErrorException({
                message: error.message,
            });
        }
    }

    @Get('/:id')
    async getClient(@Param('id') id: number) {
        try {
            return this.getClientUseCase.getClient(id);
        } catch (error) {
            this.logger.error(error.message);
            this.logger.error('Client not found');
            throw new NotFoundException({
                message: error.message,
            });
        }
    }

    @Get('')
    async getAllClients() {
        try {
            return this.getClientUseCase.getAllClients();
        } catch (error) {
            this.logger.error(error.message);
            throw new InternalServerErrorException({
                message: error.message,
            });
        }
    }
}