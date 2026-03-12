import { Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class LabTestTypesService {
  constructor(private prisma: PrismaService) {}

  findAll(search?: string) {
    const where: Prisma.LabTestTypeWhereInput = search
      ? { OR: [{ name: { contains: search, mode: 'insensitive' } }, { category: { contains: search, mode: 'insensitive' } }] }
      : {};
    return this.prisma.labTestType.findMany({ where, orderBy: { name: 'asc' } });
  }
}
