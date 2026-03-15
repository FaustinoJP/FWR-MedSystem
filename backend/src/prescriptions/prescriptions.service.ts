import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreatePrescriptionDto } from './dto/create-prescription.dto';
import { UpdatePrescriptionDto } from './dto/update-prescription.dto';

@Injectable()
export class PrescriptionsService {
  constructor(private prisma: PrismaService) {}

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

  findByAppointment(appointmentId: string) {
    return this.prisma.prescription.findMany({
      where: { appointmentId },
      orderBy: { createdAt: 'desc' },
    });
  }

  async findOne(id: string) {
    const prescription = await this.prisma.prescription.findUnique({
      where: { id },
    });

    if (!prescription) {
      throw new NotFoundException('Prescrição não encontrada');
    }

    return prescription;
  }

  async update(id: string, dto: UpdatePrescriptionDto) {
    await this.findOne(id);

    return this.prisma.prescription.update({
      where: { id },
      data: {
        medicationName: dto.medicationName,
        dosage: dto.dosage,
        frequency: dto.frequency,
        duration: dto.duration,
        instructions: dto.instructions,
      },
    });
  }
}