# RegistroFatura

Aplicacao full stack para cadastro, visualizacao e gerenciamento de faturas.

O projeto possui:

- `backend`: API em Express + MongoDB
- `frontend/fatura`: interface em React + Vite

## Funcionalidades

- cadastro de usuario
- login com token JWT
- criacao de faturas
- listagem de faturas por usuario autenticado
- edicao de faturas pela interface
- exclusao de faturas pela interface
- calculo de valor total e valor por parcela

## Tecnologias

- Frontend: React, React Router, Vite, ESLint
- Backend: Express, Mongoose, JWT, bcrypt
- Banco: MongoDB

## Estrutura

```text
RegistroFatura/
├── backend/
│   ├── app.js
│   ├── controllers/
│   ├── middleware/
│   ├── models/
│   └── routes/
└── frontend/
    └── fatura/
        ├── src/
        └── package.json
```

## Requisitos

- Node.js 18+
- npm
- MongoDB em execucao

## Variaveis de ambiente

Crie o arquivo `backend/.env` com:

```env
DB_URI=mongodb://127.0.0.1:27017/registro-fatura
PORT=3000
```

## Instalacao

### Backend

```bash
cd backend
npm install
```

### Frontend

```bash
cd frontend/fatura
npm install
```

## Como rodar

### 1. Inicie o backend

```bash
cd backend
npm start
```

O backend sobe na porta definida em `PORT`. Hoje o frontend esta apontando para `http://localhost:3000`.

### 2. Inicie o frontend

Em outro terminal:

```bash
cd frontend/fatura
npm run dev
```

Depois abra a URL exibida pelo Vite, normalmente `http://localhost:5173`.

## Fluxo de uso

1. Crie uma conta em `/cadastro`
2. Faça login na rota `/`
3. Acesse `/faturas`
4. Adicione uma fatura informando credor, valor e quantidade de meses
5. Clique em uma fatura da lista para editar ou excluir

## API

### Usuarios

- `POST /cadastro`: cria um usuario
- `POST /login`: autentica e retorna `token`

### Faturas

Todas exigem o header:

```http
Authorization: Bearer <token>
```

- `GET /index`: lista as faturas do usuario logado
- `POST /index`: cria uma fatura
- `PUT /index/:faturaId`: atualiza uma fatura
- `DELETE /index/:faturaId`: remove uma fatura

Exemplo de payload para criar ou atualizar:

```json
{
  "creditor": "Banco X",
  "amount": 1200.5,
  "months": 12
}
```

## Scripts

### Frontend

```bash
npm run dev
npm run build
npm run preview
npm run lint
```

### Backend

```bash
npm start
```

## Estado atual

- a interface reflete criacao, edicao e exclusao com persistencia no backend
- o backend salva `months` como numero
- o login salva o token no navegador e usa esse token nas rotas protegidas

## Observacoes

- o backend libera CORS para qualquer origem
- o segredo do JWT esta fixo no codigo atualmente
- se existirem documentos antigos no MongoDB com `month` em vez de `months`, o ideal e normalizar esses dados

## Licenca

Este projeto esta sob a licenca definida em [LICENSE](./LICENSE).
