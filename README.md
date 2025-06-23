# MarlimPay

MarlimPay é um sistema de pagamentos desenvolvido para facilitar transações financeiras entre usuários de forma segura e eficiente.

## Tecnologias Utilizadas

- Node.js / Fastify
- Banco de Dados MongoDB
- JWT para autenticação
- Logger Pino
- Docker Compose
- Fastify AWS-LAMBDA

## Instalação

clone o repositório:
```bash
git clone https://github.com/cleidison-barradas/marlimpay.git
cd marlimpay
```

instala dependências do projeto
```bash
npm install yarn install
```

subir o container do mongodb
```bash
docker compose up -d
```

importante!

preencha essas variáveis para que a api crie um usuário default para realizar as operações
```bash
MONGO_INITDB_EMAIL=
MONGO_INITDB_NAME=
```

## Endpoints da API

Usuários
 - POST `/api/users` - Cria um usuário
   
 ```
   {
     "name": "string",
     "email": "string"
   }
 
 ```

 - GET `/api/users/:user_id` - Detalhes de um usuário
 - PUT `/api/users/:user_id` - Atualiza os campos (nome, email) do usuário

Transações Security
  -  POST `/api/transaction-security` - Gera um security-hash para a transação
   ```
   {
      "payer_id": "string",
      "receiver_id": "string",
      "amount": "number positivo"
   }   
   ```
Retorna:

   ```
   {
      "security_hash": "string"
   }

   ```


Transações
 - POST `/api/transactions` - Cria uma transação

 ```
 {
    "payer_id": "string",
    "receiver_id": "string",
    "amount": "number positivo"
 }   
 ```

 - GET `/api/transactions/:transaction_id` - Detalhes de uma transação
 - GET `/api/users/:user_id/transactions` - Lista todas as transacões do usuário

 Webhooks
  - POST `/api/webhooks/payment-gateway` - Callback para status das transações


## Idempotência para Transacões

Ao inicar uma transação precisamos garantir que essa operarção ocorra de forma segura e eficiente,
para garantir a integridade dos dados da transação foi utlizada uma técnia para gerar um `security_hash`
retornado pelo endpoint `/api/transaction-security`. Assim garantimos que a transação é unica ao gerar esse 
hash a transação pode ser concluida com segurança, e para não permitir que sejam realizadas operações
duplicadas por engano pelo usuário o hash fica ativo por 10 minutos até que expire para que o usuário 
possa realizar outra operação para do mesmo valor com os mesmos dados de payer e receiver. Para outros
valores e receivers ou payer diferentes o fluxo segue normal.

## Rate Limit

Para previnir alto uso de recurso da api foi utilizado um limitador para bloquear chamadas à rota `POST /api/transactions`
quando o usuário atingir mais de 5 requisições por minuto.
o controle é feito pelo pluign `@fastify/rate-limit`

  

    
   
   
 



