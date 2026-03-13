import { IsInt, IsNumber, IsOptional, IsString } from 'class-validator';

export class CreateTriageDto {
  @IsOptional()
  @IsNumber()
  weight?: number;

  @IsOptional()
  @IsNumber()
  height?: number;

  @IsOptional()
  @IsNumber()
  temperature?: number;

  @IsOptional()
  @IsString()
  bloodPressure?: string;

  @IsOptional()
  @IsInt()
  heartRate?: number;

  @IsOptional()
  @IsInt()
  respiratoryRate?: number;

  @IsOptional()
  @IsInt()
  oxygenSaturation?: number;

  @IsOptional()
  @IsString()
  notes?: string;
}
