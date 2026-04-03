import { IsString, IsNotEmpty, IsOptional, IsEnum } from 'class-validator';
import { ExamPriority } from '@prisma/client';

export class CreateExamRequestDto {
  @IsString()
  @IsNotEmpty()
  appointmentId: string;

  @IsString()
  @IsNotEmpty()
  examTypeId: string;

@IsEnum(ExamPriority)
  @IsOptional()
  priority?: ExamPriority = 'NORMAL';

  @IsString()
  @IsNotEmpty()
  requestedBy: string;   // ID do médico

  @IsString()
  @IsOptional()
  notes?: string;
}