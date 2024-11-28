# Desafio Shopper - Guia

## Requisitos
- **Docker** e **Docker Compose** instalados na máquina.
- Uma chave da API do Google Maps (**Google API Key**).
---

## Configuração Inicial

### 1. Criar o arquivo `.env`
Na raiz do projeto, crie um arquivo `.env` com o seguinte conteúdo:

```env
GOOGLE_API_KEY=SUA_CHAVE_AQUI
```
---

### 2. Subir os Containers com Docker Compose
Execute o comando:

```bash
docker compose up
```
Isso irá:
- Construir as imagens do backend e frontend.
- Iniciar os containers para o backend, frontend e banco de dados PostgreSQL.

---

### 3. Acessar o Projeto
- Frontend: Acesse [http://localhost:80](http://localhost:80).
- Backend: O backend estará exposto na porta `8080`.

---

## Observações
- Certifique-se de que não há nenhum outro serviço ocupando as portas `80` e `8080`.
- Em caso de erros, verifique os logs dos containers com:

```bash
docker compose logs -f
```

