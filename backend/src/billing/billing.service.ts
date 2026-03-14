import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateInvoiceDto } from './dto/create-invoice.dto';
import { CreatePaymentDto } from './dto/create-payment.dto';
import { UpdateInvoiceStatusDto } from './dto/update-invoice-status.dto';
import { UpdatePaymentStatusDto } from './dto/update-payment-status.dto';

@Injectable()
export class BillingService {
  constructor(private prisma: PrismaService) {}

  async createInvoice(appointmentId: string, dto: CreateInvoiceDto) {
    const appointment = await this.prisma.appointment.findUnique({
      where: { id: appointmentId },
      include: { Invoice: true, patient: true },
    });

    if (!appointment) {
      throw new NotFoundException('Consulta não encontrada');
    }

    if (appointment.Invoice) {
      throw new ConflictException('Já existe uma fatura para esta consulta');
    }

    const totalAmount = Number(dto.totalAmount ?? 0);
    const discountAmount = Number(dto.discountAmount ?? 0);
    const balance = totalAmount - discountAmount;

    const count = await this.prisma.invoice.count();
    const invoiceNumber = `INV-${new Date().getFullYear()}-${String(count + 1).padStart(6, '0')}`;

    return this.prisma.invoice.create({
      data: {
        appointmentId,
        patientId: appointment.patientId,
        invoiceNumber,
        description: dto.description || 'Faturação da consulta',
        totalAmount,
        discountAmount,
        paidAmount: 0,
        balance,
        status: 'ISSUED' as any,
      },
      include: {
        patient: true,
        appointment: true,
        items: true,
        payments: {
          include: {
            paymentMethod: true,
          },
        },
      },
    });
  }

  async findInvoiceByAppointment(appointmentId: string) {
    const invoice = await this.prisma.invoice.findFirst({
      where: { appointmentId },
      include: {
        patient: true,
        appointment: true,
        items: true,
        payments: {
          include: {
            paymentMethod: true,
          },
          orderBy: { createdAt: 'desc' },
        },
      },
    });

    if (!invoice) {
      throw new NotFoundException('Fatura não encontrada para esta consulta');
    }

    return invoice;
  }

  async updateInvoiceStatus(id: string, dto: UpdateInvoiceStatusDto) {
    const invoice = await this.prisma.invoice.findUnique({
      where: { id },
    });

    if (!invoice) {
      throw new NotFoundException('Fatura não encontrada');
    }

    return this.prisma.invoice.update({
      where: { id },
      data: {
        status: dto.status as any,
      },
    });
  }

  async createPayment(invoiceId: string, dto: CreatePaymentDto) {
    const invoice = await this.prisma.invoice.findUnique({
      where: { id: invoiceId },
      include: { payments: true },
    });

    if (!invoice) {
      throw new NotFoundException('Fatura não encontrada');
    }

    const paymentMethod = await this.prisma.paymentMethod.findUnique({
      where: { id: dto.paymentMethodId },
    });

    if (!paymentMethod || !paymentMethod.isActive) {
      throw new NotFoundException('Método de pagamento não encontrado ou inativo');
    }

    const payment = await this.prisma.payment.create({
      data: {
        invoiceId,
        paymentMethodId: dto.paymentMethodId,
        amount: dto.amount,
        status: paymentMethod.type === 'RUP' ? ('REFERENCE_GENERATED' as any) : ('PAID' as any),
        reference: dto.reference,
        transactionReference: dto.transactionReference,
        externalTransactionId: dto.externalTransactionId,
        paidAt: paymentMethod.type === 'RUP' ? null : new Date(),
        expiresAt: dto.expiresAt ? new Date(dto.expiresAt) : null,
        metadata: dto.metadata,
      },
      include: {
        paymentMethod: true,
        invoice: true,
      },
    });

    await this.recalculateInvoice(invoiceId);

    return payment;
  }

  async listPayments(invoiceId: string) {
    return this.prisma.payment.findMany({
      where: { invoiceId },
      include: {
        paymentMethod: true,
      },
      orderBy: { createdAt: 'desc' },
    });
  }

  async updatePaymentStatus(id: string, dto: UpdatePaymentStatusDto) {
    const payment = await this.prisma.payment.findUnique({
      where: { id },
    });

    if (!payment) {
      throw new NotFoundException('Pagamento não encontrado');
    }

    const updated = await this.prisma.payment.update({
      where: { id },
      data: {
        status: dto.status as any,
        paidAt: dto.status === 'PAID' ? new Date() : payment.paidAt,
      },
      include: {
        paymentMethod: true,
        invoice: true,
      },
    });

    await this.recalculateInvoice(payment.invoiceId);

    return updated;
  }

  private async recalculateInvoice(invoiceId: string) {
    const invoice = await this.prisma.invoice.findUnique({
      where: { id: invoiceId },
      include: { payments: true },
    });

    if (!invoice) return;

    const paidAmount = invoice.payments
      .filter((p) => p.status === 'PAID')
      .reduce((sum, p) => sum + Number(p.amount), 0);

    const totalNet = Number(invoice.totalAmount) - Number(invoice.discountAmount);
    const balance = totalNet - paidAmount;

    let status: string = 'ISSUED';

    if (paidAmount <= 0) {
      status = 'ISSUED';
    } else if (paidAmount > 0 && balance > 0) {
      status = 'PARTIALLY_PAID';
    } else if (balance <= 0) {
      status = 'PAID';
    }

    await this.prisma.invoice.update({
      where: { id: invoiceId },
      data: {
        paidAmount,
        balance,
        status: status as any,
      },
    });
  }
}