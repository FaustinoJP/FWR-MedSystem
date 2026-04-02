import { Controller, Get, Post, Body, Patch, Param, Delete, Query } from '@nestjs/common';
import { ExamTypesService } from './exam-types.service';
import { CreateExamTypeDto} from './dto/create-exam-type.dto';
import {UpdateExamTypeDto } from './dto/update-exam-type.dto';
import { Roles } from '../common/decorators/roles.decorator';
import { Role } from '../auth/enums/role.enum';

@Controller('lab/exam-types')
export class ExamTypesController {
  constructor(private readonly examTypesService: ExamTypesService) {}

  @Post()
  @Roles(Role.ADMIN)
  create(@Body() createExamTypeDto: CreateExamTypeDto) {
    return this.examTypesService.create(createExamTypeDto);
  }

  @Get()
  findAll(@Query('active') active?: string) {
    const activeOnly = active !== 'false';
    return this.examTypesService.findAll(activeOnly);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.examTypesService.findOne(id);
  }

  @Patch(':id')
  @Roles(Role.ADMIN)
  update(@Param('id') id: string, @Body() updateExamTypeDto: UpdateExamTypeDto) {
    return this.examTypesService.update(id, updateExamTypeDto);
  }

  @Delete(':id')
  @Roles(Role.ADMIN)
  remove(@Param('id') id: string) {
    return this.examTypesService.remove(id);
  }
}