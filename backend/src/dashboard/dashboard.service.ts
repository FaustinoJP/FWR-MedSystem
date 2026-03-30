import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class DashboardService {
  constructor(private prisma: PrismaService) {}

  async getSummary() {
    const now = new Date();

    // Corrige automaticamente consultas passadas não atendidas
    await this.prisma.appointment.updateMany({
      where: {
        appointmentDate: {
          lt: now,
        },
        status: {
          in: ['SCHEDULED', 'CHECKED_IN'] as any,
        },
      },
      data: {
        status: 'NO_SHOW' as any,
      },
    });

    const start = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 0, 0, 0, 0);
    const end = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 23, 59, 59, 999);

    const [
      patientsToday,
      totalPatients,
      appointmentsToday,
      inTriageToday,
      inConsultationToday,
      completedToday,
      noShowToday,
      pendingInvoices,
      revenueAgg,
    ] = await Promise.all([
      this.prisma.patient.count({
        where: { createdAt: { gte: start, lte: end } },
      }),

      this.prisma.patient.count(),

      this.prisma.appointment.count({
        where: { appointmentDate: { gte: start, lte: end } },
      }),

      this.prisma.appointment.count({
        where: {
          appointmentDate: { gte: start, lte: end },
          status: 'IN_TRIAGE' as any,
        },
      }),

      this.prisma.appointment.count({
        where: {
          appointmentDate: { gte: start, lte: end },
          status: 'IN_CONSULTATION' as any,
        },
      }),

      this.prisma.appointment.count({
        where: {
          appointmentDate: { gte: start, lte: end },
          status: 'COMPLETED' as any,
        },
      }),

      this.prisma.appointment.count({
        where: {
          appointmentDate: { gte: start, lte: end },
          status: 'NO_SHOW' as any,
        },
      }),

      this.prisma.invoice.count({
        where: {
          status: { in: ['DRAFT', 'ISSUED', 'PARTIALLY_PAID'] as any },
        },
      }),

      this.prisma.payment.aggregate({
        _sum: { amount: true },
        where: { paidAt: { gte: start, lte: end } },
      }),
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
        noShowToday,
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
        { date: 'dom', label: 'Dom', total: 1 },
      ],
      recentAppointments,
    };
  }
}