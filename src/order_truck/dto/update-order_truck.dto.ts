import { PartialType } from '@nestjs/mapped-types';
import { CreateOrderTruckDto } from './create-order_truck.dto';

export class UpdateOrderTruckDto extends PartialType(CreateOrderTruckDto) {}
