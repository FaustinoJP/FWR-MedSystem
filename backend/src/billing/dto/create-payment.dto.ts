import { IsISO8601, IsNumber, IsObject, IsOptional, IsString } from 'class-validator';

export class CreatePaymentDto {
  @IsString()
  paymentMethodId: string;

  @IsNumber()
  amount: number;

  @IsOptional()
  @IsString()
  reference?: string;

  @IsOptional()
  @IsString()
  transactionReference?: string;

  @IsOptional()
  @IsString()
  externalTransactionId?: string;

  @IsOptional()
  @IsISO8601()
  expiresAt?: string;

  @IsOptional()
  @IsObject()
  metadata?: Record<string, any>;
}