const express = require("express");
const cors = require("cors");
const fs = require("fs");
const { randomUUID } = require("crypto");

const ARQUIVO = "./avisos.json";
const app = express();
app.use(cors());
app.use(express.json());

const ler = () => (fs.existsSync(ARQUIVO) ? JSON.parse(fs.readFileSync(ARQUIVO)) : []);
const salvar = (lista) => fs.writeFileSync(ARQUIVO, JSON.stringify(lista, null, 2));

const inicio = (a) => new Date(`${a.data}T${a.horaInicio}`);
const fim = (a) => new Date(`${a.data}T${a.horaFim}`);

function validar(a) {
  const obrigatorios = ["nome", "texto", "data", "horaInicio", "horaFim", "autor", "tipo"];
  for (const c of obrigatorios) if (!a[c]) return `Campo obrigatório: ${c}`;
  if (!a.turnos?.length) return "Selecione ao menos um turno";
  if (!a.anos?.length) return "Selecione ao menos um ano";
  if (fim(a) <= inicio(a)) return "A hora de fim deve ser depois da hora de início";
  if (fim(a) <= new Date()) return "O aviso já estaria expirado";
  return null;
}

// Remove avisos expirados 
// automaticamente pela passagem do tempo
function limparExpirados() {
  const agora = new Date();
  const lista = ler();
  const validos = lista.filter((a) => fim(a) > agora);
  if (validos.length !== lista.length) salvar(validos);
}
setInterval(limparExpirados, 10_000);

// Admin: lista tudo que ainda não expirou 
// inclusive os que ainda não estão disponiveis para o publico

app.get("/avisos", (req, res) => {
  limparExpirados();
  res.json(ler());
});

// Painel: só o que está valendo agora 
// e esse vai ser usado nos monitores/tvs/pcs

app.get("/avisos/ativos", (req, res) => {
  limparExpirados();
  const agora = new Date();
  res.json(ler().filter((a) => inicio(a) <= agora && fim(a) > agora));
});

// usado para fazer o create/posta o aviso
app.post("/avisos", (req, res) => {
  const erro = validar(req.body);
  if (erro) return res.status(400).json({ erro });
  const novo = { ...req.body, id: randomUUID(), criadoEm: new Date().toISOString() };
  salvar([...ler(), novo]);
  res.status(201).json(novo);
});

// usado para attualizar todo e qualquer aviso
app.put("/avisos/:id", (req, res) => {
  const erro = validar(req.body);
  if (erro) return res.status(400).json({ erro });
  const lista = ler();
  const i = lista.findIndex((a) => a.id === req.params.id);
  if (i === -1) return res.status(404).json({ erro: "Aviso não encontrado" });
  // preserva id e criadoEm originais
  lista[i] = { ...req.body, id: lista[i].id, criadoEm: lista[i].criadoEm };
  salvar(lista);
  res.json(lista[i]);
});

//usado para deletar um aviso de maneira manual pelo admin/pessoa que vai gerenciar
app.delete("/avisos/:id", (req, res) => {
  salvar(ler().filter((a) => a.id !== req.params.id));
  res.status(204).end();
});

app.listen(3001, () => console.log("API em http://localhost:3001"));