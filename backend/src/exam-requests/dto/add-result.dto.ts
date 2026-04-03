import { IsOptional, IsString, IsObject } from 'class-validator';

export class AddResultDto {
  @IsObject()
  @IsOptional()
  result?: any;        // Json flexível para resultados

  @IsString()
  @IsOptional()
  notes?: string;
}