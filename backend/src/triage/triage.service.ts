import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateTriageDto } from './dto/create-triage.dto';
import { UpdateTriageDto } from './dto/update-triage.dto';

@Injectable()
export class TriageService {
  constructor(private readonly prisma: PrismaService) {}

  async findOne(appointmentId: string) {
    const triage = await this.prisma.triage.findUnique({
      where: { appointmentId },
    });

    if (!triage) {
      throw new NotFoundException('Triagem não encontrada');
    }

    return triage;
  }

  async create(appointmentId: string, dto: CreateTriageDto) {
    const appointment = await this.prisma.appointment.findUnique({
      where: { id: appointmentId },
    });

    if (!appointment) {
      throw new NotFoundException('Consulta não encontrada');
    }

    const existing = await this.prisma.triage.findUnique({
      where: { appointmentId },
    });

    if (existing) {
      return this.prisma.triage.update({
        where: { appointmentId },
        data: {
          weight: dto.weight,
          height: dto.height,
          temperature: dto.temperature,
          bloodPressure: dto.bloodPressure,
          heartRate: dto.heartRate,
          respiratoryRate: dto.respiratoryRate,
          oxygenSaturation: dto.oxygenSaturation,
          notes: dto.notes,
        },
      });
    }

    await this.prisma.appointment.update({
      where: { id: appointmentId },
      data: { status: 'IN_TRIAGE' as any },
    });

    return this.prisma.triage.create({
      data: {
        appointmentId,
        weight: dto.weight,
        height: dto.height,
        temperature: dto.temperature,
        bloodPressure: dto.bloodPressure,
        heartRate: dto.heartRate,
        respiratoryRate: dto.respiratoryRate,
        oxygenSaturation: dto.oxygenSaturation,
        notes: dto.notes,
      },
    });
  }

  async update(appointmentId: string, dto: UpdateTriageDto) {
    const triage = await this.prisma.triage.findUnique({
      where: { appointmentId },
    });

    if (!triage) {
      throw new NotFoundException('Triagem não encontrada');
    }

    return this.prisma.triage.update({
      where: { appointmentId },
      data: {
        weight: dto.weight,
        height: dto.height,
        temperature: dto.temperature,
        bloodPressure: dto.bloodPressure,
        heartRate: dto.heartRate,
        respiratoryRate: dto.respiratoryRate,
        oxygenSaturation: dto.oxygenSaturation,
        notes: dto.notes,
      },
    });
  }
}