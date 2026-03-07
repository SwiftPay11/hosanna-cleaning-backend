import {
  IsArray,
  IsInt,
  IsString,
  ValidateNested,
  IsOptional
} from 'class-validator';
import { Type } from 'class-transformer';

class OrderItemDto {
  @IsString()
  serviceId: string;

  @IsInt()
  quantity: number;
}

export class CreateOrderDto {

  @IsOptional()
  @IsString()
  address?: string;

  @IsOptional()
  @IsString()
  scheduleDate?: string;

  @IsOptional()
  @IsString()
  explanation?: string;

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => OrderItemDto)
  items: OrderItemDto[];
}
