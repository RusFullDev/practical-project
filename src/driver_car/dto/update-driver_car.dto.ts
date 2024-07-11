import { IsNumber } from "class-validator";

export class UpdateDriverCarDto {
    @IsNumber()
    readonly driverId?: number;
    @IsNumber()
    readonly carId?: number;
}

