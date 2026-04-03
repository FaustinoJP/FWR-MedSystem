import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateAppointmentDto } from './dto/create-appointment.dto';
import { AppointmentStatus } from '@prisma/client';

@Injectable()
export class AppointmentsService {
  /*complete(id: string) {
    throw new Error('Method not implemented.');
  }*/
  constructor(private prisma: PrismaService) {}

  // ======================
  // CREATE
  // ======================
  async create(dto: CreateAppointmentDto) {
    return this.prisma.appointment.create({
      data: dto,
      include: {
        patient: true,
        doctor: true,
        department: true,
      },
    });
  }

    async complete(id: string) {
    const appointment = await this.prisma.appointment.findUnique({
      where: { id },
      include: { patient: true, doctor: true },
    });

    if (!appointment) {
      throw new NotFoundException('Appointment não encontrado');
    }

    // Atualiza o estado para COMPLETED
    const updated = await this.prisma.appointment.update({
      where: { id },
      data: {
        status: AppointmentStatus.COMPLETED,
      },
      include: {
        patient: true,
        doctor: true,
        department: true,
        triage: true,
        encounter: true,
        prescriptions: true,
        examRequests: {
          include: { examType: true },
        },
      },
    });

    return updated;
  }

  // ======================
  // READ
  // ======================
  async findAll() {
    return this.prisma.appointment.findMany({
      include: {
        patient: true,
        doctor: true,
        department: true,
        triage: true,
        encounter: true,
        prescriptions: true,
        examRequests: {
          include: {
            examType: true,
          },
          orderBy: { requestedAt: 'desc' },
        },
      },
      orderBy: { appointmentDate: 'desc' },
    });
  }

  async findOne(id: string) {
    const appointment = await this.prisma.appointment.findUnique({
      where: { id },
      include: {
        patient: true,
        doctor: true,
        department: true,
        triage: true,
        encounter: true,
        prescriptions: true,
        examRequests: {
          include: {
            examType: true,
          },
          orderBy: { requestedAt: 'desc' },
        },
      },
    });

    if (!appointment) {
      throw new NotFoundException('Appointment não encontrado');
    }

    return appointment;
  }


    // ======================
  // UPDATE STATUS
  // ======================
  async updateStatus(id: string, status: string) {
    const allowedStatuses: AppointmentStatus[] = [
      'SCHEDULED',
      'CHECKED_IN',
      'IN_TRIAGE',
      'IN_CONSULTATION',
      'COMPLETED',
      'CANCELLED',
      'NO_SHOW'
    ];

    if (!allowedStatuses.includes(status as AppointmentStatus)) {
      throw new BadRequestException(
        `Status inválido. Valores permitidos: ${allowedStatuses.join(', ')}`
      );
    }

    return this.prisma.appointment.update({
      where: { id },
      data: { 
        status: status as AppointmentStatus   // ← Cast explícito para o enum
      },
      include: {
        patient: true,
        doctor: true,
        department: true,
        examRequests: {
          include: {
            examType: true,
          },
        },
      },
    });
  }
  // ======================
  // REMOVE (soft delete por agora)
  // ======================
  async remove(id: string) {
    return this.prisma.appointment.update({
      where: { id },
      data: { status: 'CANCELLED' },
    });
  }
}