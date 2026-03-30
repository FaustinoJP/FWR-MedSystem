import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateEncounterDto } from './dto/create-encounter.dto';
import { UpdateEncounterDto } from './dto/update-encounter.dto';

@Injectable()
export class EncountersService {
  constructor(private readonly prisma: PrismaService) {}

  async findOne(appointmentId: string) {
    const encounter = await this.prisma.encounter.findUnique({
      where: { appointmentId },
    });

    if (!encounter) {
      throw new NotFoundException('Atendimento clínico não encontrado');
    }

    return encounter;
  }

  async create(appointmentId: string, dto: CreateEncounterDto) {
    const appointment = await this.prisma.appointment.findUnique({
      where: { id: appointmentId },
    });

    if (!appointment) {
      throw new NotFoundException('Consulta não encontrada');
    }

    const existing = await this.prisma.encounter.findUnique({
      where: { appointmentId },
    });

    if (existing) {
      return this.prisma.encounter.update({
        where: { appointmentId },
        data: {
          chiefComplaint: dto.chiefComplaint,
          historyOfPresentIllness: dto.historyOfPresentIllness,
          physicalExam: dto.physicalExam,
          assessment: dto.assessment,
          plan: dto.plan,
          status: 'OPEN' as any,
        },
      });
    }

    await this.prisma.appointment.update({
      where: { id: appointmentId },
      data: { status: 'IN_CONSULTATION' as any },
    });

    return this.prisma.encounter.create({
      data: {
        appointmentId,
        chiefComplaint: dto.chiefComplaint,
        historyOfPresentIllness: dto.historyOfPresentIllness,
        physicalExam: dto.physicalExam,
        assessment: dto.assessment,
        plan: dto.plan,
        status: 'OPEN' as any,
      },
    });
  }

  async update(appointmentId: string, dto: UpdateEncounterDto) {
    const encounter = await this.prisma.encounter.findUnique({
      where: { appointmentId },
    });

    if (!encounter) {
      throw new NotFoundException('Atendimento clínico não encontrado');
    }

    return this.prisma.encounter.update({
      where: { appointmentId },
      data: {
        chiefComplaint: dto.chiefComplaint,
        historyOfPresentIllness: dto.historyOfPresentIllness,
        physicalExam: dto.physicalExam,
        assessment: dto.assessment,
        plan: dto.plan,
      },
    });
  }
}