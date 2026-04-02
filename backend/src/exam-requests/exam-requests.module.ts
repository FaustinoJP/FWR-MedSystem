import { Module } from '@nestjs/common';
import { PrismaModule } from '../prisma/prisma.module';
import { ExamRequestsController } from './exam-requests.controller';
import { ExamRequestsService } from './exam-requests.service';

@Module({
  imports: [PrismaModule],
  controllers: [ExamRequestsController],
  providers: [ExamRequestsService],
  exports: [ExamRequestsService],
})
export class ExamRequestsModule {}