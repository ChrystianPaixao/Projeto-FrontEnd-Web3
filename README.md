📘 README — Projeto Web3 (Frontend)
🧾 Nome do Projeto

Projeto-FrontEnd-Web3 — Interface web da aplicação Web3 construída em Next.js. 
GitHub

🧠 Descrição

Este é o frontend do sistema Web3 que consome uma API RESTful (backend) para funcionalidades como autenticação, carrinho de compras, pedidos e integração com Web3 (blockchain).
O projeto é construído com Next.js e utiliza React e Bootstrap para a interface. 
GitHub

🚀 Tecnologias Utilizadas

✔ Next.js (React framework)
✔ React
✔ JavaScript
✔ Bootstrap / React-Bootstrap
✔ Web3 Integration (ex.: MetaMask – se houver)
✔ Axios para chamadas de API

🧩 Pré-Requisitos

Antes de começar, você precisa ter instalado em sua máquina:

✔ Node.js (versão >= 18.x)
✔ npm ou Yarn
✔ Backend rodando localmente ou acessível pela URL
✔ Variáveis de ambiente configuradas (se aplicável)

⬇️ Como Executar o Frontend
1. Faça o clone do repositório
git clone https://github.com/ChrystianPaixao/Projeto-FrontEnd-Web3.git

2. Entre na pasta
cd Projeto-FrontEnd-Web3

3. Instale as dependências
npm install
# ou
yarn

4. Defina variáveis de ambiente

Crie um arquivo .env.local na raiz com as variáveis necessárias (exemplo):

NEXT_PUBLIC_API_URL=http://localhost:3001
NEXT_PUBLIC_WEB3_PROVIDER_URL=<url_do_provider>


Ajuste conforme sua API e configuração de Web3.

5. Rode o servidor de desenvolvimento
npm run dev
# ou
yarn dev


A aplicação ficará disponível em:

http://localhost:3000

🗂 Estrutura de Pastas
/
├─ public/              # Arquivos estáticos
├─ src/
│   ├─ components/      # Componentes React
│   ├─ pages/           # Páginas Next.js
│   ├─ services/        # Chamadas de API
│   ├─ styles/          # Estilos
│   └─ utils/           # Utilitários
├─ .env.local           # Variáveis de ambiente
├─ package.json
└─ README.md

📱 Funcionalidades Principais

✔ Navegação entre páginas
✔ Listagem de produtos
✔ Carrinho de compras
✔ Cadastro / Login de usuários
✔ Detalhes de produtos
✔ Integração com Web3 (ex.: Metamask)
✔ Checkout e pedidos
✔ Pagamento (dependendo da implementação backend)

🧪 API (Backend)

Este frontend consome uma API backend (NestJS) que deve estar rodando para funções de banco de dados, carrinho, pedidos e autenticação.

🛠 Swagger (Documentação da API)

Acesse a documentação da API backend em:

http://localhost:3001/api/docs


Lá você encontra rotas, parâmetros e exemplos de requisições automaticamente gerados com Swagger.
(Se você ainda não tem o Swagger habilitado, posso gerar o template para você.)

📌 Ajustando o Backend

Certifique-se que o backend tenha:

✔ Swagger habilitado
✔ Rotas de autenticação
✔ Endpoints de produtos, carrinho, pedidos
✔ Permissões CORS liberadas para o frontend

📝 Notas

Recomenda-se usar axios interceptors para tratamento de token e erros globais.

Caso necessário, implemente suporte para Web3 wallets (MetaMask, WalletConnect, etc.).

Ajuste rotas /api/ no frontend para o endereço real da sua API (deploy).
