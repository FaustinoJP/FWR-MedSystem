import { Body, Controller, Get, Param, Patch, Post, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { RolesGuard } from '../common/guards/roles.guard';
import { Roles } from '../common/decorators/roles.decorator';
import { BillingService } from './billing.service';
import { CreateInvoiceDto } from './dto/create-invoice.dto';
import { CreatePaymentDto } from './dto/create-payment.dto';
import { UpdateInvoiceStatusDto } from './dto/update-invoice-status.dto';
import { UpdatePaymentStatusDto } from './dto/update-payment-status.dto';

@UseGuards(JwtAuthGuard, RolesGuard)
@Controller('billing')
export class BillingController {
  constructor(private readonly billingService: BillingService) {}

  @Get('invoice/:appointmentId')
  @Roles('ADMIN', 'FATURACAO')
  findInvoice(@Param('appointmentId') appointmentId: string) {
    return this.billingService.findInvoiceByAppointment(appointmentId);
  }

  @Post('invoice/:appointmentId')
  @Roles('ADMIN', 'FATURACAO')
  createInvoice(
    @Param('appointmentId') appointmentId: string,
    @Body() dto: CreateInvoiceDto,
  ) {
    return this.billingService.createInvoice(appointmentId, dto);
  }

  @Patch('invoice/:invoiceId/status')
  @Roles('ADMIN', 'FATURACAO')
  updateInvoiceStatus(
    @Param('invoiceId') invoiceId: string,
    @Body() dto: UpdateInvoiceStatusDto,
  ) {
    return this.billingService.updateInvoiceStatus(invoiceId, dto.status);
  }

  @Get('payments/:invoiceId')
  @Roles('ADMIN', 'FATURACAO')
  findPayments(@Param('invoiceId') invoiceId: string) {
    return this.billingService.findPayments(invoiceId);
  }

  @Post('payments/:invoiceId')
  @Roles('ADMIN', 'FATURACAO')
  createPayment(
    @Param('invoiceId') invoiceId: string,
    @Body() dto: CreatePaymentDto,
  ) {
    return this.billingService.createPayment(invoiceId, dto);
  }

  @Patch('payments/:paymentId/status')
  @Roles('ADMIN', 'FATURACAO')
  updatePaymentStatus(
    @Param('paymentId') paymentId: string,
    @Body() dto: UpdatePaymentStatusDto,
  ) {
    return this.billingService.updatePaymentStatus(paymentId, dto.status);
  }
}