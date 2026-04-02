import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateAppointmentDto, /* teus DTOs */ } from './dto/create-appointment.dto';

@Injectable()
export class AppointmentsService {
  remove(id: string) {
    throw new Error('Method not implemented.');
  }
  complete // Mantém os outros métodos (create, update, etc.) como estão
    (id: string) {
      throw new Error('Method not implemented.');
  }
  updateStatus(id: string, status: string) {
    throw new Error('Method not implemented.');
  }
  create(dto: CreateAppointmentDto) {
    throw new Error('Method not implemented.');
  }
  constructor(private prisma: PrismaService) {}

 async findAll() {
    return this.prisma.appointment.findMany({
      include: {
        patient: true,
        doctor: true,
        department: true,
        triage: true,
        encounter: true,
        prescriptions: true,
        examRequests: {                    // ← Adicionado
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
        examRequests: {          // ← Adicionado
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

  // Mantém os outros métodos (create, update, etc.) como estão
  // Apenas adiciona o include acima onde faz sentido mostrar os exames
}