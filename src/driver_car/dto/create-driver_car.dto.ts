import { IsNumber } from "class-validator"


export class CreateDriverCarDto {
@IsNumber()
readonly carId :number
@IsNumber()
readonly driverId:number
}
