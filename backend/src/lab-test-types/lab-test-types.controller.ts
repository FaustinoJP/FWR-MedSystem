import { Controller, Get, Query, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { LabTestTypesService } from './lab-test-types.service';

@UseGuards(JwtAuthGuard)
@Controller('lab-test-types')
export class LabTestTypesController {
  constructor(private service: LabTestTypesService) {}

  @Get()
  findAll(@Query('search') search?: string) {
    return this.service.findAll(search);
  }
}
