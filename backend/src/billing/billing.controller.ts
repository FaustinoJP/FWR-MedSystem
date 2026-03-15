import {
  Body,
  Controller,
  Get,
  Param,
  Patch,
  Post,
  UseGuards,
} from '@nestjs/common';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { BillingService } from './billing.service';
import { CreateInvoiceDto } from './dto/create-invoice.dto';
import { CreatePaymentDto } from './dto/create-payment.dto';
import { UpdateInvoiceStatusDto } from './dto/update-invoice-status.dto';
import { UpdatePaymentStatusDto } from './dto/update-payment-status.dto';

@UseGuards(JwtAuthGuard)
@Controller()
export class BillingController {
  constructor(private readonly billingService: BillingService) {}

  @Post('appointments/:appointmentId/invoice')
  createInvoice(
    @Param('appointmentId') appointmentId: string,
    @Body() dto: CreateInvoiceDto,
  ) {
    return this.billingService.createInvoice(appointmentId, dto);
  }

  @Get('appointments/:appointmentId/invoice')
  findInvoiceByAppointment(@Param('appointmentId') appointmentId: string) {
    return this.billingService.findInvoiceByAppointment(appointmentId);
  }

  @Patch('invoices/:id/status')
  updateInvoiceStatus(
    @Param('id') id: string,
    @Body() dto: UpdateInvoiceStatusDto,
  ) {
    return this.billingService.updateInvoiceStatus(id, dto);
  }

  @Post('invoices/:invoiceId/payments')
  createPayment(
    @Param('invoiceId') invoiceId: string,
    @Body() dto: CreatePaymentDto,
  ) {
    return this.billingService.createPayment(invoiceId, dto);
  }

  @Get('invoices/:invoiceId/payments')
  listPayments(@Param('invoiceId') invoiceId: string) {
    return this.billingService.listPayments(invoiceId);
  }

  @Patch('payments/:id/status')
  updatePaymentStatus(
    @Param('id') id: string,
    @Body() dto: UpdatePaymentStatusDto,
  ) {
    return this.billingService.updatePaymentStatus(id, dto);
  }
}