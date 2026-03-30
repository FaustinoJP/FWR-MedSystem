import { Body, Controller, Get, Param, Post, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { RolesGuard } from '../common/guards/roles.guard';
import { Roles } from '../common/decorators/roles.decorator';
import { LabOrdersService } from './lab-orders.service';
import { CreateLabOrderDto } from './dto/create-lab-order.dto';

@UseGuards(JwtAuthGuard, RolesGuard)
@Controller('lab-orders')
export class LabOrdersController {
  constructor(private readonly labOrdersService: LabOrdersService) {}

  @Get(':appointmentId')
  @Roles('ADMIN', 'MEDICO')
  findAll(@Param('appointmentId') appointmentId: string) {
    return this.labOrdersService.findAll(appointmentId);
  }

  @Post(':appointmentId')
  @Roles('ADMIN', 'MEDICO')
  create(
    @Param('appointmentId') appointmentId: string,
    @Body() dto: CreateLabOrderDto,
  ) {
    return this.labOrdersService.create(appointmentId, dto);
  }
}