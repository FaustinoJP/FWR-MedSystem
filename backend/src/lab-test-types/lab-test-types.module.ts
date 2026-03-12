import { Module } from '@nestjs/common';
import { LabTestTypesController } from './lab-test-types.controller';
import { LabTestTypesService } from './lab-test-types.service';

@Module({
  controllers: [LabTestTypesController],
  providers: [LabTestTypesService],
})
export class LabTestTypesModule {}
