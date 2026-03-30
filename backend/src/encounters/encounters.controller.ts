import { Body, Controller, Get, Param, Patch, Post, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { RolesGuard } from '../common/guards/roles.guard';
import { Roles } from '../common/decorators/roles.decorator';
import { EncountersService } from './encounters.service';
import { CreateEncounterDto } from './dto/create-encounter.dto';
import { UpdateEncounterDto } from './dto/update-encounter.dto';

@UseGuards(JwtAuthGuard, RolesGuard)
@Controller('encounters')
export class EncountersController {
  constructor(private readonly encountersService: EncountersService) {}

  @Get(':appointmentId')
  @Roles('ADMIN', 'MEDICO')
  findOne(@Param('appointmentId') appointmentId: string) {
    return this.encountersService.findOne(appointmentId);
  }

  @Post(':appointmentId')
  @Roles('ADMIN', 'MEDICO')
  create(
    @Param('appointmentId') appointmentId: string,
    @Body() dto: CreateEncounterDto,
  ) {
    return this.encountersService.create(appointmentId, dto);
  }

  @Patch(':appointmentId')
  @Roles('ADMIN', 'MEDICO')
  update(
    @Param('appointmentId') appointmentId: string,
    @Body() dto: UpdateEncounterDto,
  ) {
    return this.encountersService.update(appointmentId, dto);
  }
}