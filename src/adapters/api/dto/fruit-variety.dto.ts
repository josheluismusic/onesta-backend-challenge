import {
    IsNotEmpty,
    IsPositive,
    IsString,
    MaxLength,
    Min,
    MinLength,
} from 'class-validator';

export class CreateFruitRequestBodyDTO {
    @IsString()
    @IsNotEmpty()
    @MaxLength(100)
    @MinLength(3)
    name: string;
}

export class CreateVarietyRequestBodyDTO {
    @IsString()
    @IsNotEmpty()
    @MaxLength(100)
    @MinLength(3)
    name: string;

    @IsPositive()
    @Min(1)
    fruitId: number;
}
