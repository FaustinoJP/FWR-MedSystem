import { Body, Controller, Get, Param, Patch, Post, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { CreateTriageDto } from './dto/create-triage.dto';
import { UpdateTriageDto } from './dto/update-triage.dto';
import { TriageService } from './triage.service';

@UseGuards(JwtAuthGuard)
@Controller('appointments/:appointmentId/triage')
export class TriageController {
  constructor(private readonly triageService: TriageService) {}

  @Post()
  create(
    @Param('appointmentId') appointmentId: string,
    @Body() dto: CreateTriageDto,
  ) {
    return this.triageService.create(appointmentId, dto);
  }

  @Get()
  findByAppointment(@Param('appointmentId') appointmentId: string) {
    return this.triageService.findByAppointment(appointmentId);
  }

  @Patch()
  update(
    @Param('appointmentId') appointmentId: string,
    @Body() dto: UpdateTriageDto,
  ) {
    return this.triageService.update(appointmentId, dto);
  }
}
