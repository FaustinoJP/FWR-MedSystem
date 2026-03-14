'use client';

import Link from 'next/link';
import { useParams } from 'next/navigation';
import { useState } from 'react';
import { useAppointmentDetails } from '@/hooks/use-appointment-details';
import { useTriage } from '@/hooks/use-triage';
import { useEncounter } from '@/hooks/use-encounter';
import { usePrescriptions } from '@/hooks/use-prescriptions';
import { useLabOrders } from '@/hooks/use-lab-orders';

function formatDate(value?: string) {
  if (!value) return '-';
  return new Date(value).toLocaleString('pt-PT');
}

export default function AppointmentDetailsPage() {
  const params = useParams<{ id: string }>();
  const appointmentId = String(params.id);

  const appointmentQuery = useAppointmentDetails(appointmentId);
  const triageQuery = useTriage(appointmentId);
  const encounterQuery = useEncounter(appointmentId);
  const prescriptionsQuery = usePrescriptions(appointmentId);
  const labOrdersQuery = useLabOrders(appointmentId);

  const appointment = appointmentQuery.data;
  const triage = triageQuery.data;
  const encounter = encounterQuery.data;
  const prescriptions = prescriptionsQuery.data;
  const labOrders = labOrdersQuery.data;

  const [tab, setTab] = useState<
    'overview' | 'triage' | 'encounter' | 'prescriptions' | 'lab-orders'
  >('overview');

  const [savingTriage, setSavingTriage] = useState(false);
  const [savingEncounter, setSavingEncounter] = useState(false);
  const [savingPrescription, setSavingPrescription] = useState(false);
  const [savingLabOrder, setSavingLabOrder] = useState(false);

  const [triageMessage, setTriageMessage] = useState('');
  const [encounterMessage, setEncounterMessage] = useState('');
  const [prescriptionMessage, setPrescriptionMessage] = useState('');
  const [labOrderMessage, setLabOrderMessage] = useState('');

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
                <Info
                  label="Temperatura"
                  value={triage.temperature ? `${triage.temperature} °C` : '-'}
                />
                <Info label="Pressão arterial" value={triage.bloodPressure || '-'} />
                <Info
                  label="Frequência cardíaca"
                  value={triage.heartRate ? `${triage.heartRate} bpm` : '-'}
                />
                <Info
                  label="Frequência respiratória"
                  value={triage.respiratoryRate ? String(triage.respiratoryRate) : '-'}
                />
                <Info
                  label="Saturação"
                  value={triage.oxygenSaturation ? `${triage.oxygenSaturation}%` : '-'}
                />
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
                <Info
                  label="História clínica"
                  value={encounter.historyOfPresentIllness || '-'}
                />
                <Info label="Exame físico" value={encounter.physicalExam || '-'} />
                <Info label="Avaliação" value={encounter.assessment || '-'} />
                <Info label="Plano" value={encounter.plan || '-'} />
              </div>
            )}
          </section>

          <section style={{ ...cardStyle, gridColumn: '1 / -1' }}>
            <h3>Prescrições</h3>
            {prescriptionsQuery.loading ? (
              <p style={muted}>A carregar prescrições...</p>
            ) : prescriptions.length === 0 ? (
              <p style={muted}>Nenhuma prescrição registada.</p>
            ) : (
              <div style={{ display: 'grid', gap: 12 }}>
                {prescriptions.map((item) => (
                  <div
                    key={item.id}
                    style={{
                      border: '1px solid #e2e8f0',
                      borderRadius: 10,
                      padding: 12,
                      display: 'grid',
                      gap: 6,
                    }}
                  >
                    <strong>{item.medicationName}</strong>
                    <div>
                      {item.dosage} • {item.frequency} • {item.duration}
                    </div>
                    <div>Instruções: {item.instructions || '-'}</div>
                    <div style={{ fontSize: 12, color: '#64748b' }}>
                      Criado em: {formatDate(item.createdAt)}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </section>

          <section style={{ ...cardStyle, gridColumn: '1 / -1' }}>
            <h3>Exames laboratoriais</h3>
            {labOrdersQuery.loading ? (
              <p style={muted}>A carregar exames...</p>
            ) : labOrders.length === 0 ? (
              <p style={muted}>Nenhum exame registado.</p>
            ) : (
              <div style={{ display: 'grid', gap: 12 }}>
                {labOrders.map((item) => (
                  <div
                    key={item.id}
                    style={{
                      border: '1px solid #e2e8f0',
                      borderRadius: 10,
                      padding: 12,
                      display: 'grid',
                      gap: 6,
                    }}
                  >
                    <strong>{item.testName}</strong>
                    <div>Categoria: {item.category || '-'}</div>
                    <div>Estado: {item.status}</div>
                    <div>Notas: {item.notes || '-'}</div>
                    <div style={{ fontSize: 12, color: '#64748b' }}>
                      Criado em: {formatDate(item.createdAt)}
                    </div>
                  </div>
                ))}
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
                <input
                  value={triageForm.weight}
                  onChange={(e) => setTriageForm((p) => ({ ...p, weight: e.target.value }))}
                  style={inputStyle}
                />
              </Field>
              <Field label="Altura (cm)">
                <input
                  value={triageForm.height}
                  onChange={(e) => setTriageForm((p) => ({ ...p, height: e.target.value }))}
                  style={inputStyle}
                />
              </Field>
              <Field label="Temperatura">
                <input
                  value={triageForm.temperature}
                  onChange={(e) =>
                    setTriageForm((p) => ({ ...p, temperature: e.target.value }))
                  }
                  style={inputStyle}
                />
              </Field>
              <Field label="Pressão arterial">
                <input
                  value={triageForm.bloodPressure}
                  onChange={(e) =>
                    setTriageForm((p) => ({ ...p, bloodPressure: e.target.value }))
                  }
                  style={inputStyle}
                />
              </Field>
              <Field label="Frequência cardíaca">
                <input
                  value={triageForm.heartRate}
                  onChange={(e) => setTriageForm((p) => ({ ...p, heartRate: e.target.value }))}
                  style={inputStyle}
                />
              </Field>
              <Field label="Frequência respiratória">
                <input
                  value={triageForm.respiratoryRate}
                  onChange={(e) =>
                    setTriageForm((p) => ({ ...p, respiratoryRate: e.target.value }))
                  }
                  style={inputStyle}
                />
              </Field>
              <Field label="Saturação O2">
                <input
                  value={triageForm.oxygenSaturation}
                  onChange={(e) =>
                    setTriageForm((p) => ({ ...p, oxygenSaturation: e.target.value }))
                  }
                  style={inputStyle}
                />
              </Field>
            </div>

            <Field label="Notas">
              <textarea
                value={triageForm.notes}
                onChange={(e) => setTriageForm((p) => ({ ...p, notes: e.target.value }))}
                style={textareaStyle}
              />
            </Field>

            {triageMessage ? (
              <p style={{ color: triageMessage.includes('sucesso') ? 'green' : 'crimson' }}>
                {triageMessage}
              </p>
            ) : null}

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
              <textarea
                value={encounterForm.chiefComplaint}
                onChange={(e) =>
                  setEncounterForm((p) => ({ ...p, chiefComplaint: e.target.value }))
                }
                style={textareaStyle}
              />
            </Field>

            <Field label="História da doença atual">
              <textarea
                value={encounterForm.historyOfPresentIllness}
                onChange={(e) =>
                  setEncounterForm((p) => ({
                    ...p,
                    historyOfPresentIllness: e.target.value,
                  }))
                }
                style={textareaStyle}
              />
            </Field>

            <Field label="Exame físico">
              <textarea
                value={encounterForm.physicalExam}
                onChange={(e) =>
                  setEncounterForm((p) => ({ ...p, physicalExam: e.target.value }))
                }
                style={textareaStyle}
              />
            </Field>

            <Field label="Avaliação">
              <textarea
                value={encounterForm.assessment}
                onChange={(e) =>
                  setEncounterForm((p) => ({ ...p, assessment: e.target.value }))
                }
                style={textareaStyle}
              />
            </Field>

            <Field label="Plano terapêutico">
              <textarea
                value={encounterForm.plan}
                onChange={(e) => setEncounterForm((p) => ({ ...p, plan: e.target.value }))}
                style={textareaStyle}
              />
            </Field>

            {encounterMessage ? (
              <p style={{ color: encounterMessage.includes('sucesso') ? 'green' : 'crimson' }}>
                {encounterMessage}
              </p>
            ) : null}

            <button type="submit" style={buttonStyle} disabled={savingEncounter}>
              {savingEncounter ? 'A guardar...' : encounter ? 'Atualizar atendimento' : 'Guardar atendimento'}
            </button>
          </form>
        </section>
      )}

      {tab === 'prescriptions' && (
        <section style={cardStyle}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div>
              <h3 style={{ margin: 0 }}>Prescrições</h3>
              <p style={{ ...muted, marginTop: 4 }}>
                Registe os medicamentos prescritos para esta consulta.
              </p>
            </div>
          </div>

          <form onSubmit={submitPrescription} style={{ display: 'grid', gap: 16 }}>
            <div style={grid2}>
              <Field label="Medicamento">
                <input
                  value={prescriptionForm.medicationName}
                  onChange={(e) =>
                    setPrescriptionForm((p) => ({ ...p, medicationName: e.target.value }))
                  }
                  placeholder="Ex.: Paracetamol 500mg"
                  style={inputStyle}
                />
              </Field>

              <Field label="Dose">
                <input
                  value={prescriptionForm.dosage}
                  onChange={(e) =>
                    setPrescriptionForm((p) => ({ ...p, dosage: e.target.value }))
                  }
                  placeholder="Ex.: 1 comprimido"
                  style={inputStyle}
                />
              </Field>

              <Field label="Frequência">
                <input
                  value={prescriptionForm.frequency}
                  onChange={(e) =>
                    setPrescriptionForm((p) => ({ ...p, frequency: e.target.value }))
                  }
                  placeholder="Ex.: 8/8h"
                  style={inputStyle}
                />
              </Field>

              <Field label="Duração">
                <input
                  value={prescriptionForm.duration}
                  onChange={(e) =>
                    setPrescriptionForm((p) => ({ ...p, duration: e.target.value }))
                  }
                  placeholder="Ex.: 5 dias"
                  style={inputStyle}
                />
              </Field>
            </div>

            <Field label="Instruções">
              <textarea
                value={prescriptionForm.instructions}
                onChange={(e) =>
                  setPrescriptionForm((p) => ({ ...p, instructions: e.target.value }))
                }
                placeholder="Ex.: Tomar após as refeições"
                style={textareaStyle}
              />
            </Field>

            {prescriptionMessage ? (
              <p
                style={{
                  color: prescriptionMessage.includes('sucesso') ? 'green' : 'crimson',
                  margin: 0,
                }}
              >
                {prescriptionMessage}
              </p>
            ) : null}

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
              <div
                style={{
                  border: '1px dashed #cbd5e1',
                  borderRadius: 10,
                  padding: 16,
                  color: '#64748b',
                  background: '#f8fafc',
                }}
              >
                Nenhuma prescrição registada.
              </div>
            ) : (
              prescriptions.map((item) => (
                <div
                  key={item.id}
                  style={{
                    border: '1px solid #e2e8f0',
                    borderRadius: 12,
                    padding: 14,
                    display: 'grid',
                    gap: 8,
                    background: '#f8fafc',
                  }}
                >
                  <div
                    style={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'start',
                    }}
                  >
                    <strong style={{ fontSize: 16 }}>{item.medicationName}</strong>
                    <span
                      style={{
                        fontSize: 12,
                        background: '#e2e8f0',
                        padding: '4px 8px',
                        borderRadius: 999,
                      }}
                    >
                      {formatDate(item.createdAt)}
                    </span>
                  </div>

                  <div style={{ color: '#0f172a' }}>
                    {item.dosage} • {item.frequency} • {item.duration}
                  </div>

                  <div style={{ color: '#475569' }}>
                    <strong>Instruções:</strong> {item.instructions || '-'}
                  </div>
                </div>
              ))
            )}
          </div>
        </section>
      )}

      {tab === 'lab-orders' && (
        <section style={cardStyle}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div>
              <h3 style={{ margin: 0 }}>Exames laboratoriais</h3>
              <p style={{ ...muted, marginTop: 4 }}>
                Registe os exames solicitados nesta consulta.
              </p>
            </div>
          </div>

          <form onSubmit={submitLabOrder} style={{ display: 'grid', gap: 16 }}>
            <div style={grid2}>
              <Field label="Exame">
                <input
                  value={labOrderForm.testName}
                  onChange={(e) =>
                    setLabOrderForm((p) => ({ ...p, testName: e.target.value }))
                  }
                  placeholder="Ex.: Hemograma Completo"
                  style={inputStyle}
                />
              </Field>

              <Field label="Categoria">
                <input
                  value={labOrderForm.category}
                  onChange={(e) =>
                    setLabOrderForm((p) => ({ ...p, category: e.target.value }))
                  }
                  placeholder="Ex.: Hematologia"
                  style={inputStyle}
                />
              </Field>
            </div>

            <Field label="Notas">
              <textarea
                value={labOrderForm.notes}
                onChange={(e) =>
                  setLabOrderForm((p) => ({ ...p, notes: e.target.value }))
                }
                placeholder="Ex.: Urgente"
                style={textareaStyle}
              />
            </Field>

            {labOrderMessage ? (
              <p
                style={{
                  color: labOrderMessage.includes('sucesso') ? 'green' : 'crimson',
                  margin: 0,
                }}
              >
                {labOrderMessage}
              </p>
            ) : null}

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
              <div
                style={{
                  border: '1px dashed #cbd5e1',
                  borderRadius: 10,
                  padding: 16,
                  color: '#64748b',
                  background: '#f8fafc',
                }}
              >
                Nenhum exame registado.
              </div>
            ) : (
              labOrders.map((item) => (
                <div
                  key={item.id}
                  style={{
                    border: '1px solid #e2e8f0',
                    borderRadius: 12,
                    padding: 14,
                    display: 'grid',
                    gap: 8,
                    background: '#f8fafc',
                  }}
                >
                  <div
                    style={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'start',
                    }}
                  >
                    <strong style={{ fontSize: 16 }}>{item.testName}</strong>
                    <span
                      style={{
                        fontSize: 12,
                        background: '#e2e8f0',
                        padding: '4px 8px',
                        borderRadius: 999,
                      }}
                    >
                      {item.status}
                    </span>
                  </div>

                  <div style={{ color: '#0f172a' }}>
                    Categoria: {item.category || '-'}
                  </div>

                  <div style={{ color: '#475569' }}>
                    <strong>Notas:</strong> {item.notes || '-'}
                  </div>

                  <div style={{ fontSize: 12, color: '#64748b' }}>
                    Criado em: {formatDate(item.createdAt)}
                  </div>
                </div>
              ))
            )}
          </div>
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

const grid2: React.CSSProperties = {
  display: 'grid',
  gridTemplateColumns: '1fr 1fr',
  gap: 12,
};

const muted: React.CSSProperties = {
  color: '#64748b',
  margin: 0,
};