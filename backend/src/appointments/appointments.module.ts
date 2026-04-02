import { Module } from '@nestjs/common';
import { PrismaModule } from '../prisma/prisma.module';
import { AppointmentsController } from './appointments.controller';
import { AppointmentsService } from './appointments.service';
import { ExamRequestsModule } from '../exam-requests/exam-requests.module';

@Module({
  imports: [
    PrismaModule,
    ExamRequestsModule,
  ],
  controllers: [AppointmentsController],   // ← Este array estava em falta ou mal configurado
  providers: [AppointmentsService],
  exports: [AppointmentsService],
})
export class AppointmentsModule {}