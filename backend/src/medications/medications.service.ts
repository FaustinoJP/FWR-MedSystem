import { Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class MedicationsService {
  constructor(private prisma: PrismaService) {}

  findAll(search?: string) {
    const where: Prisma.MedicationWhereInput = {
      status: true,
      ...(search ? {
        OR: [
          { name: { contains: search, mode: 'insensitive' } },
          { genericName: { contains: search, mode: 'insensitive' } }
        ]
      } : {})
    };
    return this.prisma.medication.findMany({ where, orderBy: { name: 'asc' } });
  }
}
