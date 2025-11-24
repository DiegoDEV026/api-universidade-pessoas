# API de Gerenciamento de Pessoas - Universidade / SeguraNet

## Desenvolvido por:
-Diego Rocha de Andrade

## Descrição
API para cadastro e consulta de pessoas de uma universidade.

## Como rodar (Spring Boot legado):
1. Crie um banco MySQL com o nome `nome_da_base`.
2. Atualize o `application.properties` com suas credenciais.
3. Rode o projeto com `mvn spring-boot:run` ou pelo IDE.

---

## Nova stack SeguraNet (Autenticação + Dashboard)
Foi adicionada uma stack completa com backend em Node/Express e frontend em Next.js para login, cadastro, dashboard protegido e gerenciamento de token.

### Backend (Node + Express + MySQL)
1. Entre em `backend` e crie um arquivo `.env` baseado em `.env.example`.
2. Instale dependências: `npm install`.
3. Execute: `npm run dev` (porta padrão 4000).
4. Endpoints principais:
   - `POST /auth/register` – cria usuário e já retorna token JWT.
   - `POST /auth/login` – autenticação e retorno de token.
   - `GET /auth/me` – valida token e retorna usuário.

### Frontend (Next.js)
1. Entre em `frontend` e instale dependências: `npm install`.
2. Defina `NEXT_PUBLIC_API_URL` se a API não estiver em `http://localhost:4000`.
3. Execute `npm run dev` e acesse `http://localhost:3000`.
4. Fluxo:
   - Login envia requisição real para `POST /auth/login` e salva token no `localStorage`.
   - Cadastro usa `POST /auth/register`, faz login automático e redireciona ao dashboard.
   - Dashboard verifica token ao carregar, redireciona para `/login` se faltar/for inválido e permite logout.

### Layout
Interface responsiva com sidebar, cards e botão de logout seguindo identidade SeguraNet.
