import { IsString, IsNotEmpty, IsOptional, IsNumber, IsBoolean, IsDecimal } from 'class-validator';
import { Type } from 'class-transformer';

export class CreateExamTypeDto {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsString()
  @IsNotEmpty()
  code: string;

  @IsString()
  @IsOptional()
  description?: string;

  @IsNumber()
  @Type(() => Number)
  price: number;

  @IsString()
  @IsOptional()
  department?: string;

  @IsString()
  @IsOptional()
  category?: string;

  @IsBoolean()
  @IsOptional()
  isActive?: boolean;
}