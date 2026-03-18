import { Injectable, ConflictException, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateEncounterDto } from './dto/create-encounter.dto';
import { UpdateEncounterDto } from './dto/update-encounter.dto';

@Injectable()
export class EncountersService {
  constructor(private prisma: PrismaService) {}

  async create(appointmentId: string, dto: CreateEncounterDto) {
    const appointment = await this.prisma.appointment.findUnique({
      where: { id: appointmentId },
      include: { encounter: true },
    });

    if (!appointment) {
      throw new NotFoundException('Consulta não encontrada');
    }

    if (appointment.encounter) {
      throw new ConflictException('Atendimento clínico já registado para esta consulta');
    }
     const encounter = await this.prisma.encounter.create({
      data: {
        appointmentId,
        status: 'OPEN',
        chiefComplaint: dto.chiefComplaint,
        historyOfPresentIllness: dto.historyOfPresentIllness,
        physicalExam: dto.physicalExam,
        assessment: dto.assessment,
        plan: dto.plan,
      },
    });

    await this.prisma.appointment.update({
      where: { id: appointmentId },
      data: { status: 'IN_CONSULTATION' as any },
    });

    return encounter;
  }
   async findByAppointment(appointmentId: string) {
    const encounter = await this.prisma.encounter.findUnique({
      where: { appointmentId },
    });

    if (!encounter) {
      throw new NotFoundException('Atendimento clínico não encontrado');
    }

    return encounter;
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
