# spotsat-back

## Instalação

### Pré-requisitos

- Docker: [Instale o Docker](https://docs.docker.com/get-docker/)

### Configuração

1. Clone o repositório:
    ```sh
    git clone https://github.com/PedroHSdeAlmeida/spotsat-back.git
    cd spotsat-back
    ```

2. Crie um arquivo `.env` na raiz do projeto e copie o conteúdo do `.env.example`:
    ```sh
    cp .env.example .env
    ```

### Executando a aplicação

1. Suba os containers com Docker Compose:
    ```sh
    docker-compose up
    ```

    Ou, para rodar em segundo plano:
    ```sh
    docker-compose up -d
    ```

2. Acesse a documentação Swagger da API em:
    ```
    http://localhost:8000/api-docs/
    ```
    Nota: A porta pode variar se você alterar as variáveis de ambiente.

3. Acesse a página de login em:
    ```
    http://localhost:3000/
    ```

## Utilizando o Swagger

Para fazer requisições pela interface do Swagger, siga os passos abaixo:

1. Acesse a documentação Swagger em `http://localhost:8000/api-docs/`.
2. Para fazer login, utilize o endpoint `/login`:
    - Clique em `POST /login`.
    - Clique em `Try it out`.
    - Insira as credenciais no formato JSON:
      ```json
      {
        "email": "admin@admin.com",
        "senha": "admin123"
      }
      ```
    - Clique em `Execute`.
    - Copie o token JWT retornado na resposta.

3. Para autorizar outras requisições:
    - Clique no botão `Authorize` no topo da página.
    - Insira o token JWT copiado no campo `Value` no formato `Bearer <seu_token>`.
    - Clique em `Authorize` e depois em `Close`.

Agora você pode fazer requisições autenticadas aos outros endpoints, como `/polygons`.