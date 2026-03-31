# Faustware MedSystem - Roadmap Completo para Produção

**Objetivo final**: Plataforma modular de gestão hospitalar pronta para **clínicas, centros médicos, laboratórios e hospitais de média/grande dimensão**.

**Tecnologias**: NestJS + Prisma + PostgreSQL (Backend) | Next.js + TypeScript (Frontend) | Docker

---

## 1. Estado Atual (Março 2026)

### ✅ Concluído (Base sólida - MVP funcional)
- Autenticação completa (login, token, logout, sessão)
- Dashboard com cards e atalhos por perfil
- Gestão completa de Pacientes (CRUD + pesquisa + agendamento direto)
- Gestão de Consultas (agendamento, estados, NO_SHOW, encerramento)
- Agenda Médica (por data e médico)
- Gestão de Profissionais/Staff (CRUD + perfis + departamentos)
- Módulo Clínico Base:
  - Triagem (formulário, gravação, leitura por consulta)
  - Atendimento Clínico (Encounter)
  - Prescrições (criação e listagem por consulta)
  - Pedidos Laboratoriais (criação e listagem por consulta)
- Faturação e Pagamentos (fatura por consulta, métodos de pagamento, estados)
- Permissões parciais (frontend + início do RolesGuard no backend)
- UI/UX consistente (layout centralizado, bloqueio visual de estados)

### ⏳ Parcialmente Feito
- Permissões no backend (em progresso – ainda não 100% consolidado por módulo)

### ❌ Ainda em Falta (Prioridades para Produção)

---

## 2. Roadmap por Fases

### **Fase 1 – Consolidação & Segurança** (1-2 semanas)
**Objetivo**: Tornar o sistema estável e seguro para uso em ambiente real.

- [ ] Finalizar **Permissões no Backend** (RolesGuard + @Roles em todos os módulos)
  - Rececionista: só agenda, pacientes, faturação
  - Enfermeiro: triagem + atendimento (não prescreve, não encerra)
  - Médico: consultas, prescrições, pedidos laboratoriais
  - Laboratorista: apenas módulo laboratório
  - Faturação: só billing e pagamentos
  - Admin: tudo
- [ ] Validação completa de DTOs (class-validator) em todos os endpoints
- [ ] Tratamento consistente de erros + mensagens amigáveis no frontend
- [ ] Auditoria básica de ações (quem, quando, o quê)
- [ ] Revisão final do Prisma Schema (índices, constraints, relações)

**Entrega**: Sistema com controlo de acesso robusto e validações.

---

### **Fase 2 – Módulo de Laboratório Completo** (2-4 semanas) ← **Iniciamos agora**

**Objetivo**: Transformar os “pedidos laboratoriais” num módulo Laboratório profissional.

#### Estrutura Proposta (Backend)

**1. Models Prisma (adicionar ao schema.prisma)**

```prisma
model ExamType {
  id          String   @id @default(cuid())
  name        String   // Ex: Hemograma Completo, Glicemia, etc.
  code        String   @unique
  description String?
  price       Decimal
  department  String?  // Ex: Hematologia, Bioquímica
  isActive    Boolean  @default(true)
  createdAt   DateTime @default(now())
  updatedAt   DateTime @updatedAt

  examRequests ExamRequest[]
}

model ExamRequest {
  id            String   @id @default(cuid())
  consultationId String
  consultation  Consultation @relation(fields: [consultationId], references: [id])
  
  examTypeId    String
  examType      ExamType @relation(fields: [examTypeId], references: [id])
  
  status        ExamStatus @default(PENDING)
  priority      ExamPriority @default(NORMAL)
  
  requestedBy   String   // userId do médico
  requestedAt   DateTime @default(now())
  
  // Resultado
  result        Json?    // Resultados estruturados ou texto livre
  notes         String?
  validatedBy   String?  // userId do laboratorista
  validatedAt   DateTime?
  
  createdAt     DateTime @default(now())
  updatedAt     DateTime @updatedAt

  @@index([consultationId])
  @@index([examTypeId])
  @@index([status])
}

enum ExamStatus {
  PENDING
  IN_PROGRESS
  COMPLETED
  VALIDATED
  CANCELLED
}

enum ExamPriority {
  LOW
  NORMAL
  URGENT
}
