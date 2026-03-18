import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { PrismaModule } from './prisma/prisma.module';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
import { PatientsModule } from './patients/patients.module';
import { AppointmentsModule } from './appointments/appointments.module';
import { MedicationsModule } from './medications/medications.module';
import { LabTestTypesModule } from './lab-test-types/lab-test-types.module';
import { PaymentMethodsModule } from './payment-methods/payment-methods.module';
import { DashboardModule } from './dashboard/dashboard.module';
import { TriageModule } from './triage/triage.module';
import { EncountersModule } from './encounters/encounters.module';
import { PrescriptionsModule } from './prescriptions/prescriptions.module';
import { LabOrdersModule } from './lab-orders/lab-orders.module';
import { BillingModule } from './billing/billing.module';
import { DepartmentsModule } from './departments/departments.module';
import { RolesModule } from './roles/roles.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    PrismaModule,
    AuthModule,
    UsersModule,
    RolesModule,
    PatientsModule,
    AppointmentsModule,
    MedicationsModule,
    LabTestTypesModule,
    PaymentMethodsModule,
    DashboardModule,
    TriageModule,
    EncountersModule,
    PrescriptionsModule,
    LabOrdersModule,
    BillingModule,
    DepartmentsModule,

  ],
})
export class AppModule {}


