import { IsString } from 'class-validator';

export class UpdateInvoiceStatusDto {
  @IsString()
  status: string;
}