import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateAppointmentDto } from './dto/create-appointment.dto';

@Injectable()
export class AppointmentsService {
  constructor(private prisma: PrismaService) {}

  create(dto: CreateAppointmentDto) {
    return this.prisma.appointment.create({
      data: {
        patientId: dto.patientId,
        doctorId: dto.doctorId,
        departmentId: dto.departmentId,
        appointmentDate: new Date(dto.appointmentDate),
        reason: dto.reason,
      },
      include: {
        patient: true,
        doctor: true,
        department: true,
        triage: true,
        encounter: true,
      },
    });
  }

  async findAll(filters: { search?: string; status?: string; date?: string }) {
   await this.markExpiredAppointmentsAsNoShow();
    const where: any = {};

    if (filters.search) {
      where.OR = [
        {
          patient: {
            firstName: { contains: filters.search, mode: 'insensitive' },
          },
        },
        {
          patient: {
            lastName: { contains: filters.search, mode: 'insensitive' },
          },
        },
      ];
    }

    if (filters.status) {
      where.status = filters.status;
    }

    if (filters.date) {
      where.appointmentDate = {
        gte: new Date(`${filters.date}T00:00:00.000Z`),
        lte: new Date(`${filters.date}T23:59:59.999Z`),
      };
    }

    return this.prisma.appointment.findMany({
      where,
      include: {
        patient: true,
        doctor: true,
        department: true,
        triage: true,
        encounter: true,
      },
      orderBy: { appointmentDate: 'asc' },
    });
  }

    async markExpiredAppointmentsAsNoShow() {
    const now = new Date();

    await this.prisma.appointment.updateMany({
      where: {
        appointmentDate: {
          lt: now,
        },
        status: {
          in: ['SCHEDULED', 'CHECKED_IN'],
        },
      },
      data: {
        status: 'NO_SHOW',
      },
    });
  }

  async findOne(id: string) {
    const appointment = await this.prisma.appointment.findUnique({
      where: { id },
      include: {
         patient: true,
         doctor: true,
         department: true,
         Invoice: true,
         triage: true,
         encounter: true,
         prescriptions: true,
         labOrders: true,
      },
    });

    if (!appointment) {
      throw new NotFoundException('Consulta não encontrada');
    }

    return appointment;
  }

  updateStatus(id: string, status: string) {
    return this.prisma.appointment.update({
      where: { id },
      data: { status: status as any },
    });
  }

  async complete(id: string) {
  const appointment = await this.prisma.appointment.findUnique({
    where: { id },
    include: {
      encounter: true,
    },
  });

  if (!appointment) {
    throw new NotFoundException('Consulta não encontrada');
  }

  if (appointment.encounter) {
    await this.prisma.encounter.update({
      where: { appointmentId: id },
      data: {
        status: 'CLOSED',
      },
    });
  }

  return this.prisma.appointment.update({
    where: { id },
    data: {
      status: 'COMPLETED',
    },
    include: {
      patient: true,
      doctor: true,
      department: true,
      Invoice: true,
      triage: true,
      encounter: true,
      prescriptions: true,
      labOrders: true,
    },
  });
}

}

