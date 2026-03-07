import { IsBoolean, IsNotEmpty, IsNumber, IsString } from 'class-validator';

export class CreateServiceDto {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsString()
  description: string;

  @IsNumber()
  price: number;

  @IsBoolean()
  active: boolean;
}
