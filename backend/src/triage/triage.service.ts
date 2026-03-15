import { Injectable, NotFoundException, ConflictException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateTriageDto } from './dto/create-triage.dto';
import { UpdateTriageDto } from './dto/update-triage.dto';

@Injectable()
export class TriageService {
  constructor(private prisma: PrismaService) {}

  async create(appointmentId: string, dto: CreateTriageDto) {
    const appointment = await this.prisma.appointment.findUnique({
      where: { id: appointmentId },
      include: { triage: true },
    });

    if (!appointment) {
      throw new NotFoundException('Consulta não encontrada');
    }

    if (appointment.triage) {
      throw new ConflictException('Triagem já registada para esta consulta');
    }

     const triage = await this.prisma.triage.create({
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

    await this.prisma.appointment.update({
      where: { id: appointmentId },
      data: { status: 'IN_TRIAGE' as any },
    });

    return triage;
  }
    async findByAppointment(appointmentId: string) {
    const triage = await this.prisma.triage.findUnique({
      where: { appointmentId },
    });

    if (!triage) {
      throw new NotFoundException('Triagem não encontrada');
    }

    return triage;
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