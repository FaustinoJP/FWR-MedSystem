import { Controller, Get, Post, Body, Patch, Param, Query } from '@nestjs/common';
import { AppointmentsService } from './appointments.service';
import { CreateAppointmentDto } from './dto/create-appointment.dto';
import { Roles } from '../common/decorators/roles.decorator';
import { Role } from '../auth/enums/role.enum';

@Controller('appointments')
export class AppointmentsController {
  constructor(private readonly appointmentsService: AppointmentsService) {}

  @Post()
  @Roles(Role.RECEPTIONIST, Role.ADMIN, Role.DOCTOR)
  create(@Body() createAppointmentDto: CreateAppointmentDto) {
    return this.appointmentsService.create(createAppointmentDto);
  }

  @Get()
  @Roles(Role.RECEPTIONIST, Role.ADMIN, Role.DOCTOR, Role.NURSE)
  findAll() {
    return this.appointmentsService.findAll();
  }

  @Get(':id')
  @Roles(Role.RECEPTIONIST, Role.ADMIN, Role.DOCTOR, Role.NURSE)
  findOne(@Param('id') id: string) {
    return this.appointmentsService.findOne(id);
  }

  @Patch(':id/status')
  @Roles(Role.RECEPTIONIST, Role.ADMIN, Role.DOCTOR, Role.NURSE)
  updateStatus(@Param('id') id: string, @Body('status') status: string) {
    return this.appointmentsService.updateStatus(id, status);
  }

    @Patch(':id/complete')
  @Roles(Role.DOCTOR, Role.ADMIN)
  complete(@Param('id') id: string) {
    return this.appointmentsService.complete(id);
  }
}