import { IsOptional, IsString } from 'class-validator';

export class CreateEncounterDto {
  @IsOptional()
  @IsString()
  chiefComplaint?: string;

  @IsOptional()
  @IsString()
  historyOfPresentIllness?: string;

  @IsOptional()
  @IsString()
  physicalExam?: string;

  @IsOptional()
  @IsString()
  assessment?: string;

  @IsOptional()
  @IsString()
  plan?: string;
}
