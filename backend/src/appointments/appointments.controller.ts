import { Body, Controller, Get, Param, Patch, Post, Query, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { RolesGuard } from '../common/guards/roles.guard';
import { Roles } from '../common/decorators/roles.decorator';
import { AppointmentsService } from './appointments.service';
import { CreateAppointmentDto } from './dto/create-appointment.dto';
import { UpdateStatusDto } from './dto/update-status.dto';

@UseGuards(JwtAuthGuard, RolesGuard)
@Controller('appointments')
export class AppointmentsController {
  constructor(private readonly appointmentsService: AppointmentsService) {}

  @Post()
  @Roles('ADMIN', 'RECEPCIONISTA')
  create(@Body() dto: CreateAppointmentDto) {
    return this.appointmentsService.create(dto);
  }

  @Get()
  @Roles('ADMIN', 'RECEPCIONISTA', 'MEDICO', 'ENFERMEIRO', 'FATURACAO')
  findAll(
    @Query('search') search?: string,
    @Query('status') status?: string,
    @Query('date') date?: string,
  ) {
    return this.appointmentsService.findAll({ search, status, date });
  }

  @Get(':id')
  @Roles('ADMIN', 'RECEPCIONISTA', 'MEDICO', 'ENFERMEIRO', 'FATURACAO')
  findOne(@Param('id') id: string) {
    return this.appointmentsService.findOne(id);
  }

  @Patch(':id/status')
  @Roles('ADMIN', 'RECEPCIONISTA', 'ENFERMEIRO', 'MEDICO')
  updateStatus(@Param('id') id: string, @Body() dto: UpdateStatusDto) {
    return this.appointmentsService.updateStatus(id, dto.status);
  }

  @Patch(':id/complete')
  @Roles('ADMIN', 'MEDICO')
  complete(@Param('id') id: string) {
    return this.appointmentsService.complete(id);
  }
}