import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreatePatientDto } from './dto/create-patient.dto';
import { UpdatePatientDto } from './dto/update-patient.dto';

@Injectable()
export class PatientsService {
  constructor(private prisma: PrismaService) {}

  async create(dto: CreatePatientDto) {
    const count = await this.prisma.patient.count();

    return this.prisma.patient.create({
      data: {
        patientCode: `PAT-${new Date().getFullYear()}-${String(count + 1).padStart(6, '0')}`,
        firstName: dto.firstName,
        lastName: dto.lastName,
        gender: dto.gender as any,
        dateOfBirth: new Date(dto.dateOfBirth),
        phone: dto.phone,
        bloodGroup: dto.bloodGroup,
      },
    });
  }

  findAll(search?: string) {
    const where: any = search
      ? {
          OR: [
            { firstName: { contains: search, mode: 'insensitive' } },
            { lastName: { contains: search, mode: 'insensitive' } },
            { patientCode: { contains: search, mode: 'insensitive' } },
            { phone: { contains: search, mode: 'insensitive' } },
          ],
        }
      : {};

    return this.prisma.patient.findMany({
      where,
      orderBy: { createdAt: 'desc' },
    });
  }

  async findOne(id: string) {
    const patient = await this.prisma.patient.findUnique({
      where: { id },
      include: { appointments: true },
    });

    if (!patient) {
      throw new NotFoundException('Paciente não encontrado');
    }

    return patient;
  }

  async update(id: string, dto: UpdatePatientDto) {
    await this.findOne(id);

    return this.prisma.patient.update({
      where: { id },
      data: {
        ...dto,
        gender: dto.gender ? (dto.gender as any) : undefined,
        dateOfBirth: dto.dateOfBirth ? new Date(dto.dateOfBirth) : undefined,
      },
    });
  }
}
