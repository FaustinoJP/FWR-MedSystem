import { IsOptional, IsString } from 'class-validator';

export class CreateLabOrderDto {
  @IsString()
  testName: string;

  @IsOptional()
  @IsString()
  category?: string;

  @IsOptional()
  @IsString()
  notes?: string;
}