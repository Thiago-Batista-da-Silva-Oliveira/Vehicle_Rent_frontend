# Tenants API Routes

Este documento descreve as rotas disponíveis para gerenciamento de tenants no sistema RentX.

## Endpoints

### Criar Tenant

**POST /tenants**

Cria um novo tenant no sistema.

**Requisição:**
```json
{
  "name": "Nome do Tenant",
  "domain": "dominio-tenant",
  "active": true
}
```

**Resposta (201 Created):**
```json
{
  "id": "uuid-do-tenant",
  "name": "Nome do Tenant",
  "domain": "dominio-tenant",
  "active": true,
  "createdAt": "2023-01-01T00:00:00.000Z",
  "updatedAt": "2023-01-01T00:00:00.000Z"
}
```

**Resposta de Erro (400 Bad Request):**
```json
{
  "statusCode": 400,
  "message": "Invalid input.",
  "error": "Bad Request"
}
```

### Listar Todos os Tenants

**GET /tenants**

Retorna a lista de todos os tenants cadastrados.

**Resposta (200 OK):**
```json
[
  {
    "id": "uuid-do-tenant-1",
    "name": "Nome do Tenant 1",
    "domain": "dominio-tenant-1",
    "active": true,
    "createdAt": "2023-01-01T00:00:00.000Z",
    "updatedAt": "2023-01-01T00:00:00.000Z"
  },
  {
    "id": "uuid-do-tenant-2",
    "name": "Nome do Tenant 2",
    "domain": "dominio-tenant-2",
    "active": true,
    "createdAt": "2023-01-01T00:00:00.000Z",
    "updatedAt": "2023-01-01T00:00:00.000Z"
  }
]
```

### Obter Tenant por ID

**GET /tenants/:id**

Retorna os detalhes de um tenant específico.

**Parâmetros:**
- `id`: ID do tenant (UUID)

**Resposta (200 OK):**
```json
{
  "id": "uuid-do-tenant",
  "name": "Nome do Tenant",
  "domain": "dominio-tenant",
  "active": true,
  "createdAt": "2023-01-01T00:00:00.000Z",
  "updatedAt": "2023-01-01T00:00:00.000Z"
}
```

**Resposta de Erro (404 Not Found):**
```json
{
  "statusCode": 404,
  "message": "Tenant not found.",
  "error": "Not Found"
}
```

### Atualizar Tenant

**PUT /tenants/:id**

Atualiza os dados de um tenant existente.

**Parâmetros:**
- `id`: ID do tenant (UUID)

**Requisição:**
```json
{
  "name": "Novo Nome do Tenant",
  "active": true
}
```

**Resposta (200 OK):**
```json
{
  "id": "uuid-do-tenant",
  "name": "Novo Nome do Tenant",
  "domain": "dominio-tenant",
  "active": true,
  "createdAt": "2023-01-01T00:00:00.000Z",
  "updatedAt": "2023-01-01T00:00:00.000Z"
}
```

**Resposta de Erro (400 Bad Request):**
```json
{
  "statusCode": 400,
  "message": "Invalid input.",
  "error": "Bad Request"
}
```

**Resposta de Erro (404 Not Found):**
```json
{
  "statusCode": 404,
  "message": "Tenant not found.",
  "error": "Not Found"
}
```

### Excluir Tenant

**DELETE /tenants/:id**

Remove um tenant do sistema.

**Parâmetros:**
- `id`: ID do tenant (UUID)

**Resposta (204 No Content):**
- Sem conteúdo na resposta

**Resposta de Erro (404 Not Found):**
```json
{
  "statusCode": 404,
  "message": "Tenant not found.",
  "error": "Not Found"
}
```

## Autenticação

Todas as rotas de tenants requerem autenticação. Inclua o token JWT no cabeçalho da requisição:

```
Authorization: Bearer seu-token-jwt
```

## Observações

- O campo `domain` é único e não pode ser duplicado
- O campo `active` determina se o tenant está ativo ou inativo
- As datas de criação e atualização são gerenciadas automaticamente pelo sistema 