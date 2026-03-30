import { Controller, Get, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { RolesGuard } from '../common/guards/roles.guard';
import { Roles } from '../common/decorators/roles.decorator';
import { PaymentMethodsService } from './payment-methods.service';

@UseGuards(JwtAuthGuard, RolesGuard)
@Controller('payment-methods')
export class PaymentMethodsController {
  constructor(private service: PaymentMethodsService) {}

  @Get()
  @Roles('ADMIN', 'FATURACAO')
  findAll() {
    return this.service.findAll();
  }
}