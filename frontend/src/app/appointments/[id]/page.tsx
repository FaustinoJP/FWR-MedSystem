'use client';

import Link from 'next/link';
import { useParams } from 'next/navigation';
import { useMemo, useState } from 'react';
import { useAppointmentDetails } from '@/hooks/use-appointment-details';
import { useTriage } from '@/hooks/use-triage';
import { useEncounter } from '@/hooks/use-encounter';
import { usePrescriptions } from '@/hooks/use-prescriptions';
import { useLabOrders } from '@/hooks/use-lab-orders';
import { useInvoice } from '@/hooks/use-invoice';
import { usePayments } from '@/hooks/use-payments';
import { usePaymentMethods } from '@/hooks/use-payment-methods';

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

  const appointment = appointmentQuery.data;
  const triage = triageQuery.data;
  const encounter = encounterQuery.data;
  const prescriptions = prescriptionsQuery.data;
  const labOrders = labOrdersQuery.data;
  const invoice = invoiceQuery.data;
  const payments = paymentsQuery.data;
  const paymentMethods = paymentMethodsQuery.data;

  const rupMethod = useMemo(
    () => paymentMethods.find((m) => m.type === 'RUP'),
    [paymentMethods],
  );

  const [tab, setTab] = useState<
    'overview' | 'triage' | 'encounter' | 'prescriptions' | 'lab-orders' | 'billing'
  >('overview');

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
    return <div style={{ padding: 24 }}>A carregar consulta...</div>;
  }

  if (appointmentQuery.error || !appointment) {
    return (
      <div style={{ padding: 24, color: 'crimson' }}>
        {appointmentQuery.error || 'Consulta não encontrada'}
      </div>
    );
  }

  return (
    <div style={{ padding: 24, display: 'grid', gap: 20 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <Link href="/appointments">← Voltar às consultas</Link>
          <h1 style={{ margin: '12px 0 4px' }}>Detalhe da consulta</h1>
          <p style={{ margin: 0, color: '#475569' }}>
            {appointment.patient.firstName} {appointment.patient.lastName} •{' '}
            {appointment.department.name}
          </p>
        </div>
        <div style={{ background: '#e2e8f0', padding: '8px 12px', borderRadius: 999 }}>
          {appointment.status}
        </div>
      </div>

      <div
        style={{
          background: 'white',
          padding: 16,
          borderRadius: 12,
          display: 'grid',
          gridTemplateColumns: 'repeat(4, 1fr)',
          gap: 12,
        }}
      >
        <Info
          label="Paciente"
          value={`${appointment.patient.firstName} ${appointment.patient.lastName}`}
        />
        <Info label="Código" value={appointment.patient.patientCode} />
        <Info label="Médico" value={appointment.doctor.name} />
        <Info label="Data" value={formatDate(appointment.appointmentDate)} />
      </div>

      <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}>
        <TabButton active={tab === 'overview'} onClick={() => setTab('overview')}>
          Resumo
        </TabButton>
        <TabButton active={tab === 'triage'} onClick={() => setTab('triage')}>
          Triagem
        </TabButton>
        <TabButton active={tab === 'encounter'} onClick={() => setTab('encounter')}>
          Atendimento
        </TabButton>
        <TabButton active={tab === 'prescriptions'} onClick={() => setTab('prescriptions')}>
          Prescrições
        </TabButton>
        <TabButton active={tab === 'lab-orders'} onClick={() => setTab('lab-orders')}>
          Exames
        </TabButton>
        <TabButton active={tab === 'billing'} onClick={() => setTab('billing')}>
          Faturação
        </TabButton>
      </div>

      {tab === 'overview' && (
        <div style={{ display: 'grid', gap: 20, gridTemplateColumns: '1fr 1fr' }}>
          <section style={cardStyle}>
            <h3>Triagem</h3>
            {!triage ? (
              <p style={muted}>Nenhuma triagem registada.</p>
            ) : (
              <div style={{ display: 'grid', gap: 8 }}>
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
            <h3>Atendimento clínico</h3>
            {!encounter ? (
              <p style={muted}>Nenhum atendimento clínico registado.</p>
            ) : (
              <div style={{ display: 'grid', gap: 8 }}>
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
          <h3>{triage ? 'Atualizar triagem' : 'Criar triagem'}</h3>
          <form onSubmit={submitTriage} style={{ display: 'grid', gap: 12 }}>
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

            <button type="submit" style={buttonStyle} disabled={savingTriage}>
              {savingTriage ? 'A guardar...' : triage ? 'Atualizar triagem' : 'Guardar triagem'}
            </button>
          </form>
        </section>
      )}

      {tab === 'encounter' && (
        <section style={cardStyle}>
          <h3>{encounter ? 'Atualizar atendimento clínico' : 'Criar atendimento clínico'}</h3>
          <form onSubmit={submitEncounter} style={{ display: 'grid', gap: 12 }}>
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

            <button type="submit" style={buttonStyle} disabled={savingEncounter}>
              {savingEncounter ? 'A guardar...' : encounter ? 'Atualizar atendimento' : 'Guardar atendimento'}
            </button>
          </form>
        </section>
      )}

      {tab === 'prescriptions' && (
        <section style={cardStyle}>
          <div>
            <h3 style={{ margin: 0 }}>Prescrições</h3>
            <p style={{ ...muted, marginTop: 4 }}>Registe os medicamentos prescritos para esta consulta.</p>
          </div>

          <form onSubmit={submitPrescription} style={{ display: 'grid', gap: 16 }}>
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
              <button type="submit" style={buttonStyle} disabled={savingPrescription}>
                {savingPrescription ? 'A guardar...' : 'Guardar prescrição'}
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
            <h3 style={{ margin: 0 }}>Exames laboratoriais</h3>
            <p style={{ ...muted, marginTop: 4 }}>Registe os exames solicitados nesta consulta.</p>
          </div>

          <form onSubmit={submitLabOrder} style={{ display: 'grid', gap: 16 }}>
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
              <button type="submit" style={buttonStyle} disabled={savingLabOrder}>
                {savingLabOrder ? 'A guardar...' : 'Guardar exame'}
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
            <h3 style={{ margin: 0 }}>Faturação</h3>
            <p style={{ ...muted, marginTop: 4 }}>
              Gestão de fatura e pagamentos, com suporte a RUP.
            </p>
          </div>

          {billingMessage ? (
            <p style={{ color: billingMessage.includes('sucesso') ? 'green' : 'crimson', margin: 0 }}>
              {billingMessage}
            </p>
          ) : null}

          {!invoice ? (
            <section style={sectionStyle}>
              <h4 style={{ margin: 0 }}>Criar fatura</h4>
              <form onSubmit={submitInvoice} style={{ display: 'grid', gap: 16 }}>
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
                  <button type="submit" style={buttonStyle} disabled={savingInvoice}>
                    {savingInvoice ? 'A guardar...' : 'Emitir fatura'}
                  </button>
                </div>
              </form>
            </section>
          ) : (
            <>
              <section style={sectionStyle}>
                <h4 style={{ margin: 0 }}>Fatura emitida</h4>
                <div style={{ display: 'grid', gap: 12, gridTemplateColumns: 'repeat(4, 1fr)' }}>
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

                <form onSubmit={submitPayment} style={{ display: 'grid', gap: 16 }}>
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
                    <button type="submit" style={buttonStyle} disabled={savingPayment}>
                      {savingPayment ? 'A guardar...' : 'Registar pagamento'}
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
  );
}

function Info({ label, value }: { label: string; value: string }) {
  return (
    <div>
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

const cardHeaderStyle: React.CSSProperties = {
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'start',
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
  padding: '4px 8px',
  borderRadius: 999,
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
  padding: 16,
  borderRadius: 12,
  display: 'grid',
  gap: 12,
};

const inputStyle: React.CSSProperties = {
  width: '100%',
  padding: 10,
  borderRadius: 8,
  border: '1px solid #cbd5e1',
};

const textareaStyle: React.CSSProperties = {
  width: '100%',
  minHeight: 90,
  padding: 10,
  borderRadius: 8,
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
  gridTemplateColumns: '1fr 1fr',
  gap: 12,
};

const muted: React.CSSProperties = {
  color: '#64748b',
  margin: 0,
};