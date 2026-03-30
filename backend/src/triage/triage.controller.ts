import { Body, Controller, Get, Param, Patch, Post, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { RolesGuard } from '../common/guards/roles.guard';
import { Roles } from '../common/decorators/roles.decorator';
import { TriageService } from './triage.service';
import { CreateTriageDto } from './dto/create-triage.dto';
import { UpdateTriageDto } from './dto/update-triage.dto';

@UseGuards(JwtAuthGuard, RolesGuard)
@Controller('triage')
export class TriageController {
  constructor(private readonly triageService: TriageService) {}

  @Get(':appointmentId')
  @Roles('ADMIN', 'ENFERMEIRO', 'MEDICO')
  findOne(@Param('appointmentId') appointmentId: string) {
    return this.triageService.findOne(appointmentId);
  }

  @Post(':appointmentId')
  @Roles('ADMIN', 'ENFERMEIRO', 'MEDICO')
  create(
    @Param('appointmentId') appointmentId: string,
    @Body() dto: CreateTriageDto,
  ) {
    return this.triageService.create(appointmentId, dto);
  }

  @Patch(':appointmentId')
  @Roles('ADMIN', 'ENFERMEIRO', 'MEDICO')
  update(
    @Param('appointmentId') appointmentId: string,
    @Body() dto: UpdateTriageDto,
  ) {
    return this.triageService.update(appointmentId, dto);
  }
}