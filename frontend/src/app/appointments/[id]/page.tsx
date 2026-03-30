'use client';

import { getCurrentUser, type AuthUser } from '@/lib/auth';
import {
  canAccessTriage,
  canEditTriage,
  canAccessEncounter,
  canEditEncounter,
  canAccessPrescriptions,
  canEditPrescriptions,
  canAccessLabOrders,
  canEditLabOrders,
  canAccessBilling,
  canEditBilling,
  canCompleteAppointment,
} from '@/lib/permissions';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { useEffect, useMemo, useState } from 'react';
import { useAppointmentDetails } from '@/hooks/use-appointment-details';
import { useTriage } from '@/hooks/use-triage';
import { useEncounter } from '@/hooks/use-encounter';
import { usePrescriptions } from '@/hooks/use-prescriptions';
import { useLabOrders } from '@/hooks/use-lab-orders';
import { useInvoice } from '@/hooks/use-invoice';
import { usePayments } from '@/hooks/use-payments';
import { usePaymentMethods } from '@/hooks/use-payment-methods';
import { useCompleteAppointment } from '@/hooks/use-complete-appointment';

function formatDate(value?: string | null) {
  if (!value) return '-';
  return new Date(value).toLocaleString('pt-PT');
}

function currency(value?: number | null) {
  return new Intl.NumberFormat('pt-PT', {
    style: 'currency',
    currency: 'AOA',
    maximumFractionDigits: 2,
  }).format(Number(value || 0));
}

function appointmentStatusLabel(status?: string) {
  switch (status) {
    case 'SCHEDULED':
      return 'Agendada';
    case 'CHECKED_IN':
      return 'Check-in';
    case 'IN_TRIAGE':
      return 'Em triagem';
    case 'IN_CONSULTATION':
      return 'Em consulta';
    case 'COMPLETED':
      return 'Concluída';
    case 'CANCELLED':
      return 'Cancelada';
    case 'NO_SHOW':
      return 'Faltou';
    default:
      return status || '-';
  }
}

export default function AppointmentDetailsPage() {
  const params = useParams<{ id: string }>();
  const appointmentId = String(params.id);

  const appointmentQuery = useAppointmentDetails(appointmentId);
  const triageQuery = useTriage(appointmentId);
  const encounterQuery = useEncounter(appointmentId);
  const prescriptionsQuery = usePrescriptions(appointmentId);
  const labOrdersQuery = useLabOrders(appointmentId);
  const invoiceQuery = useInvoice(appointmentId);
  const paymentMethodsQuery = usePaymentMethods();
  const paymentsQuery = usePayments(invoiceQuery.data?.id);
  const completeAppointment = useCompleteAppointment();

  const appointment = appointmentQuery.data;
  const triage = triageQuery.data;
  const encounter = encounterQuery.data;
  const prescriptions = prescriptionsQuery.data;
  const labOrders = labOrdersQuery.data;
  const invoice = invoiceQuery.data;
  const payments = paymentsQuery.data;
  const paymentMethods = paymentMethodsQuery.data;

  const [currentUser, setCurrentUser] = useState<AuthUser | null>(null);
  const [authReady, setAuthReady] = useState(false);

  useEffect(() => {
    const user = getCurrentUser();
    setCurrentUser(user);
    setAuthReady(true);
  }, []);

  const role = currentUser?.role;

  const isCompleted = appointment?.status === 'COMPLETED';
  const isNoShow = appointment?.status === 'NO_SHOW';
  const isCancelled = appointment?.status === 'CANCELLED';

  const isClinicalLocked = isCompleted || isNoShow || isCancelled;

  const rupMethod = useMemo(
    () => paymentMethods.find((m) => m.type === 'RUP'),
    [paymentMethods],
  );

  const [tab, setTab] = useState<
    'overview' | 'triage' | 'encounter' | 'prescriptions' | 'lab-orders' | 'billing'
  >('overview');

  useEffect(() => {
  if (!authReady) return;

  const allowedTabs: Array<
    'overview' | 'triage' | 'encounter' | 'prescriptions' | 'lab-orders' | 'billing'
  > = ['overview'];

  if (!isNoShow && !isCancelled && canAccessTriage(role)) allowedTabs.push('triage');
  if (!isNoShow && !isCancelled && canAccessEncounter(role)) allowedTabs.push('encounter');
  if (!isNoShow && !isCancelled && canAccessPrescriptions(role)) allowedTabs.push('prescriptions');
  if (!isNoShow && !isCancelled && canAccessLabOrders(role)) allowedTabs.push('lab-orders');
  if (canAccessBilling(role)) allowedTabs.push('billing');

  if (!allowedTabs.includes(tab)) {
    setTab('overview');
  }
}, [authReady, role, tab, isNoShow, isCancelled]);

  const [savingTriage, setSavingTriage] = useState(false);
  const [savingEncounter, setSavingEncounter] = useState(false);
  const [savingPrescription, setSavingPrescription] = useState(false);
  const [savingLabOrder, setSavingLabOrder] = useState(false);
  const [savingInvoice, setSavingInvoice] = useState(false);
  const [savingPayment, setSavingPayment] = useState(false);

  const [triageMessage, setTriageMessage] = useState('');
  const [encounterMessage, setEncounterMessage] = useState('');
  const [prescriptionMessage, setPrescriptionMessage] = useState('');
  const [labOrderMessage, setLabOrderMessage] = useState('');
  const [billingMessage, setBillingMessage] = useState('');
  const [completeMessage, setCompleteMessage] = useState('');

  const [triageForm, setTriageForm] = useState({
    weight: '',
    height: '',
    temperature: '',
    bloodPressure: '',
    heartRate: '',
    respiratoryRate: '',
    oxygenSaturation: '',
    notes: '',
  });

  const [encounterForm, setEncounterForm] = useState({
    chiefComplaint: '',
    historyOfPresentIllness: '',
    physicalExam: '',
    assessment: '',
    plan: '',
  });

  const [prescriptionForm, setPrescriptionForm] = useState({
    medicationName: '',
    dosage: '',
    frequency: '',
    duration: '',
    instructions: '',
  });

  const [labOrderForm, setLabOrderForm] = useState({
    testName: '',
    category: '',
    notes: '',
  });

  const [invoiceForm, setInvoiceForm] = useState({
    description: 'Consulta clínica geral',
    totalAmount: '',
    discountAmount: '0',
  });

  const [paymentForm, setPaymentForm] = useState({
    paymentMethodId: '',
    amount: '',
    reference: '',
    expiresAt: '',
    entity: '',
    transactionReference: '',
    externalTransactionId: '',
  });

  async function handleCompleteAppointment() {
    if (!appointmentId) return;

    const confirmed = window.confirm(
      'Tem certeza que deseja encerrar esta consulta? Esta ação fecha o atendimento clínico.',
    );

    if (!confirmed) return;

    setCompleteMessage('');

    try {
      await completeAppointment.complete(appointmentId);
      setCompleteMessage('Consulta encerrada com sucesso.');
      await appointmentQuery.refetch();
      await encounterQuery.refetch();
    } catch (err: any) {
      setCompleteMessage(err.message || 'Erro ao encerrar consulta');
    }
  }

  async function submitTriage(e: React.FormEvent) {
    e.preventDefault();
    setSavingTriage(true);
    setTriageMessage('');

    const payload = {
      weight: triageForm.weight ? Number(triageForm.weight) : undefined,
      height: triageForm.height ? Number(triageForm.height) : undefined,
      temperature: triageForm.temperature ? Number(triageForm.temperature) : undefined,
      bloodPressure: triageForm.bloodPressure || undefined,
      heartRate: triageForm.heartRate ? Number(triageForm.heartRate) : undefined,
      respiratoryRate: triageForm.respiratoryRate
        ? Number(triageForm.respiratoryRate)
        : undefined,
      oxygenSaturation: triageForm.oxygenSaturation
        ? Number(triageForm.oxygenSaturation)
        : undefined,
      notes: triageForm.notes || undefined,
    };

    try {
      if (triage) {
        await triageQuery.update(payload);
        setTriageMessage('Triagem atualizada com sucesso.');
      } else {
        await triageQuery.create(payload);
        setTriageMessage('Triagem criada com sucesso.');
      }
      await appointmentQuery.refetch();
      await triageQuery.refetch();
    } catch (err: any) {
      setTriageMessage(err.message || 'Erro ao guardar triagem');
    } finally {
      setSavingTriage(false);
    }
  }

  async function submitEncounter(e: React.FormEvent) {
    e.preventDefault();
    setSavingEncounter(true);
    setEncounterMessage('');

    const payload = {
      chiefComplaint: encounterForm.chiefComplaint || undefined,
      historyOfPresentIllness: encounterForm.historyOfPresentIllness || undefined,
      physicalExam: encounterForm.physicalExam || undefined,
      assessment: encounterForm.assessment || undefined,
      plan: encounterForm.plan || undefined,
    };

    try {
      if (encounter) {
        await encounterQuery.update(payload);
        setEncounterMessage('Atendimento clínico atualizado com sucesso.');
      } else {
        await encounterQuery.create(payload);
        setEncounterMessage('Atendimento clínico criado com sucesso.');
      }
      await appointmentQuery.refetch();
      await encounterQuery.refetch();
    } catch (err: any) {
      setEncounterMessage(err.message || 'Erro ao guardar atendimento');
    } finally {
      setSavingEncounter(false);
    }
  }

  async function submitPrescription(e: React.FormEvent) {
    e.preventDefault();
    setSavingPrescription(true);
    setPrescriptionMessage('');

    try {
      await prescriptionsQuery.create({
        medicationName: prescriptionForm.medicationName,
        dosage: prescriptionForm.dosage,
        frequency: prescriptionForm.frequency,
        duration: prescriptionForm.duration,
        instructions: prescriptionForm.instructions || undefined,
      });

      setPrescriptionMessage('Prescrição criada com sucesso.');
      setPrescriptionForm({
        medicationName: '',
        dosage: '',
        frequency: '',
        duration: '',
        instructions: '',
      });

      await appointmentQuery.refetch();
      await prescriptionsQuery.refetch();
    } catch (err: any) {
      setPrescriptionMessage(err.message || 'Erro ao guardar prescrição');
    } finally {
      setSavingPrescription(false);
    }
  }

  async function submitLabOrder(e: React.FormEvent) {
    e.preventDefault();
    setSavingLabOrder(true);
    setLabOrderMessage('');

    try {
      await labOrdersQuery.create({
        testName: labOrderForm.testName,
        category: labOrderForm.category || undefined,
        notes: labOrderForm.notes || undefined,
      });

      setLabOrderMessage('Pedido laboratorial criado com sucesso.');
      setLabOrderForm({
        testName: '',
        category: '',
        notes: '',
      });

      await appointmentQuery.refetch();
      await labOrdersQuery.refetch();
    } catch (err: any) {
      setLabOrderMessage(err.message || 'Erro ao guardar exame');
    } finally {
      setSavingLabOrder(false);
    }
  }

  async function submitInvoice(e: React.FormEvent) {
    e.preventDefault();
    setSavingInvoice(true);
    setBillingMessage('');

    try {
      await invoiceQuery.create({
        description: invoiceForm.description || undefined,
        totalAmount: Number(invoiceForm.totalAmount || 0),
        discountAmount: Number(invoiceForm.discountAmount || 0),
      });

      setBillingMessage('Fatura criada com sucesso.');
      await invoiceQuery.refetch();
      await appointmentQuery.refetch();
    } catch (err: any) {
      setBillingMessage(err.message || 'Erro ao criar fatura');
    } finally {
      setSavingInvoice(false);
    }
  }

  async function submitPayment(e: React.FormEvent) {
    e.preventDefault();
    setSavingPayment(true);
    setBillingMessage('');

    try {
      const selectedMethod = paymentMethods.find(
        (m) => m.id === paymentForm.paymentMethodId,
      );

      const metadata =
        selectedMethod?.type === 'RUP'
          ? {
              entity: paymentForm.entity || undefined,
              provider: 'RUP',
            }
          : undefined;

      await paymentsQuery.create({
        paymentMethodId: paymentForm.paymentMethodId,
        amount: Number(paymentForm.amount || 0),
        reference: paymentForm.reference || undefined,
        transactionReference: paymentForm.transactionReference || undefined,
        externalTransactionId: paymentForm.externalTransactionId || undefined,
        expiresAt: paymentForm.expiresAt || undefined,
        metadata,
      });

      setBillingMessage('Pagamento registado com sucesso.');

      setPaymentForm({
        paymentMethodId: '',
        amount: '',
        reference: '',
        expiresAt: '',
        entity: '',
        transactionReference: '',
        externalTransactionId: '',
      });

      await paymentsQuery.refetch();
      await invoiceQuery.refetch();
      await appointmentQuery.refetch();
    } catch (err: any) {
      setBillingMessage(err.message || 'Erro ao registar pagamento');
    } finally {
      setSavingPayment(false);
    }
  }

  async function markPaymentAsPaid(paymentId: string) {
    try {
      await paymentsQuery.updateStatus(paymentId, 'PAID');
      await paymentsQuery.refetch();
      await invoiceQuery.refetch();
      setBillingMessage('Pagamento confirmado com sucesso.');
    } catch (err: any) {
      setBillingMessage(err.message || 'Erro ao confirmar pagamento');
    }
  }

  const selectedPaymentMethod = paymentMethods.find(
    (m) => m.id === paymentForm.paymentMethodId,
  );

  if (appointmentQuery.loading) {
    return (
      <div style={pageStyle}>
        <div style={containerStyle}>
          <div style={cardStyle}>A carregar consulta...</div>
        </div>
      </div>
    );
  }

  if (appointmentQuery.error || !appointment) {
    return (
      <div style={pageStyle}>
        <div style={containerStyle}>
          <div style={{ ...cardStyle, color: 'crimson' }}>
            {appointmentQuery.error || 'Consulta não encontrada'}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div style={pageStyle}>
      <div style={containerStyle}>
        <div style={headerStyle}>
          <div>
            <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap', marginBottom: 8 }}>
              <Link href="/dashboard" style={topNavLinkStyle}>
                ← Dashboard
              </Link>
              <Link href="/appointments" style={topNavLinkStyle}>
                ← Consultas
              </Link>
              <Link href={`/patients/${appointment.patient.id}`} style={topNavLinkStyle}>
                ← Paciente
              </Link>
            </div>

            <h1 style={{ margin: 0 }}>Detalhe da consulta</h1>
            <p style={subtitleStyle}>
              {appointment.patient.firstName} {appointment.patient.lastName} •{' '}
              {appointment.department.name}
            </p>
          </div>

          <div style={{ display: 'flex', gap: 12, alignItems: 'center', flexWrap: 'wrap' }}>
            {isCompleted ? (
          <div style={successBadgeStyle}>Consulta concluída</div>
            ) : canCompleteAppointment(role) && !isNoShow && !isCancelled ? (
          <button
            type="button"
            onClick={handleCompleteAppointment}
            disabled={completeAppointment.loading}
            style={successButtonStyle}
          >
            {completeAppointment.loading ? 'A encerrar...' : 'Encerrar consulta'}
          </button>
           ) : null}

            <div style={pillStyle}>{appointmentStatusLabel(appointment.status)}</div>
          </div>
        </div>

        {completeMessage ? (
          <p style={{ color: completeMessage.includes('sucesso') ? 'green' : 'crimson', margin: 0 }}>
            {completeMessage}
          </p>
        ) : null}

        <section style={cardStyle}>
          <div style={summaryGridStyle}>
            <Info
              label="Paciente"
              value={`${appointment.patient.firstName} ${appointment.patient.lastName}`}
            />
            <Info label="Código" value={appointment.patient.patientCode} />
            <Info label="Médico" value={appointment.doctor.name} />
            <Info label="Data" value={formatDate(appointment.appointmentDate)} />
          </div>
        </section>

        <div style={tabsWrapStyle}>
        <TabButton active={tab === 'overview'} onClick={() => setTab('overview')}>
          Resumo
        </TabButton>

        {authReady && !isNoShow && !isCancelled && canAccessTriage(role) && (
          <TabButton active={tab === 'triage'} onClick={() => setTab('triage')}>
            Triagem
          </TabButton>
        )}

        {authReady && !isNoShow && !isCancelled && canAccessEncounter(role) && (
          <TabButton active={tab === 'encounter'} onClick={() => setTab('encounter')}>
            Atendimento
          </TabButton>
        )}

        {authReady && !isNoShow && !isCancelled && canAccessPrescriptions(role) && (
          <TabButton active={tab === 'prescriptions'} onClick={() => setTab('prescriptions')}>
            Prescrições
          </TabButton>
        )}

        {authReady && !isNoShow && !isCancelled && canAccessLabOrders(role) && (
          <TabButton active={tab === 'lab-orders'} onClick={() => setTab('lab-orders')}>
            Exames
          </TabButton>
        )}

        {authReady && canAccessBilling(role) && (
          <TabButton active={tab === 'billing'} onClick={() => setTab('billing')}>
            Faturação
          </TabButton>
        )}

        </div>

        {tab === 'overview' && (
          <div style={twoColumnGridStyle}>
            <section style={cardStyle}>
              <h3 style={sectionTitleStyle}>Triagem</h3>
              {!triage ? (
                <p style={muted}>Nenhuma triagem registada.</p>
              ) : (
                <div style={overviewInfoGridStyle}>
                  <Info label="Peso" value={triage.weight ? `${triage.weight} kg` : '-'} />
                  <Info label="Altura" value={triage.height ? `${triage.height} cm` : '-'} />
                  <Info label="Temperatura" value={triage.temperature ? `${triage.temperature} °C` : '-'} />
                  <Info label="Pressão arterial" value={triage.bloodPressure || '-'} />
                  <Info label="Frequência cardíaca" value={triage.heartRate ? `${triage.heartRate} bpm` : '-'} />
                  <Info label="Frequência respiratória" value={triage.respiratoryRate ? String(triage.respiratoryRate) : '-'} />
                  <Info label="Saturação" value={triage.oxygenSaturation ? `${triage.oxygenSaturation}%` : '-'} />
                  <Info label="Notas" value={triage.notes || '-'} />
                </div>
              )}
            </section>

            <section style={cardStyle}>
              <h3 style={sectionTitleStyle}>Atendimento clínico</h3>
              {!encounter ? (
                <p style={muted}>Nenhum atendimento clínico registado.</p>
              ) : (
                <div style={overviewInfoGridStyle}>
                  <Info label="Estado" value={encounter.status} />
                  <Info label="Queixa principal" value={encounter.chiefComplaint || '-'} />
                  <Info label="História clínica" value={encounter.historyOfPresentIllness || '-'} />
                  <Info label="Exame físico" value={encounter.physicalExam || '-'} />
                  <Info label="Avaliação" value={encounter.assessment || '-'} />
                  <Info label="Plano" value={encounter.plan || '-'} />
                </div>
              )}
            </section>
          </div>
        )}

        {tab === 'triage' && (
          <section style={cardStyle}>
            <h3 style={sectionTitleStyle}>{triage ? 'Atualizar triagem' : 'Criar triagem'}</h3>

            {isClinicalLocked ? <ConsultationLockedMessage status={appointment?.status} /> : null}
            {authReady && !canEditTriage(role) ? <ReadOnlyMessage /> : null}

            <form onSubmit={submitTriage} style={formGridStyle}>
              <div style={grid2}>
                <Field label="Peso (kg)">
                  <input value={triageForm.weight} onChange={(e) => setTriageForm((p) => ({ ...p, weight: e.target.value }))} style={inputStyle} />
                </Field>
                <Field label="Altura (cm)">
                  <input value={triageForm.height} onChange={(e) => setTriageForm((p) => ({ ...p, height: e.target.value }))} style={inputStyle} />
                </Field>
                <Field label="Temperatura">
                  <input value={triageForm.temperature} onChange={(e) => setTriageForm((p) => ({ ...p, temperature: e.target.value }))} style={inputStyle} />
                </Field>
                <Field label="Pressão arterial">
                  <input value={triageForm.bloodPressure} onChange={(e) => setTriageForm((p) => ({ ...p, bloodPressure: e.target.value }))} style={inputStyle} />
                </Field>
                <Field label="Frequência cardíaca">
                  <input value={triageForm.heartRate} onChange={(e) => setTriageForm((p) => ({ ...p, heartRate: e.target.value }))} style={inputStyle} />
                </Field>
                <Field label="Frequência respiratória">
                  <input value={triageForm.respiratoryRate} onChange={(e) => setTriageForm((p) => ({ ...p, respiratoryRate: e.target.value }))} style={inputStyle} />
                </Field>
                <Field label="Saturação O2">
                  <input value={triageForm.oxygenSaturation} onChange={(e) => setTriageForm((p) => ({ ...p, oxygenSaturation: e.target.value }))} style={inputStyle} />
                </Field>
              </div>

              <Field label="Notas">
                <textarea value={triageForm.notes} onChange={(e) => setTriageForm((p) => ({ ...p, notes: e.target.value }))} style={textareaStyle} />
              </Field>

              {triageMessage ? <p style={{ color: triageMessage.includes('sucesso') ? 'green' : 'crimson' }}>{triageMessage}</p> : null}

              <button
                type="submit"
                style={buttonStyle}
                disabled={savingTriage || isClinicalLocked || !canEditTriage(role)}
              >
                {savingTriage
                  ? 'A guardar...'
                  : isClinicalLocked
                  ? 'Consulta encerrada'
                  : !canEditTriage(role)
                  ? 'Sem permissão'
                  : triage
                  ? 'Atualizar triagem'
                  : 'Guardar triagem'}
              </button>
            </form>
          </section>
        )}

        {tab === 'encounter' && (
          <section style={cardStyle}>
            <h3 style={sectionTitleStyle}>{encounter ? 'Atualizar atendimento clínico' : 'Criar atendimento clínico'}</h3>

            {isClinicalLocked ? <ConsultationLockedMessage status={appointment?.status} /> : null}
            {authReady && !canEditEncounter(role) ? <ReadOnlyMessage /> : null}

            <form onSubmit={submitEncounter} style={formGridStyle}>
              <Field label="Queixa principal">
                <textarea value={encounterForm.chiefComplaint} onChange={(e) => setEncounterForm((p) => ({ ...p, chiefComplaint: e.target.value }))} style={textareaStyle} />
              </Field>

              <Field label="História da doença atual">
                <textarea value={encounterForm.historyOfPresentIllness} onChange={(e) => setEncounterForm((p) => ({ ...p, historyOfPresentIllness: e.target.value }))} style={textareaStyle} />
              </Field>

              <Field label="Exame físico">
                <textarea value={encounterForm.physicalExam} onChange={(e) => setEncounterForm((p) => ({ ...p, physicalExam: e.target.value }))} style={textareaStyle} />
              </Field>

              <Field label="Avaliação">
                <textarea value={encounterForm.assessment} onChange={(e) => setEncounterForm((p) => ({ ...p, assessment: e.target.value }))} style={textareaStyle} />
              </Field>

              <Field label="Plano terapêutico">
                <textarea value={encounterForm.plan} onChange={(e) => setEncounterForm((p) => ({ ...p, plan: e.target.value }))} style={textareaStyle} />
              </Field>

              {encounterMessage ? <p style={{ color: encounterMessage.includes('sucesso') ? 'green' : 'crimson' }}>{encounterMessage}</p> : null}

              <button
                type="submit"
                style={buttonStyle}
                disabled={savingEncounter || isClinicalLocked || !canEditEncounter(role)}
              >
                {savingEncounter
                  ? 'A guardar...'
                  : isClinicalLocked
                  ? 'Consulta encerrada'
                  : !canEditEncounter(role)
                  ? 'Sem permissão'
                  : encounter
                  ? 'Atualizar atendimento'
                  : 'Guardar atendimento'}
              </button>
            </form>
          </section>
        )}

        {tab === 'prescriptions' && (
          <section style={cardStyle}>
            <div>
              <h3 style={sectionTitleStyle}>Prescrições</h3>
              <p style={{ ...muted, marginTop: 4 }}>Registe os medicamentos prescritos para esta consulta.</p>
            </div>

            {isClinicalLocked ? <ConsultationLockedMessage status={appointment?.status} /> : null}
            {authReady && !canEditPrescriptions(role) ? <ReadOnlyMessage /> : null}

            <form onSubmit={submitPrescription} style={formGridStyle}>
              <div style={grid2}>
                <Field label="Medicamento">
                  <input value={prescriptionForm.medicationName} onChange={(e) => setPrescriptionForm((p) => ({ ...p, medicationName: e.target.value }))} placeholder="Ex.: Paracetamol 500mg" style={inputStyle} />
                </Field>

                <Field label="Dose">
                  <input value={prescriptionForm.dosage} onChange={(e) => setPrescriptionForm((p) => ({ ...p, dosage: e.target.value }))} placeholder="Ex.: 1 comprimido" style={inputStyle} />
                </Field>

                <Field label="Frequência">
                  <input value={prescriptionForm.frequency} onChange={(e) => setPrescriptionForm((p) => ({ ...p, frequency: e.target.value }))} placeholder="Ex.: 8/8h" style={inputStyle} />
                </Field>

                <Field label="Duração">
                  <input value={prescriptionForm.duration} onChange={(e) => setPrescriptionForm((p) => ({ ...p, duration: e.target.value }))} placeholder="Ex.: 5 dias" style={inputStyle} />
                </Field>
              </div>

              <Field label="Instruções">
                <textarea value={prescriptionForm.instructions} onChange={(e) => setPrescriptionForm((p) => ({ ...p, instructions: e.target.value }))} placeholder="Ex.: Tomar após as refeições" style={textareaStyle} />
              </Field>

              {prescriptionMessage ? <p style={{ color: prescriptionMessage.includes('sucesso') ? 'green' : 'crimson', margin: 0 }}>{prescriptionMessage}</p> : null}

              <div>
                <button
                  type="submit"
                  style={buttonStyle}
                  disabled={savingPrescription || isClinicalLocked || !canEditPrescriptions(role)}
                >
                  {savingPrescription
                    ? 'A guardar...'
                    : isCompleted
                    ? 'Consulta encerrada'
                    : !canEditPrescriptions(role)
                    ? 'Sem permissão'
                    : 'Guardar prescrição'}
                </button>
              </div>
            </form>

            <div style={{ display: 'grid', gap: 12 }}>
              <div>
                <h4 style={{ marginBottom: 4 }}>Lista de prescrições</h4>
                <p style={muted}>Prescrições já registadas nesta consulta.</p>
              </div>

              {prescriptionsQuery.loading ? (
                <p style={muted}>A carregar prescrições...</p>
              ) : prescriptions.length === 0 ? (
                <div style={emptyStateStyle}>Nenhuma prescrição registada.</div>
              ) : (
                prescriptions.map((item) => (
                  <CardItem key={item.id}>
                    <div style={cardHeaderStyle}>
                      <strong style={{ fontSize: 16 }}>{item.medicationName}</strong>
                      <span style={pillStyle}>{formatDate(item.createdAt)}</span>
                    </div>
                    <div>{item.dosage} • {item.frequency} • {item.duration}</div>
                    <div><strong>Instruções:</strong> {item.instructions || '-'}</div>
                  </CardItem>
                ))
              )}
            </div>
          </section>
        )}

        {tab === 'lab-orders' && (
          <section style={cardStyle}>
            <div>
              <h3 style={sectionTitleStyle}>Exames laboratoriais</h3>
              <p style={{ ...muted, marginTop: 4 }}>Registe os exames solicitados nesta consulta.</p>
            </div>

            {isClinicalLocked ? <ConsultationLockedMessage status={appointment?.status} /> : null}
            {authReady && !canEditLabOrders(role) ? <ReadOnlyMessage /> : null}

            <form onSubmit={submitLabOrder} style={formGridStyle}>
              <div style={grid2}>
                <Field label="Exame">
                  <input value={labOrderForm.testName} onChange={(e) => setLabOrderForm((p) => ({ ...p, testName: e.target.value }))} placeholder="Ex.: Hemograma Completo" style={inputStyle} />
                </Field>

                <Field label="Categoria">
                  <input value={labOrderForm.category} onChange={(e) => setLabOrderForm((p) => ({ ...p, category: e.target.value }))} placeholder="Ex.: Hematologia" style={inputStyle} />
                </Field>
              </div>

              <Field label="Notas">
                <textarea value={labOrderForm.notes} onChange={(e) => setLabOrderForm((p) => ({ ...p, notes: e.target.value }))} placeholder="Ex.: Urgente" style={textareaStyle} />
              </Field>

              {labOrderMessage ? <p style={{ color: labOrderMessage.includes('sucesso') ? 'green' : 'crimson', margin: 0 }}>{labOrderMessage}</p> : null}

              <div>
                <button
                  type="submit"
                  style={buttonStyle}
                  disabled={savingLabOrder || isClinicalLocked || !canEditLabOrders(role)}
                >
                  {savingLabOrder
                    ? 'A guardar...'
                    : isCompleted
                    ? 'Consulta encerrada'
                    : !canEditLabOrders(role)
                    ? 'Sem permissão'
                    : 'Guardar exame'}
                </button>
              </div>
            </form>

            <div style={{ display: 'grid', gap: 12 }}>
              <div>
                <h4 style={{ marginBottom: 4 }}>Lista de exames</h4>
                <p style={muted}>Exames laboratoriais já registados nesta consulta.</p>
              </div>

              {labOrdersQuery.loading ? (
                <p style={muted}>A carregar exames...</p>
              ) : labOrders.length === 0 ? (
                <div style={emptyStateStyle}>Nenhum exame registado.</div>
              ) : (
                labOrders.map((item) => (
                  <CardItem key={item.id}>
                    <div style={cardHeaderStyle}>
                      <strong style={{ fontSize: 16 }}>{item.testName}</strong>
                      <span style={pillStyle}>{item.status}</span>
                    </div>
                    <div>Categoria: {item.category || '-'}</div>
                    <div><strong>Notas:</strong> {item.notes || '-'}</div>
                    <div style={smallMuted}>Criado em: {formatDate(item.createdAt)}</div>
                  </CardItem>
                ))
              )}
            </div>
          </section>
        )}

        {tab === 'billing' && (
          <section style={cardStyle}>
            <div>
              <h3 style={sectionTitleStyle}>Faturação</h3>
              <p style={{ ...muted, marginTop: 4 }}>
                Gestão de fatura e pagamentos, com suporte a RUP.
              </p>
            </div>

            {billingMessage ? (
              <p style={{ color: billingMessage.includes('sucesso') ? 'green' : 'crimson', margin: 0 }}>
                {billingMessage}
              </p>
            ) : null}

            {authReady && !canEditBilling(role) ? <ReadOnlyMessage /> : null}

            {!invoice ? (
              <section style={sectionStyle}>
                <h4 style={{ margin: 0 }}>Criar fatura</h4>
                <form onSubmit={submitInvoice} style={formGridStyle}>
                  <Field label="Descrição">
                    <input
                      value={invoiceForm.description}
                      onChange={(e) => setInvoiceForm((p) => ({ ...p, description: e.target.value }))}
                      style={inputStyle}
                    />
                  </Field>

                  <div style={grid2}>
                    <Field label="Valor total (AOA)">
                      <input
                        value={invoiceForm.totalAmount}
                        onChange={(e) => setInvoiceForm((p) => ({ ...p, totalAmount: e.target.value }))}
                        style={inputStyle}
                      />
                    </Field>

                    <Field label="Desconto (AOA)">
                      <input
                        value={invoiceForm.discountAmount}
                        onChange={(e) => setInvoiceForm((p) => ({ ...p, discountAmount: e.target.value }))}
                        style={inputStyle}
                      />
                    </Field>
                  </div>

                  <div>
                    <button type="submit" style={buttonStyle} disabled={savingInvoice || !canEditBilling(role)}>
                      {savingInvoice ? 'A guardar...' : !canEditBilling(role) ? 'Sem permissão' : 'Emitir fatura'}
                    </button>
                  </div>
                </form>
              </section>
            ) : (
              <>
                <section style={sectionStyle}>
                  <h4 style={{ margin: 0 }}>Fatura emitida</h4>
                  <div style={summaryGridStyle}>
                    <Info label="Número" value={invoice.invoiceNumber} />
                    <Info label="Estado" value={invoice.status} />
                    <Info label="Total" value={currency(invoice.totalAmount)} />
                    <Info label="Saldo" value={currency(invoice.balance)} />
                    <Info label="Pago" value={currency(invoice.paidAmount)} />
                    <Info label="Desconto" value={currency(invoice.discountAmount)} />
                    <Info label="Emitida em" value={formatDate(invoice.issuedAt)} />
                    <Info label="Descrição" value={invoice.description || '-'} />
                  </div>
                </section>

                <section style={sectionStyle}>
                  <h4 style={{ margin: 0 }}>Registar pagamento</h4>

                  <form onSubmit={submitPayment} style={formGridStyle}>
                    <div style={grid2}>
                      <Field label="Método de pagamento">
                        <select
                          value={paymentForm.paymentMethodId}
                          onChange={(e) =>
                            setPaymentForm((p) => ({ ...p, paymentMethodId: e.target.value }))
                          }
                          style={inputStyle}
                        >
                          <option value="">Selecione</option>
                          {paymentMethods.map((method) => (
                            <option key={method.id} value={method.id}>
                              {method.name} ({method.type})
                            </option>
                          ))}
                        </select>
                      </Field>

                      <Field label="Valor">
                        <input
                          value={paymentForm.amount}
                          onChange={(e) =>
                            setPaymentForm((p) => ({ ...p, amount: e.target.value }))
                          }
                          placeholder="Ex.: 15000"
                          style={inputStyle}
                        />
                      </Field>
                    </div>

                    {selectedPaymentMethod?.type === 'RUP' ? (
                      <div style={{ ...sectionStyle, background: '#f8fafc' }}>
                        <h5 style={{ margin: 0 }}>Dados RUP</h5>
                        <div style={grid2}>
                          <Field label="Entidade">
                            <input
                              value={paymentForm.entity}
                              onChange={(e) =>
                                setPaymentForm((p) => ({ ...p, entity: e.target.value }))
                              }
                              placeholder="Ex.: 12345"
                              style={inputStyle}
                            />
                          </Field>

                          <Field label="Referência">
                            <input
                              value={paymentForm.reference}
                              onChange={(e) =>
                                setPaymentForm((p) => ({ ...p, reference: e.target.value }))
                              }
                              placeholder="Ex.: 987654321"
                              style={inputStyle}
                            />
                          </Field>

                          <Field label="Validade">
                            <input
                              type="datetime-local"
                              value={paymentForm.expiresAt}
                              onChange={(e) =>
                                setPaymentForm((p) => ({ ...p, expiresAt: e.target.value }))
                              }
                              style={inputStyle}
                            />
                          </Field>
                        </div>
                      </div>
                    ) : (
                      <div style={grid2}>
                        <Field label="Referência da transação">
                          <input
                            value={paymentForm.transactionReference}
                            onChange={(e) =>
                              setPaymentForm((p) => ({
                                ...p,
                                transactionReference: e.target.value,
                              }))
                            }
                            style={inputStyle}
                          />
                        </Field>

                        <Field label="ID externo">
                          <input
                            value={paymentForm.externalTransactionId}
                            onChange={(e) =>
                              setPaymentForm((p) => ({
                                ...p,
                                externalTransactionId: e.target.value,
                              }))
                            }
                            style={inputStyle}
                          />
                        </Field>
                      </div>
                    )}

                    <div>
                      <button type="submit" style={buttonStyle} disabled={savingPayment || !canEditBilling(role)}>
                        {savingPayment ? 'A guardar...' : !canEditBilling(role) ? 'Sem permissão' : 'Registar pagamento'}
                      </button>
                    </div>
                  </form>
                </section>

                <section style={sectionStyle}>
                  <h4 style={{ margin: 0 }}>Pagamentos</h4>

                  {paymentsQuery.loading ? (
                    <p style={muted}>A carregar pagamentos...</p>
                  ) : payments.length === 0 ? (
                    <div style={emptyStateStyle}>Nenhum pagamento registado.</div>
                  ) : (
                    <div style={{ display: 'grid', gap: 12 }}>
                      {payments.map((payment) => (
                        <CardItem key={payment.id}>
                          <div style={cardHeaderStyle}>
                            <strong>
                              {payment.paymentMethod?.name || 'Método'} • {currency(payment.amount)}
                            </strong>
                            <span style={pillStyle}>{payment.status}</span>
                          </div>

                          <div>Referência: {payment.reference || '-'}</div>
                          <div>Validade: {formatDate(payment.expiresAt)}</div>
                          <div>Pago em: {formatDate(payment.paidAt)}</div>

                          {payment.metadata ? (
                            <div>
                              <strong>Metadata:</strong>{' '}
                              <code style={{ fontSize: 12 }}>
                                {JSON.stringify(payment.metadata)}
                              </code>
                            </div>
                          ) : null}

                          {payment.status !== 'PAID' ? (
                            <div>
                              <button
                                type="button"
                                style={secondaryButtonStyle}
                                onClick={() => markPaymentAsPaid(payment.id)}
                                disabled={!canEditBilling(role)}
                              >
                                Confirmar como pago
                              </button>
                            </div>
                          ) : null}
                        </CardItem>
                      ))}
                    </div>
                  )}
                </section>

                {rupMethod ? (
                  <section style={{ ...sectionStyle, background: '#f8fafc' }}>
                    <h4 style={{ margin: 0 }}>Suporte a RUP</h4>
                    <p style={muted}>
                      O sistema está preparado para pagamentos por RUP, incluindo
                      referência, entidade, validade e metadata para futura integração
                      com API externa.
                    </p>
                    <Info label="Método RUP disponível" value={`${rupMethod.name} (${rupMethod.type})`} />
                  </section>
                ) : null}
              </>
            )}
          </section>
        )}
      </div>
    </div>
  );
}

function LockedMessage() {
  return (
    <div
      style={{
        padding: 12,
        borderRadius: 10,
        background: '#fef3c7',
        color: '#92400e',
        border: '1px solid #fcd34d',
      }}
    >
      Esta consulta está concluída. Os registos clínicos estão bloqueados para edição.
    </div>
  );
}

function ConsultationLockedMessage({ status }: { status?: string }) {
  let message = 'Esta consulta está bloqueada para edição.';

  if (status === 'COMPLETED') {
    message = 'Esta consulta foi concluída. Os registos clínicos estão bloqueados para edição.';
  }

  if (status === 'NO_SHOW') {
    message = 'Esta consulta foi marcada como falta. Não é permitido registar triagem, atendimento, prescrições ou exames.';
  }

  if (status === 'CANCELLED') {
    message = 'Esta consulta foi cancelada. Não é permitido registar dados clínicos.';
  }

  return (
    <div
      style={{
        padding: 12,
        borderRadius: 10,
        background: '#fef3c7',
        color: '#92400e',
        border: '1px solid #fcd34d',
      }}
    >
      {message}
    </div>
  );
}

function ReadOnlyMessage() {
  return (
    <div
      style={{
        padding: 12,
        borderRadius: 10,
        background: '#eff6ff',
        color: '#1d4ed8',
        border: '1px solid #bfdbfe',
      }}
    >
      Está em modo de leitura. Não tem permissão para editar esta secção.
    </div>
  );
}

function Info({ label, value }: { label: string; value: string }) {
  return (
    <div style={infoCardStyle}>
      <div style={{ fontSize: 12, color: '#64748b' }}>{label}</div>
      <div style={{ fontWeight: 600 }}>{value}</div>
    </div>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <label style={{ display: 'grid', gap: 6 }}>
      <span style={{ fontSize: 14, fontWeight: 600 }}>{label}</span>
      {children}
    </label>
  );
}

function TabButton({
  active,
  onClick,
  children,
}: {
  active: boolean;
  onClick: () => void;
  children: React.ReactNode;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      style={{
        padding: '10px 14px',
        borderRadius: 10,
        border: '1px solid #cbd5e1',
        background: active ? '#0f172a' : 'white',
        color: active ? 'white' : '#0f172a',
        cursor: 'pointer',
        fontWeight: 600,
      }}
    >
      {children}
    </button>
  );
}

function CardItem({ children }: { children: React.ReactNode }) {
  return (
    <div
      style={{
        border: '1px solid #e2e8f0',
        borderRadius: 12,
        padding: 14,
        display: 'grid',
        gap: 8,
        background: '#f8fafc',
      }}
    >
      {children}
    </div>
  );
}

const pageStyle: React.CSSProperties = {
  padding: 24,
};

const containerStyle: React.CSSProperties = {
  maxWidth: 1280,
  margin: '0 auto',
  display: 'grid',
  gap: 20,
};

const headerStyle: React.CSSProperties = {
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
  gap: 16,
  flexWrap: 'wrap',
};

const subtitleStyle: React.CSSProperties = {
  margin: '6px 0 0',
  color: '#64748b',
};

const topNavLinkStyle: React.CSSProperties = {
  color: '#0f172a',
  textDecoration: 'none',
  fontWeight: 600,
};

const successBadgeStyle: React.CSSProperties = {
  background: '#dcfce7',
  color: '#166534',
  padding: '8px 12px',
  borderRadius: 999,
  fontWeight: 600,
};

const successButtonStyle: React.CSSProperties = {
  padding: '10px 14px',
  borderRadius: 10,
  border: 0,
  background: '#166534',
  color: 'white',
  cursor: 'pointer',
};

const cardHeaderStyle: React.CSSProperties = {
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'start',
  gap: 12,
  flexWrap: 'wrap',
};

const sectionStyle: React.CSSProperties = {
  border: '1px solid #e2e8f0',
  borderRadius: 12,
  padding: 16,
  display: 'grid',
  gap: 12,
};

const pillStyle: React.CSSProperties = {
  fontSize: 12,
  background: '#e2e8f0',
  padding: '6px 10px',
  borderRadius: 999,
  fontWeight: 600,
};

const smallMuted: React.CSSProperties = {
  fontSize: 12,
  color: '#64748b',
};

const emptyStateStyle: React.CSSProperties = {
  border: '1px dashed #cbd5e1',
  borderRadius: 10,
  padding: 16,
  color: '#64748b',
  background: '#f8fafc',
};

const cardStyle: React.CSSProperties = {
  background: 'white',
  border: '1px solid #e2e8f0',
  padding: 20,
  borderRadius: 16,
  display: 'grid',
  gap: 16,
  boxShadow: '0 2px 12px rgba(15, 23, 42, 0.04)',
};

const infoCardStyle: React.CSSProperties = {
  border: '1px solid #e2e8f0',
  borderRadius: 12,
  padding: 14,
  background: '#f8fafc',
};

const inputStyle: React.CSSProperties = {
  width: '100%',
  padding: 12,
  borderRadius: 10,
  border: '1px solid #cbd5e1',
};

const textareaStyle: React.CSSProperties = {
  width: '100%',
  minHeight: 100,
  padding: 12,
  borderRadius: 10,
  border: '1px solid #cbd5e1',
};

const buttonStyle: React.CSSProperties = {
  padding: '12px 16px',
  borderRadius: 10,
  border: 0,
  background: '#0f172a',
  color: 'white',
  cursor: 'pointer',
};

const secondaryButtonStyle: React.CSSProperties = {
  padding: '10px 14px',
  borderRadius: 10,
  border: '1px solid #cbd5e1',
  background: 'white',
  color: '#0f172a',
  cursor: 'pointer',
};

const grid2: React.CSSProperties = {
  display: 'grid',
  gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
  gap: 12,
};

const summaryGridStyle: React.CSSProperties = {
  display: 'grid',
  gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
  gap: 16,
};

const overviewInfoGridStyle: React.CSSProperties = {
  display: 'grid',
  gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
  gap: 12,
};

const twoColumnGridStyle: React.CSSProperties = {
  display: 'grid',
  gridTemplateColumns: 'repeat(auto-fit, minmax(420px, 1fr))',
  gap: 20,
};

const tabsWrapStyle: React.CSSProperties = {
  display: 'flex',
  gap: 12,
  flexWrap: 'wrap',
};

const formGridStyle: React.CSSProperties = {
  display: 'grid',
  gap: 16,
};

const sectionTitleStyle: React.CSSProperties = {
  margin: 0,
};

const muted: React.CSSProperties = {
  color: '#64748b',
  margin: 0,
};