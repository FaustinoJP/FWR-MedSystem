import { IsDateString, IsOptional, IsString } from 'class-validator';

export class CreateAppointmentDto {
  @IsString()
  patientId: string;

  @IsString()
  doctorId: string;

  @IsString()
  departmentId: string;

  @IsDateString()
  appointmentDate: string;

  @IsOptional()
  @IsString()
  reason?: string;
}
