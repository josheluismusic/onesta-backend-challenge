import { IsEmail, IsNotEmpty, MaxLength, MinLength } from 'class-validator';

export class CreateClientRequestBodyDTO {
    @IsNotEmpty()
    @MinLength(3)
    @MaxLength(50)
    firstName: string;

    @IsNotEmpty()
    @MinLength(3)
    @MaxLength(50)
    lastName: string;

    @IsEmail()
    @IsNotEmpty()
    email: string;
}
