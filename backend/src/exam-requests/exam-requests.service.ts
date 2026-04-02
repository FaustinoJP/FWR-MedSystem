import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateExamRequestDto } from './dto/create-exam-request.dto';
import { UpdateExamRequestDto } from './dto/update-exam-request.dto';
import { AddResultDto } from './dto/add-result.dto';
import { ExamStatus } from '@prisma/client';

@Injectable()
export class ExamRequestsService {
  constructor(private prisma: PrismaService) {}

  // ======================
  // CRUD BÁSICO
  // ======================

  async create(data: CreateExamRequestDto) {
    const appointment = await this.prisma.appointment.findUnique({
      where: { id: data.appointmentId },
    });

    if (!appointment) {
      throw new NotFoundException('Appointment não encontrado');
    }

    return this.prisma.examRequest.create({
      data: {
        appointmentId: data.appointmentId,
        examTypeId: data.examTypeId,
        priority: data.priority || 'NORMAL',
        requestedBy: data.requestedBy,
        notes: data.notes,
      },
      include: {
        examType: true,
        appointment: {
          include: { patient: true, doctor: true },
        },
      },
    });
  }

  async findAllByAppointment(appointmentId: string) {
    return this.prisma.examRequest.findMany({
      where: { appointmentId },
      include: { examType: true },
      orderBy: { requestedAt: 'desc' },
    });
  }

  async findOne(id: string) {
    const examRequest = await this.prisma.examRequest.findUnique({
      where: { id },
      include: { examType: true },
    });

    if (!examRequest) throw new NotFoundException('Pedido de exame não encontrado');
    return examRequest;
  }

  async update(id: string, data: UpdateExamRequestDto) {
    await this.findOne(id);
    return this.prisma.examRequest.update({ where: { id }, data });
  }

  async remove(id: string) {
    await this.findOne(id);
    return this.prisma.examRequest.update({
      where: { id },
      data: { status: ExamStatus.CANCELLED },
    });
  }

  // ======================
  // RESULTADOS E VALIDAÇÃO
  // ======================

  async addResult(id: string, data: AddResultDto, validatedBy: string) {
    await this.findOne(id);

    return this.prisma.examRequest.update({
      where: { id },
      data: {
        result: data.result,
        notes: data.notes || undefined,
        status: ExamStatus.COMPLETED,
        validatedBy,
        validatedAt: new Date(),
      },
    });
  }

  async validate(id: string, validatedBy: string) {
    const examRequest = await this.findOne(id);

    if (examRequest.status !== ExamStatus.COMPLETED) {
      throw new BadRequestException('Só é possível validar exames com resultado registado');
    }

    return this.prisma.examRequest.update({
      where: { id },
      data: {
        status: ExamStatus.VALIDATED,
        validatedBy,
        validatedAt: new Date(),
      },
    });
  }

  // ======================
  // PAINEL DO LABORATÓRIO
  // ======================

  async getLabPanel(status?: string, priority?: string) {
    const where: any = {};

    if (status) where.status = status;
    if (priority) where.priority = priority;

    return this.prisma.examRequest.findMany({
      where,
      include: {
        examType: true,
        appointment: {
          include: {
            patient: true,
            doctor: true,
          },
        },
      },
      orderBy: [
        { priority: 'desc' },
        { requestedAt: 'asc' },
      ],
    });
  }

  async getLabStats() {
    const total = await this.prisma.examRequest.count();
    const pending = await this.prisma.examRequest.count({ where: { status: 'PENDING' } });
    const inProgress = await this.prisma.examRequest.count({ where: { status: 'IN_PROGRESS' } });
    const completed = await this.prisma.examRequest.count({ where: { status: 'COMPLETED' } });
    const validated = await this.prisma.examRequest.count({ where: { status: 'VALIDATED' } });

    return {
      total,
      pending,
      inProgress,
      completed,
      validated,
      pendingPercentage: total > 0 ? Math.round((pending / total) * 100) : 0,
    };
  }
}