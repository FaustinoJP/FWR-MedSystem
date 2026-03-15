import { IsNumber, IsOptional, IsString } from 'class-validator';

export class CreateInvoiceDto {
  @IsOptional()
  @IsString()
  description?: string;

  @IsNumber()
  totalAmount: number;

  @IsOptional()
  @IsNumber()
  discountAmount?: number;
}