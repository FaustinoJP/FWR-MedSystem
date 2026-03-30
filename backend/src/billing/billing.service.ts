import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateInvoiceDto } from './dto/create-invoice.dto';
import { CreatePaymentDto } from './dto/create-payment.dto';

@Injectable()
export class BillingService {
  constructor(private readonly prisma: PrismaService) {}

  async findInvoiceByAppointment(appointmentId: string) {
    return this.prisma.invoice.findUnique({
      where: { appointmentId },
      include: {
        items: true,
        payments: {
          include: {
            paymentMethod: true,
          },
          orderBy: {
            createdAt: 'desc',
          },
        },
      },
    });
  }

  async createInvoice(appointmentId: string, dto: CreateInvoiceDto) {
    const appointment = await this.prisma.appointment.findUnique({
      where: { id: appointmentId },
      include: {
        patient: true,
      },
    });

    if (!appointment) {
      throw new NotFoundException('Consulta não encontrada');
    }

    const existingInvoice = await this.prisma.invoice.findUnique({
      where: { appointmentId },
    });

    if (existingInvoice) {
      return this.prisma.invoice.findUnique({
        where: { id: existingInvoice.id },
        include: {
          items: true,
          payments: {
            include: {
              paymentMethod: true,
            },
            orderBy: {
              createdAt: 'desc',
            },
          },
        },
      });
    }

    const totalAmount = Number(dto.totalAmount || 0);
    const discountAmount = Number(dto.discountAmount || 0);
    const paidAmount = 0;
    const balance = totalAmount - discountAmount - paidAmount;

    const invoiceNumber = `INV-${Date.now()}`;

    return this.prisma.invoice.create({
      data: {
        patientId: appointment.patientId,
        appointmentId,
        invoiceNumber,
        description: dto.description,
        totalAmount,
        discountAmount,
        paidAmount,
        balance,
        status: balance <= 0 ? 'PAID' : 'ISSUED',
      },
      include: {
        items: true,
        payments: {
          include: {
            paymentMethod: true,
          },
        },
      },
    });
  }

  async updateInvoiceStatus(invoiceId: string, status: string) {
    const invoice = await this.prisma.invoice.findUnique({
      where: { id: invoiceId },
    });

    if (!invoice) {
      throw new NotFoundException('Fatura não encontrada');
    }

    return this.prisma.invoice.update({
      where: { id: invoiceId },
      data: {
        status: status as any,
      },
      include: {
        items: true,
        payments: {
          include: {
            paymentMethod: true,
          },
        },
      },
    });
  }

  async findPayments(invoiceId: string) {
    const invoice = await this.prisma.invoice.findUnique({
      where: { id: invoiceId },
    });

    if (!invoice) {
      throw new NotFoundException('Fatura não encontrada');
    }

    return this.prisma.payment.findMany({
      where: { invoiceId },
      include: {
        paymentMethod: true,
      },
      orderBy: {
        createdAt: 'desc',
      },
    });
  }

  async createPayment(invoiceId: string, dto: CreatePaymentDto) {
    const invoice = await this.prisma.invoice.findUnique({
      where: { id: invoiceId },
    });

    if (!invoice) {
      throw new NotFoundException('Fatura não encontrada');
    }

    const paymentMethod = await this.prisma.paymentMethod.findUnique({
      where: { id: dto.paymentMethodId },
    });

    if (!paymentMethod) {
      throw new NotFoundException('Método de pagamento não encontrado');
    }

    const amount = Number(dto.amount || 0);

    const payment = await this.prisma.payment.create({
      data: {
        invoiceId,
        paymentMethodId: dto.paymentMethodId,
        amount,
        reference: dto.reference,
        transactionReference: dto.transactionReference,
        externalTransactionId: dto.externalTransactionId,
        expiresAt: dto.expiresAt ? new Date(dto.expiresAt) : undefined,
        metadata: dto.metadata,
        status: 'PENDING',
      },
      include: {
        paymentMethod: true,
      },
    });

    return payment;
  }

  async updatePaymentStatus(paymentId: string, status: string) {
    const payment = await this.prisma.payment.findUnique({
      where: { id: paymentId },
    });

    if (!payment) {
      throw new NotFoundException('Pagamento não encontrado');
    }

    const updatedPayment = await this.prisma.payment.update({
      where: { id: paymentId },
      data: {
        status: status as any,
        paidAt: status === 'PAID' ? new Date() : payment.paidAt,
      },
      include: {
        paymentMethod: true,
      },
    });

    const payments = await this.prisma.payment.findMany({
      where: {
        invoiceId: payment.invoiceId,
        status: 'PAID' as any,
      },
    });

    const paidAmount = payments.reduce((sum, item) => sum + Number(item.amount), 0);

    const invoice = await this.prisma.invoice.findUnique({
      where: { id: payment.invoiceId },
    });

    if (!invoice) {
      throw new NotFoundException('Fatura não encontrada');
    }

    const balance =
      Number(invoice.totalAmount) - Number(invoice.discountAmount) - Number(paidAmount);

    let invoiceStatus: any = 'ISSUED';

    if (paidAmount <= 0) {
      invoiceStatus = 'ISSUED';
    } else if (balance <= 0) {
      invoiceStatus = 'PAID';
    } else {
      invoiceStatus = 'PARTIALLY_PAID';
    }

    await this.prisma.invoice.update({
      where: { id: payment.invoiceId },
      data: {
        paidAmount,
        balance,
        status: invoiceStatus,
      },
    });

    return updatedPayment;
  }
}