import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreatePrescriptionDto } from './dto/create-prescription.dto';

@Injectable()
export class PrescriptionsService {
  constructor(private readonly prisma: PrismaService) {}

  async findAll(appointmentId: string) {
    const appointment = await this.prisma.appointment.findUnique({
      where: { id: appointmentId },
    });

    if (!appointment) {
      throw new NotFoundException('Consulta não encontrada');
    }

    return this.prisma.prescription.findMany({
      where: { appointmentId },
      orderBy: { createdAt: 'desc' },
    });
  }

  async create(appointmentId: string, dto: CreatePrescriptionDto) {
    const appointment = await this.prisma.appointment.findUnique({
      where: { id: appointmentId },
    });

    if (!appointment) {
      throw new NotFoundException('Consulta não encontrada');
    }

    return this.prisma.prescription.create({
      data: {
        appointmentId,
        medicationName: dto.medicationName,
        dosage: dto.dosage,
        frequency: dto.frequency,
        duration: dto.duration,
        instructions: dto.instructions,
      },
    });
  }
}