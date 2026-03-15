import { Body, Controller, Get, Param, Patch, Post, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { CreateEncounterDto } from './dto/create-encounter.dto';
import { UpdateEncounterDto } from './dto/update-encounter.dto';
import { EncountersService } from './encounters.service';

@UseGuards(JwtAuthGuard)
@Controller('appointments/:appointmentId/encounter')
export class EncountersController {
  constructor(private readonly encountersService: EncountersService) {}

  @Post()
  create(
    @Param('appointmentId') appointmentId: string,
    @Body() dto: CreateEncounterDto,
  ) {
    return this.encountersService.create(appointmentId, dto);
  }

  @Get()
  findByAppointment(@Param('appointmentId') appointmentId: string) {
    return this.encountersService.findByAppointment(appointmentId);
  }

  @Patch()
  update(
    @Param('appointmentId') appointmentId: string,
    @Body() dto: UpdateEncounterDto,
  ) {
    return this.encountersService.update(appointmentId, dto);
  }
}