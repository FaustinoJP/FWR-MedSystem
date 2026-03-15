import { Body, Controller, Get, Param, Patch, Post, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { CreateLabOrderDto } from './dto/create-lab-order.dto';
import { UpdateLabOrderDto } from './dto/update-lab-order.dto';
import { LabOrdersService } from './lab-orders.service';

@UseGuards(JwtAuthGuard)
@Controller()
export class LabOrdersController {
  constructor(private readonly labOrdersService: LabOrdersService) {}

  @Post('appointments/:appointmentId/lab-orders')
  create(
    @Param('appointmentId') appointmentId: string,
    @Body() dto: CreateLabOrderDto,
  ) {
    return this.labOrdersService.create(appointmentId, dto);
  }

  @Get('appointments/:appointmentId/lab-orders')
  findByAppointment(@Param('appointmentId') appointmentId: string) {
    return this.labOrdersService.findByAppointment(appointmentId);
  }

  @Get('lab-orders/:id')
  findOne(@Param('id') id: string) {
    return this.labOrdersService.findOne(id);
  }

  @Patch('lab-orders/:id')
  update(@Param('id') id: string, @Body() dto: UpdateLabOrderDto) {
    return this.labOrdersService.update(id, dto);
  }
}