# Mural de Avisos

Sistema de avisos para ambiente escolar, com duas páginas:

- **Gerenciar** (`/admin`): CRUD de avisos (criar, listar, editar e excluir).
- **Painel** (`/painel`): exibe os avisos em vigor, com filtros por turno, ano/curso, tipo e busca por texto. A página se atualiza sozinha a cada 5 segundos e tem modo tela cheia, pensado para TVs.

Avisos são removidos automaticamente pelo servidor depois do horário de término.

## Funcionalidades

- Campos do aviso: nome, texto, dia, hora de início e fim, autor, tipo (com cor fixa), turnos e anos/cursos.
- Data e hora de criação gerados automaticamente pelo servidor.
- Um aviso só aparece no painel entre o horário de início e o de fim. Depois do fim, é excluído.
- Interface responsiva (celulares, tablets, monitores e TVs).
- Rodapé com link opcional para o GitHub e copyright com o ano atual.

## Tecnologias

- **Cliente**: React, Vite, React Router
- **Servidor**: Node.js, Express (dados salvos em arquivo JSON)

## Estrutura

```
avisos/
├── client/    # aplicação React (Vite)
└── server/    # API Express
```

## Requisitos

- [Node.js](https://nodejs.org/) 20 ou superior (inclui o npm)
- [Git](https://git-scm.com/)

## Instalação

```bash
git clone https://github.com/Weyzert/Mural-de-Avisos.git
cd NOME-DO-REPOSITORIO

# dependências do servidor
cd server
npm install

# dependências do cliente
cd ../client
npm install
```

## Como executar

São necessários **dois terminais**, um para o servidor e outro para o cliente.

### 1. Servidor (porta 3001)

```bash
cd server
npm start
```

A API fica em `http://localhost:3001`. O arquivo `avisos.json` é criado automaticamente na primeira vez que um aviso é cadastrado.

### 2. Cliente (porta 5173)

```bash
cd client
npm run dev
```

Abra o endereço mostrado no terminal (normalmente `http://localhost:5173`).

## Acessar de outros dispositivos (TV, celular, tablet)

1. Deixe o servidor e o cliente rodando em um computador da mesma rede.
2. Inicie o cliente expondo-o na rede:

   ```bash
   npm run dev -- --host
   ```

3. No outro dispositivo, abra `http://IP-DO-COMPUTADOR:5173/painel`. O IP aparece no terminal como "Network". Também dá para descobri-lo com `ipconfig` no Windows (campo "Endereço IPv4") ou `ip a` no Linux.

O cliente descobre o endereço da API automaticamente, usando o mesmo endereço pelo qual a página foi aberta, na porta 3001. Se o servidor estiver em outro lugar, defina `VITE_API_URL` (veja abaixo).

Se não abrir, verifique se o firewall do computador permite conexões nas portas 5173 e 3001.

## Configuração (opcional)

O arquivo `client/.env` já vem no repositório e contém o link exibido no rodapé:

```
VITE_GITHUB_URL=https://github.com/Weyzert
```

- `VITE_GITHUB_URL`: link do GitHub exibido no rodapé. Se a linha for removida ou ficar vazia, o link não aparece.
- `VITE_API_URL` (opcional): endereço da API, por exemplo `VITE_API_URL=http://192.168.0.10:3001`. Se não for definida, o cliente usa o endereço da página + porta 3001.

Reinicie o `npm run dev` depois de alterar o `.env`.

> O `.env` é versionado porque contém apenas links públicos. Nunca coloque senhas ou chaves nele.

Para trocar o nome da escola, os tipos de aviso, os turnos e os anos/cursos, edite `client/src/constantes.js`.

## Versão de produção

```bash
cd client
npm run build
npm run preview -- --host
```

Os arquivos gerados ficam em `client/dist` e podem ser servidos por qualquer servidor web estático. O servidor da API continua rodando separado (`npm start` em `server/`).

## API

| Método | Rota             | Descrição                                      |
| ------ | ---------------- | ---------------------------------------------- |
| GET    | `/avisos`        | Lista todos os avisos não expirados            |
| GET    | `/avisos/ativos` | Lista só os avisos em vigor neste momento      |
| POST   | `/avisos`        | Cria um aviso                                  |
| PUT    | `/avisos/:id`    | Atualiza um aviso                              |
| DELETE | `/avisos/:id`    | Exclui um aviso                                |

## Observações

- Os horários são interpretados no fuso do computador onde o servidor roda.
- Não há autenticação: qualquer pessoa com acesso à rede pode abrir `/admin`.
- Os dados ficam em `server/avisos.json` (ignorado pelo Git).
