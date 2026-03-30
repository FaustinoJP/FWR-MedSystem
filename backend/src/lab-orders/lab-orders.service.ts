import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateLabOrderDto } from './dto/create-lab-order.dto';

@Injectable()
export class LabOrdersService {
  constructor(private readonly prisma: PrismaService) {}

  async findAll(appointmentId: string) {
    const appointment = await this.prisma.appointment.findUnique({
      where: { id: appointmentId },
    });

    if (!appointment) {
      throw new NotFoundException('Consulta não encontrada');
    }

    return this.prisma.labOrder.findMany({
      where: { appointmentId },
      orderBy: { createdAt: 'desc' },
    });
  }

  async create(appointmentId: string, dto: CreateLabOrderDto) {
    const appointment = await this.prisma.appointment.findUnique({
      where: { id: appointmentId },
    });

    if (!appointment) {
      throw new NotFoundException('Consulta não encontrada');
    }

    return this.prisma.labOrder.create({
      data: {
        appointmentId,
        testName: dto.testName,
        category: dto.category,
        notes: dto.notes,
        status: 'REQUESTED' as any,
      },
    });
  }
}