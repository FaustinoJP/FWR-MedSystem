import { Controller, Get, Post, Body, Patch, Param, Delete, Req, Query } from '@nestjs/common';
import { ExamRequestsService } from './exam-requests.service';
import { CreateExamRequestDto } from './dto/create-exam-request.dto';
import { AddResultDto } from './dto/add-result.dto';
import { UpdateExamRequestDto } from './dto/update-exam-request.dto';
import { Roles } from '../common/decorators/roles.decorator';
import { Role } from '../auth/enums/role.enum';

@Controller('lab/exam-requests')
export class ExamRequestsController {
  constructor(private readonly examRequestsService: ExamRequestsService) {}

  @Post()
  @Roles(Role.DOCTOR, Role.ADMIN, Role.NURSE)
  create(@Body() createExamRequestDto: CreateExamRequestDto) {
    return this.examRequestsService.create(createExamRequestDto);
  }

  // ← Esta é a rota que o frontend precisa (com query parameter)
  @Get()
  @Roles(Role.DOCTOR, Role.ADMIN, Role.NURSE, Role.LABORATORISTA)
  findAllByAppointment(@Query('appointmentId') appointmentId?: string) {
    if (appointmentId) {
      return this.examRequestsService.findAllByAppointment(appointmentId);
    }
    return this.examRequestsService.findAll(); // fallback
  }

  @Get(':id')
  @Roles(Role.DOCTOR, Role.ADMIN, Role.LABORATORISTA)
  findOne(@Param('id') id: string) {
    return this.examRequestsService.findOne(id);
  }

  @Patch(':id')
  @Roles(Role.ADMIN, Role.LABORATORISTA)
  update(@Param('id') id: string, @Body() updateExamRequestDto: UpdateExamRequestDto) {
    return this.examRequestsService.update(id, updateExamRequestDto);
  }

  @Patch(':id/result')
  @Roles(Role.LABORATORISTA, Role.ADMIN)
  addResult(@Param('id') id: string, @Body() addResultDto: AddResultDto, @Req() req: any) {
    const validatedBy = req.user?.id;
    return this.examRequestsService.addResult(id, addResultDto, validatedBy);
  }

  @Patch(':id/validate')
  @Roles(Role.LABORATORISTA, Role.ADMIN)
  validate(@Param('id') id: string, @Req() req: any) {
    const validatedBy = req.user?.id;
    return this.examRequestsService.validate(id, validatedBy);
  }

  @Delete(':id')
  @Roles(Role.ADMIN)
  remove(@Param('id') id: string) {
    return this.examRequestsService.remove(id);
  }

  // ======================
  // PAINEL DO LABORATÓRIO
  // ======================

  @Get('panel')
  @Roles(Role.LABORATORISTA, Role.ADMIN)
  getLabPanel(
    @Query('status') status?: string,
    @Query('priority') priority?: string,
  ) {
    return this.examRequestsService.getLabPanel(status, priority);
  }

  @Get('panel/stats')
  @Roles(Role.LABORATORISTA, Role.ADMIN)
  getLabStats() {
    return this.examRequestsService.getLabStats();
  }
}