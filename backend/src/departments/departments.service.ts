import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateDepartmentDto } from './dto/create-department.dto';
import { UpdateDepartmentDto } from './dto/update-department.dto';

@Injectable()
export class DepartmentsService {
  constructor(private readonly prisma: PrismaService) {}

  async findAll() {
    return this.prisma.department.findMany({
      orderBy: {
        name: 'asc',
      },
    });
  }

  async findOne(id: string) {
    const department = await this.prisma.department.findUnique({
      where: { id },
    });

    if (!department) {
      throw new NotFoundException('Departamento não encontrado');
    }

    return department;
  }

  async create(dto: CreateDepartmentDto) {
    const existing = await this.prisma.department.findUnique({
      where: { name: dto.name },
    });

    if (existing) {
      throw new BadRequestException('Já existe um departamento com este nome');
    }

    return this.prisma.department.create({
      data: {
        name: dto.name,
      },
    });
  }

  async update(id: string, dto: UpdateDepartmentDto) {
    const existing = await this.prisma.department.findUnique({
      where: { id },
    });

    if (!existing) {
      throw new NotFoundException('Departamento não encontrado');
    }

    if (dto.name && dto.name !== existing.name) {
      const duplicate = await this.prisma.department.findUnique({
        where: { name: dto.name },
      });

      if (duplicate) {
        throw new BadRequestException('Já existe um departamento com este nome');
      }
    }

    return this.prisma.department.update({
      where: { id },
      data: {
        ...(dto.name !== undefined ? { name: dto.name } : {}),
      },
    });
  }
}