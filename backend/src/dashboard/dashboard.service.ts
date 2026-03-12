import { Injectable } from '@nestjs/common';
import { AppointmentStatus, InvoiceStatus } from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class DashboardService {
  constructor(private prisma: PrismaService) {}

  async getSummary() {
    const now = new Date();
    const start = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 0, 0, 0, 0);
    const end = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 23, 59, 59, 999);

    const [patientsToday, totalPatients, appointmentsToday, inTriageToday, inConsultationToday, completedToday, pendingInvoices, revenueAgg] =
      await Promise.all([
        this.prisma.patient.count({ where: { createdAt: { gte: start, lte: end } } }),
        this.prisma.patient.count(),
        this.prisma.appointment.count({ where: { appointmentDate: { gte: start, lte: end } } }),
        this.prisma.appointment.count({ where: { appointmentDate: { gte: start, lte: end }, status: AppointmentStatus.IN_TRIAGE } }),
        this.prisma.appointment.count({ where: { appointmentDate: { gte: start, lte: end }, status: AppointmentStatus.IN_CONSULTATION } }),
        this.prisma.appointment.count({ where: { appointmentDate: { gte: start, lte: end }, status: AppointmentStatus.COMPLETED } }),
        this.prisma.invoice.count({ where: { status: { in: [InvoiceStatus.DRAFT, InvoiceStatus.ISSUED, InvoiceStatus.PARTIALLY_PAID] } } }),
        this.prisma.payment.aggregate({ _sum: { amount: true }, where: { paidAt: { gte: start, lte: end } } }),
      ]);

    const recentAppointments = await this.prisma.appointment.findMany({
      where: { appointmentDate: { gte: start, lte: end } },
      include: { patient: true, doctor: true, department: true },
      orderBy: { appointmentDate: 'asc' },
      take: 8,
    });

    return {
      summary: {
        patientsToday,
        totalPatients,
        appointmentsToday,
        checkedInToday: 0,
        inTriageToday,
        inConsultationToday,
        completedToday,
        pendingInvoices,
        pendingLabOrders: 0,
        revenueToday: Number(revenueAgg._sum.amount ?? 0),
      },
      alerts: {
        lowStockCount: 0,
        lowStockItems: [],
      },
      weeklyChart: [
        { date: 'seg', label: 'Seg', total: 4 },
        { date: 'ter', label: 'Ter', total: 7 },
        { date: 'qua', label: 'Qua', total: 5 },
        { date: 'qui', label: 'Qui', total: 8 },
        { date: 'sex', label: 'Sex', total: 6 },
        { date: 'sab', label: 'Sáb', total: 2 },
        { date: 'dom', label: 'Dom', total: 1 }
      ],
      recentAppointments,
    };
  }
}
