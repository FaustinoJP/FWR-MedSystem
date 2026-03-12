import { Controller, Get, Query, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { MedicationsService } from './medications.service';

@UseGuards(JwtAuthGuard)
@Controller('medications')
export class MedicationsController {
  constructor(private service: MedicationsService) {}

  @Get()
  findAll(@Query('search') search?: string) {
    return this.service.findAll(search);
  }
}
