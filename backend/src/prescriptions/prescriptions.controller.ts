import { Body, Controller, Get, Param, Post, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { RolesGuard } from '../common/guards/roles.guard';
import { Roles } from '../common/decorators/roles.decorator';
import { PrescriptionsService } from './prescriptions.service';
import { CreatePrescriptionDto } from './dto/create-prescription.dto';

@UseGuards(JwtAuthGuard, RolesGuard)
@Controller('prescriptions')
export class PrescriptionsController {
  constructor(private readonly prescriptionsService: PrescriptionsService) {}

  @Get(':appointmentId')
  @Roles('ADMIN', 'MEDICO')
  findAll(@Param('appointmentId') appointmentId: string) {
    return this.prescriptionsService.findAll(appointmentId);
  }

  @Post(':appointmentId')
  @Roles('ADMIN', 'MEDICO')
  create(
    @Param('appointmentId') appointmentId: string,
    @Body() dto: CreatePrescriptionDto,
  ) {
    return this.prescriptionsService.create(appointmentId, dto);
  }
}