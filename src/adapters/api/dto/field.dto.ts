import {
    IsNotEmpty,
    IsPositive,
    IsString,
    MaxLength,
    Min,
    MinLength,
} from 'class-validator';

export class CreateFieldRequestBodyDTO {
    @IsPositive()
    @Min(1)
    farmerId: number;

    @IsString()
    @IsNotEmpty()
    @MaxLength(100)
    @MinLength(3)
    name: string;

    @IsString()
    @IsNotEmpty()
    @MaxLength(100)
    @MinLength(3)
    location: string;
}
