# Faustware MedSystem

Estrutura inicial do projecto até aqui, preparada para:
- backend NestJS + Prisma + PostgreSQL
- frontend Next.js + TypeScript
- Docker para PostgreSQL
- seed inicial
- módulos base já organizados

## Arranque rápido
### Base de dados
```bash
docker compose up -d
```

### Backend
```bash
cd backend
npm install
cp .env.example .env
npx prisma generate
npx prisma migrate dev --name init
npm run seed
npm run start:dev
```

### Frontend
```bash
cd ../frontend
cp .env.local.example .env.local
npm install
npm run dev
```
Prisma schema loaded from prisma/schema.prisma
Datasource "db": PostgreSQL database "medsystem", schema "public" at "localhost:5432"