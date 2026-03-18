import {
  PrismaClient,
  PaymentMethodType,
  UserStatus,
  Gender,
  AppointmentStatus,
  EncounterStatus,
  InvoiceStatus,
  PaymentStatus,
} from '@prisma/client';
import * as bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  const passwordHash = await bcrypt.hash('123456', 10);

  // =========================
  // ROLES
  // =========================
  const adminRole = await prisma.role.upsert({
    where: { name: 'ADMIN' },
    update: { description: 'Administrador do sistema' },
    create: { name: 'ADMIN', description: 'Administrador do sistema' },
  });

  const doctorRole = await prisma.role.upsert({
    where: { name: 'MEDICO' },
    update: { description: 'Médico' },
    create: { name: 'MEDICO', description: 'Médico' },
  });

  const nurseRole = await prisma.role.upsert({
    where: { name: 'ENFERMEIRO' },
    update: { description: 'Enfermeiro' },
    create: { name: 'ENFERMEIRO', description: 'Enfermeiro' },
  });

  const receptionistRole = await prisma.role.upsert({
    where: { name: 'RECEPCIONISTA' },
    update: { description: 'Rececionista' },
    create: { name: 'RECEPCIONISTA', description: 'Rececionista' },
  });

  const billingRole = await prisma.role.upsert({
    where: { name: 'FATURACAO' },
    update: { description: 'Utilizador de faturação' },
    create: { name: 'FATURACAO', description: 'Utilizador de faturação' },
  });

  // =========================
  // DEPARTAMENTOS
  // =========================
  const clinicaGeral = await prisma.department.upsert({
    where: { name: 'Clínica Geral' },
    update: {},
    create: { name: 'Clínica Geral' },
  });

  const triagem = await prisma.department.upsert({
    where: { name: 'Triagem' },
    update: {},
    create: { name: 'Triagem' },
  });

  const rececao = await prisma.department.upsert({
    where: { name: 'Receção' },
    update: {},
    create: { name: 'Receção' },
  });

  const faturacao = await prisma.department.upsert({
    where: { name: 'Faturação' },
    update: {},
    create: { name: 'Faturação' },
  });

  const laboratorio = await prisma.department.upsert({
    where: { name: 'Laboratório' },
    update: {},
    create: { name: 'Laboratório' },
  });

  // =========================
  // USERS
  // =========================
  const admin = await prisma.user.upsert({
    where: { email: 'admin@faustware.com' },
    update: {
      name: 'System Admin',
      roleId: adminRole.id,
      status: UserStatus.ACTIVE,
    },
    create: {
      name: 'System Admin',
      email: 'admin@faustware.com',
      passwordHash,
      roleId: adminRole.id,
      status: UserStatus.ACTIVE,
    },
  });

  const doctor = await prisma.user.upsert({
    where: { email: 'joao.miguel@faustware.com' },
    update: {
      name: 'Dr. João Miguel',
      roleId: doctorRole.id,
      departmentId: clinicaGeral.id,
      status: UserStatus.ACTIVE,
    },
    create: {
      name: 'Dr. João Miguel',
      email: 'joao.miguel@faustware.com',
      passwordHash,
      roleId: doctorRole.id,
      departmentId: clinicaGeral.id,
      status: UserStatus.ACTIVE,
    },
  });

  const nurse = await prisma.user.upsert({
    where: { email: 'ana.costa@faustware.com' },
    update: {
      name: 'Ana Costa',
      roleId: nurseRole.id,
      departmentId: triagem.id,
      status: UserStatus.ACTIVE,
    },
    create: {
      name: 'Ana Costa',
      email: 'ana.costa@faustware.com',
      passwordHash,
      roleId: nurseRole.id,
      departmentId: triagem.id,
      status: UserStatus.ACTIVE,
    },
  });

  const receptionist = await prisma.user.upsert({
    where: { email: 'maria.lopes@faustware.com' },
    update: {
      name: 'Maria Lopes',
      roleId: receptionistRole.id,
      departmentId: rececao.id,
      status: UserStatus.ACTIVE,
    },
    create: {
      name: 'Maria Lopes',
      email: 'maria.lopes@faustware.com',
      passwordHash,
      roleId: receptionistRole.id,
      departmentId: rececao.id,
      status: UserStatus.ACTIVE,
    },
  });

  const billingUser = await prisma.user.upsert({
    where: { email: 'fat@faustware.com' },
    update: {
      name: 'Paulo Facturação',
      roleId: billingRole.id,
      departmentId: faturacao.id,
      status: UserStatus.ACTIVE,
    },
    create: {
      name: 'Paulo Facturação',
      email: 'fat@faustware.com',
      passwordHash,
      roleId: billingRole.id,
      departmentId: faturacao.id,
      status: UserStatus.ACTIVE,
    },
  });

  // =========================
  // PATIENTS
  // =========================
  await prisma.patient.createMany({
    data: [
      {
        patientCode: 'PAT-2026-000001',
        firstName: 'Maria',
        lastName: 'Fernandes',
        gender: Gender.FEMALE,
        dateOfBirth: new Date('1992-05-10'),
        phone: '+244923000111',
        bloodGroup: 'O+',
      },
      {
        patientCode: 'PAT-2026-000002',
        firstName: 'Carlos',
        lastName: 'Domingos',
        gender: Gender.MALE,
        dateOfBirth: new Date('1988-09-13'),
        phone: '+244923000222',
        bloodGroup: 'A+',
      },
      {
        patientCode: 'PAT-2026-000003',
        firstName: 'Joana',
        lastName: 'Mateus',
        gender: Gender.FEMALE,
        dateOfBirth: new Date('2001-02-21'),
        phone: '+244923000333',
        bloodGroup: 'B+',
      },
    ],
    skipDuplicates: true,
  });

  const maria = await prisma.patient.findUnique({
    where: { patientCode: 'PAT-2026-000001' },
  });

  // =========================
  // MEDICATIONS
  // =========================
  await prisma.medication.createMany({
    data: [
      {
        name: 'Paracetamol',
        genericName: 'Acetaminofeno',
        form: 'Comprimido',
        strength: '500 mg',
        minimumStock: 100,
        status: true,
      },
      {
        name: 'Amoxicilina',
        genericName: 'Amoxicilina',
        form: 'Cápsula',
        strength: '500 mg',
        minimumStock: 80,
        status: true,
      },
      {
        name: 'Ibuprofeno',
        genericName: 'Ibuprofeno',
        form: 'Comprimido',
        strength: '400 mg',
        minimumStock: 60,
        status: true,
      },
    ],
    skipDuplicates: true,
  });

  // =========================
  // LAB TEST TYPES
  // =========================
  await prisma.labTestType.createMany({
    data: [
      { name: 'Hemograma Completo', category: 'Hematologia' },
      { name: 'Glicemia', category: 'Bioquímica' },
      { name: 'Urina II', category: 'Urinálise' },
    ],
    skipDuplicates: true,
  });

  // =========================
  // PAYMENT METHODS
  // =========================
  const paymentMethods: { name: string; type: PaymentMethodType }[] = [
    { name: 'Caixa', type: PaymentMethodType.CASH },
    { name: 'TPA', type: PaymentMethodType.POS },
    { name: 'Transferência Bancária', type: PaymentMethodType.BANK_TRANSFER },
    { name: 'RUP', type: PaymentMethodType.RUP },
    { name: 'Seguro', type: PaymentMethodType.INSURANCE },
    { name: 'Isento', type: PaymentMethodType.EXEMPT },
  ];

  for (const method of paymentMethods) {
    await prisma.paymentMethod.upsert({
      where: { name: method.name },
      update: {
        type: method.type,
        isActive: true,
      },
      create: {
        name: method.name,
        type: method.type,
        isActive: true,
      },
    });
  }

  const rupMethod = await prisma.paymentMethod.findUnique({
    where: { name: 'RUP' },
  });

  // =========================
  // SERVICES
  // =========================
  const consultaGeral = await prisma.service.upsert({
    where: { code: 'CONS-GERAL' },
    update: {
      name: 'Consulta Clínica Geral',
      unitPrice: 15000,
      departmentId: clinicaGeral.id,
    },
    create: {
      code: 'CONS-GERAL',
      name: 'Consulta Clínica Geral',
      unitPrice: 15000,
      departmentId: clinicaGeral.id,
    },
  });

  const triagemService = await prisma.service.upsert({
    where: { code: 'TRIAGEM' },
    update: {
      name: 'Serviço de Triagem',
      unitPrice: 5000,
      departmentId: triagem.id,
    },
    create: {
      code: 'TRIAGEM',
      name: 'Serviço de Triagem',
      unitPrice: 5000,
      departmentId: triagem.id,
    },
  });

  const hemogramaService = await prisma.service.upsert({
    where: { code: 'HEMOGRAMA' },
    update: {
      name: 'Hemograma Completo',
      unitPrice: 10000,
      departmentId: laboratorio.id,
    },
    create: {
      code: 'HEMOGRAMA',
      name: 'Hemograma Completo',
      unitPrice: 10000,
      departmentId: laboratorio.id,
    },
  });

  // =========================
  // APPOINTMENT
  // =========================
  let appointment = null;

  if (maria) {
    appointment = await prisma.appointment.findFirst({
      where: {
        patientId: maria.id,
        doctorId: doctor.id,
        departmentId: clinicaGeral.id,
      },
    });

    if (!appointment) {
      appointment = await prisma.appointment.create({
        data: {
          patientId: maria.id,
          doctorId: doctor.id,
          departmentId: clinicaGeral.id,
          appointmentDate: new Date(),
          status: AppointmentStatus.COMPLETED,
          reason: 'Consulta geral com febre e dor de cabeça',
        },
      });
    } else {
      appointment = await prisma.appointment.update({
        where: { id: appointment.id },
        data: {
          status: AppointmentStatus.COMPLETED,
          reason: 'Consulta geral com febre e dor de cabeça',
        },
      });
    }
  }

  // =========================
  // TRIAGE
  // =========================
  if (appointment) {
    await prisma.triage.upsert({
      where: { appointmentId: appointment.id },
      update: {
        weight: 68,
        height: 1.68,
        temperature: 38.2,
        bloodPressure: '120/80',
        heartRate: 92,
        respiratoryRate: 18,
        oxygenSaturation: 98,
        notes: 'Paciente apresenta febre e cefaleia há 2 dias.',
      },
      create: {
        appointmentId: appointment.id,
        weight: 68,
        height: 1.68,
        temperature: 38.2,
        bloodPressure: '120/80',
        heartRate: 92,
        respiratoryRate: 18,
        oxygenSaturation: 98,
        notes: 'Paciente apresenta febre e cefaleia há 2 dias.',
      },
    });
  }

  // =========================
  // ENCOUNTER
  // =========================
  if (appointment) {
    await prisma.encounter.upsert({
      where: { appointmentId: appointment.id },
      update: {
        status: EncounterStatus.CLOSED,
        chiefComplaint: 'Febre e dor de cabeça',
        historyOfPresentIllness:
          'Paciente refere febre intermitente, mal-estar geral e cefaleia há 48 horas.',
        physicalExam:
          'Paciente consciente, orientada, febril, hemodinamicamente estável.',
        assessment: 'Síndrome febril inespecífica. Descartar infeção.',
        plan: 'Medicação sintomática, solicitar hemograma e glicemia, hidratação oral.',
      },
      create: {
        appointmentId: appointment.id,
        status: EncounterStatus.CLOSED,
        chiefComplaint: 'Febre e dor de cabeça',
        historyOfPresentIllness:
          'Paciente refere febre intermitente, mal-estar geral e cefaleia há 48 horas.',
        physicalExam:
          'Paciente consciente, orientada, febril, hemodinamicamente estável.',
        assessment: 'Síndrome febril inespecífica. Descartar infeção.',
        plan: 'Medicação sintomática, solicitar hemograma e glicemia, hidratação oral.',
      },
    });
  }

  // =========================
  // PRESCRIPTIONS
  // =========================
  if (appointment) {
    const existingPrescription1 = await prisma.prescription.findFirst({
      where: {
        appointmentId: appointment.id,
        medicationName: 'Paracetamol',
      },
    });

    if (!existingPrescription1) {
      await prisma.prescription.create({
        data: {
          appointmentId: appointment.id,
          medicationName: 'Paracetamol',
          dosage: '500 mg',
          frequency: '8/8h',
          duration: '5 dias',
          instructions: 'Tomar após as refeições',
        },
      });
    }

    const existingPrescription2 = await prisma.prescription.findFirst({
      where: {
        appointmentId: appointment.id,
        medicationName: 'Ibuprofeno',
      },
    });

    if (!existingPrescription2) {
      await prisma.prescription.create({
        data: {
          appointmentId: appointment.id,
          medicationName: 'Ibuprofeno',
          dosage: '400 mg',
          frequency: '12/12h',
          duration: '3 dias',
          instructions: 'Usar em caso de dor ou febre persistente',
        },
      });
    }
  }

  // =========================
  // LAB ORDERS
  // =========================
  if (appointment) {
    const existingLab1 = await prisma.labOrder.findFirst({
      where: {
        appointmentId: appointment.id,
        testName: 'Hemograma Completo',
      },
    });

    if (!existingLab1) {
      await prisma.labOrder.create({
        data: {
          appointmentId: appointment.id,
          testName: 'Hemograma Completo',
          category: 'Hematologia',
          notes: 'Solicitado para despiste de processo infeccioso',
          status: 'REQUESTED',
        },
      });
    }

    const existingLab2 = await prisma.labOrder.findFirst({
      where: {
        appointmentId: appointment.id,
        testName: 'Glicemia',
      },
    });

    if (!existingLab2) {
      await prisma.labOrder.create({
        data: {
          appointmentId: appointment.id,
          testName: 'Glicemia',
          category: 'Bioquímica',
          notes: 'Avaliação metabólica complementar',
          status: 'REQUESTED',
        },
      });
    }
  }

  // =========================
  // INVOICE
  // =========================
  let invoice = null;

  if (appointment && maria) {
    invoice = await prisma.invoice.findUnique({
      where: { appointmentId: appointment.id },
    });

    if (!invoice) {
      invoice = await prisma.invoice.create({
        data: {
          patientId: maria.id,
          appointmentId: appointment.id,
          invoiceNumber: `INV-${new Date().getFullYear()}-000001`,
          description: 'Fatura da consulta clínica',
          totalAmount: 30000,
          discountAmount: 0,
          paidAmount: 30000,
          balance: 0,
          status: InvoiceStatus.PAID,
        },
      });
    } else {
      invoice = await prisma.invoice.update({
        where: { id: invoice.id },
        data: {
          description: 'Fatura da consulta clínica',
          totalAmount: 30000,
          discountAmount: 0,
          paidAmount: 30000,
          balance: 0,
          status: InvoiceStatus.PAID,
        },
      });
    }
  }

  // =========================
  // INVOICE ITEMS
  // =========================
  if (invoice) {
    const existingItems = await prisma.invoiceItem.findMany({
      where: { invoiceId: invoice.id },
    });

    if (existingItems.length === 0) {
      await prisma.invoiceItem.createMany({
        data: [
          {
            invoiceId: invoice.id,
            serviceType: 'CONSULTA',
            description: consultaGeral.name,
            quantity: 1,
            unitPrice: consultaGeral.unitPrice,
            totalPrice: consultaGeral.unitPrice,
          },
          {
            invoiceId: invoice.id,
            serviceType: 'TRIAGEM',
            description: triagemService.name,
            quantity: 1,
            unitPrice: triagemService.unitPrice,
            totalPrice: triagemService.unitPrice,
          },
          {
            invoiceId: invoice.id,
            serviceType: 'LABORATORIO',
            description: hemogramaService.name,
            quantity: 1,
            unitPrice: hemogramaService.unitPrice,
            totalPrice: hemogramaService.unitPrice,
          },
        ],
      });
    }
  }

  // =========================
  // PAYMENT
  // =========================
  if (invoice && rupMethod) {
    const existingPayment = await prisma.payment.findFirst({
      where: {
        invoiceId: invoice.id,
        paymentMethodId: rupMethod.id,
      },
    });

    if (!existingPayment) {
      await prisma.payment.create({
        data: {
          invoiceId: invoice.id,
          paymentMethodId: rupMethod.id,
          amount: 30000,
          status: PaymentStatus.PAID,
          reference: 'RUP-FAUST-000001',
          transactionReference: 'TXN-000001',
          externalTransactionId: 'EXT-000001',
          paidAt: new Date(),
          metadata: {
            provider: 'RUP',
            channel: 'sandbox',
          },
        },
      });
    }
  }

  console.log('Seed executado com sucesso.');
  console.log('--------------------------------');
  console.log('Admin: admin@faustware.com / 123456');
  console.log('Médico: joao.miguel@faustware.com / 123456');
  console.log('Enfermeiro: ana.costa@faustware.com / 123456');
  console.log('Receção: maria.lopes@faustware.com / 123456');
  console.log('Faturação: fat@faustware.com / 123456');
  console.log('--------------------------------');
  console.log('Fluxo demo criado:');
  console.log('- Paciente');
  console.log('- Consulta');
  console.log('- Triagem');
  console.log('- Atendimento');
  console.log('- Prescrição');
  console.log('- Exames');
  console.log('- Fatura');
  console.log('- Pagamento');
  console.log('--------------------------------');
  console.log('Admin ID:', admin.id);
  console.log('Doctor ID:', doctor.id);
  console.log('Nurse ID:', nurse.id);
  console.log('Receptionist ID:', receptionist.id);
  console.log('Billing ID:', billingUser.id);
}

main()
  .catch((e) => {
    console.error('Erro ao executar seed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });