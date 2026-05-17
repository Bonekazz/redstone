# Redstone

Chat com IA em que cada resposta pode ramificar em novos caminhos de conversa. A ideia é explorar ideias em paralelo, como uma árvore de diálogos, em vez de um único fio linear.

**Em desenvolvimento:** visualização em canvas (grafo das ramificações) ainda não está implementada.

## Pré-requisitos

- [Node.js](https://nodejs.org/) 18+
- [Groq](https://console.groq.com/) API key

## Como iniciar

1. Clone o repositório e entre na pasta do projeto.

2. Instale as dependências:

```bash
npm install
```

3. Crie um arquivo `.env` na raiz do projeto (você pode copiar o `env.example`) e defina sua chave da Groq:

```env
GROQ_API_KEY=sua_chave_aqui
```

Obtenha a chave em [console.groq.com](https://console.groq.com/). Sem ela, o chat não consegue chamar o modelo.

4. Inicie o servidor de desenvolvimento:

```bash
npm run dev
```

5. Abra [http://localhost:3000](http://localhost:3000) no navegador.

## Scripts

| Comando        | Descrição              |
| -------------- | ---------------------- |
| `npm run dev`  | Servidor de desenvolvimento |
| `npm run build`| Build de produção      |
| `npm run start`| Servidor de produção   |
| `npm run lint` | ESLint                 |
