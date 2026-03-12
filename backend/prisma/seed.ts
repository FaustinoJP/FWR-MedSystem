import { PrismaClient } from '@prisma/client';
import * as bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  const adminRole = await prisma.role.upsert({
    where: { name: 'Administrator' },
    update: {},
    create: { name: 'Administrator', description: 'Administrador do sistema' },
  });

  const doctorRole = await prisma.role.upsert({
    where: { name: 'Doctor' },
    update: {},
    create: { name: 'Doctor', description: 'Médico' },
  });

  const clinicaGeral = await prisma.department.upsert({
    where: { name: 'Clínica Geral' },
    update: {},
    create: { name: 'Clínica Geral' },
  });

  const passwordHash = await bcrypt.hash('123456', 10);

  await prisma.user.upsert({
    where: { email: 'admin@faustware.com' },
    update: {},
    create: {
      name: 'System Admin',
      email: 'admin@faustware.com',
      passwordHash,
      roleId: adminRole.id,
      status: 'ACTIVE',
    },
  });

  const doctor = await prisma.user.upsert({
    where: { email: 'joao.miguel@faustware.com' },
    update: {},
    create: {
      name: 'Dr. João Miguel',
      email: 'joao.miguel@faustware.com',
      passwordHash,
      roleId: doctorRole.id,
      status: 'ACTIVE',
    },
  });

  await prisma.patient.createMany({
    data: [
      {
        patientCode: 'PAT-2026-000001',
        firstName: 'Maria',
        lastName: 'Fernandes',
        gender: 'FEMALE',
        dateOfBirth: new Date('1992-05-10'),
        phone: '+244923000111',
        bloodGroup: 'O+',
      },
      {
        patientCode: 'PAT-2026-000002',
        firstName: 'Carlos',
        lastName: 'Domingos',
        gender: 'MALE',
        dateOfBirth: new Date('1988-09-13'),
        phone: '+244923000222',
        bloodGroup: 'A+',
      },
    ],
    skipDuplicates: true,
  });

  const patients = await prisma.patient.findMany({ take: 2 });

  await prisma.medication.createMany({
    data: [
      {
        name: 'Paracetamol',
        genericName: 'Acetaminofeno',
        form: 'Comprimido',
        strength: '500 mg',
        minimumStock: 100,
      },
      {
        name: 'Amoxicilina',
        genericName: 'Amoxicilina',
        form: 'Cápsula',
        strength: '500 mg',
        minimumStock: 80,
      },
    ],
    skipDuplicates: true,
  });

  await prisma.labTestType.createMany({
    data: [
      { name: 'Hemograma Completo', category: 'Hematologia' },
      { name: 'Glicemia', category: 'Bioquímica' },
    ],
    skipDuplicates: true,
  });

  for (const method of [
    { name: 'Caixa', type: 'CASH' },
    { name: 'TPA', type: 'CARD' },
    { name: 'Transferência Bancária', type: 'BANK_TRANSFER' },
  ]) {
    await prisma.paymentMethod.upsert({
      where: { name: method.name },
      update: { type: method.type as any, isActive: true },
      create: { ...method, type: method.type as any, isActive: true },
    });
  }

  await prisma.service.upsert({
    where: { code: 'CONS-GERAL' },
    update: {},
    create: {
      code: 'CONS-GERAL',
      name: 'Consulta Clínica Geral',
      unitPrice: 15000,
      departmentId: clinicaGeral.id,
    },
  });

  if (patients[0]) {
    await prisma.appointment
      .create({
        data: {
          patientId: patients[0].id,
          doctorId: doctor.id,
          departmentId: clinicaGeral.id,
          appointmentDate: new Date(),
          reason: 'Consulta geral',
        },
      })
      .catch(() => {});
  }

  console.log('Seed executado com sucesso.');
  console.log('Admin: admin@faustware.com / 123456');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
