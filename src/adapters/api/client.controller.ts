import {
    Body,
    Controller,
    Get,
    HttpCode,
    HttpStatus,
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
} from 'src/application/ports/in/client.use-case';
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
    @HttpCode(HttpStatus.NO_CONTENT)
    async createClient(
        @Body() createClientRequestBodyDTO: CreateClientRequestBodyDTO,
    ): Promise<void> {
        try {
            await this.createClientUseCase.createClient({
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
    @HttpCode(HttpStatus.OK)
    async getClient(@Param('id') id: number) {
        try {
            return await this.getClientUseCase.getClient(id);
        } catch (error) {
            this.logger.error(error.message);
            this.logger.error('Client not found');
            throw new NotFoundException({
                message: error.message,
            });
        }
    }

    @Get('')
    @HttpCode(HttpStatus.OK)
    async getAllClients() {
        try {
            return await this.getClientUseCase.getAllClients();
        } catch (error) {
            this.logger.error(error.message);
            throw new InternalServerErrorException({
                message: error.message,
            });
        }
    }
}
