import { Injectable, NotFoundException } from '@nestjs/common';
import { AppointmentStatus, Prisma } from '@prisma/client';
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
      include: { patient: true, doctor: true, department: true },
    });
  }

  findAll(filters: { search?: string; status?: string; date?: string }) {
    const where: Prisma.AppointmentWhereInput = {};

    if (filters.search) {
      where.OR = [
        { patient: { firstName: { contains: filters.search, mode: 'insensitive' } } },
        { patient: { lastName: { contains: filters.search, mode: 'insensitive' } } },
      ];
    }
    if (filters.status) where.status = filters.status as AppointmentStatus;
    if (filters.date) {
      where.appointmentDate = {
        gte: new Date(`${filters.date}T00:00:00.000Z`),
        lte: new Date(`${filters.date}T23:59:59.999Z`),
      };
    }

    return this.prisma.appointment.findMany({
      where,
      include: { patient: true, doctor: true, department: true },
      orderBy: { appointmentDate: 'asc' },
    });
  }

  async findOne(id: string) {
    const appointment = await this.prisma.appointment.findUnique({
      where: { id },
      include: { patient: true, doctor: true, department: true, invoice: true },
    });
    if (!appointment) throw new NotFoundException('Consulta não encontrada');
    return appointment;
  }

  updateStatus(id: string, status: AppointmentStatus) {
    return this.prisma.appointment.update({ where: { id }, data: { status } });
  }
}
