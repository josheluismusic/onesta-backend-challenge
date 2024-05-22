import { IsPositive, Min } from 'class-validator';

export class CreateHarvestRequestBodyDTO {
    @IsPositive()
    @Min(1)
    fruitVarietyId: number;

    @IsPositive()
    @Min(1)
    fieldId: number;

    @IsPositive()
    @Min(1)
    clientId: number;
}
