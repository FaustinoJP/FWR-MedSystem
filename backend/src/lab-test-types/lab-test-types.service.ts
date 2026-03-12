import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class LabTestTypesService {
  constructor(private prisma: PrismaService) {}

  findAll(search?: string) {
    const where: any = search
      ? {
          OR: [
            { name: { contains: search, mode: 'insensitive' } },
            { category: { contains: search, mode: 'insensitive' } },
          ],
        }
      : {};

    return this.prisma.labTestType.findMany({
      where,
      orderBy: { name: 'asc' },
    });
  }
}
