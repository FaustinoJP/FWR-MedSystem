import { Body, Controller, Get, Param, Patch, Post, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { CreatePrescriptionDto } from './dto/create-prescription.dto';
import { UpdatePrescriptionDto } from './dto/update-prescription.dto';
import { PrescriptionsService } from './prescriptions.service';

@UseGuards(JwtAuthGuard)
@Controller()
export class PrescriptionsController {
  constructor(private readonly prescriptionsService: PrescriptionsService) {}

  @Post('appointments/:appointmentId/prescriptions')
  create(
    @Param('appointmentId') appointmentId: string,
    @Body() dto: CreatePrescriptionDto,
  ) {
    return this.prescriptionsService.create(appointmentId, dto);
  }

  @Get('appointments/:appointmentId/prescriptions')
  findByAppointment(@Param('appointmentId') appointmentId: string) {
    return this.prescriptionsService.findByAppointment(appointmentId);
  }

  @Get('prescriptions/:id')
  findOne(@Param('id') id: string) {
    return this.prescriptionsService.findOne(id);
  }

  @Patch('prescriptions/:id')
  update(@Param('id') id: string, @Body() dto: UpdatePrescriptionDto) {
    return this.prescriptionsService.update(id, dto);
  }
}
