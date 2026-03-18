import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateLabOrderDto } from './dto/create-lab-order.dto';
import { UpdateLabOrderDto } from './dto/update-lab-order.dto';

@Injectable()
export class LabOrdersService {
  constructor(private prisma: PrismaService) {}

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
        status: 'REQUESTED',
      },
    });
  }

  findByAppointment(appointmentId: string) {
    return this.prisma.labOrder.findMany({
      where: { appointmentId },
      orderBy: { createdAt: 'desc' },
    });
  }

  async findOne(id: string) {
    const labOrder = await this.prisma.labOrder.findUnique({
      where: { id },
    });

    if (!labOrder) {
      throw new NotFoundException('Pedido laboratorial não encontrado');
    }

    return labOrder;
  }

  async update(id: string, dto: UpdateLabOrderDto) {
    await this.findOne(id);

    return this.prisma.labOrder.update({
      where: { id },
      data: {
        testName: dto.testName,
        category: dto.category,
        notes: dto.notes,
      },
    });
  }
}