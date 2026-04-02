import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateExamTypeDto} from './dto/create-exam-type.dto';
import { UpdateExamTypeDto } from './dto/update-exam-type.dto';

@Injectable()
export class ExamTypesService {
  constructor(private prisma: PrismaService) {}

  async create(data: CreateExamTypeDto) {
    const existing = await this.prisma.examType.findUnique({
      where: { code: data.code },
    });

    if (existing) {
      throw new BadRequestException(`Código de exame "${data.code}" já existe`);
    }

    return this.prisma.examType.create({ data });
  }

  async findAll(activeOnly: boolean = true) {
    return this.prisma.examType.findMany({
      where: activeOnly ? { isActive: true } : {},
      orderBy: { name: 'asc' },
    });
  }

  async findOne(id: string) {
    const examType = await this.prisma.examType.findUnique({ where: { id } });
    if (!examType) throw new NotFoundException('Tipo de exame não encontrado');
    return examType;
  }

  async update(id: string, data: UpdateExamTypeDto) {
    await this.findOne(id);
    return this.prisma.examType.update({ where: { id }, data });
  }

  async remove(id: string) {
    await this.findOne(id);
    return this.prisma.examType.update({
      where: { id },
      data: { isActive: false },
    });
  }
}