import { PartialType } from '@nestjs/mapped-types';
import { CreateExamRequestDto } from './create-exam-request.dto';

export class UpdateExamRequestDto extends PartialType(CreateExamRequestDto) {}