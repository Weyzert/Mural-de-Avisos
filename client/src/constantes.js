export const TIPOS = {
  informativo: { label: "Informativo", cor: "#2563eb" },
  importante: { label: "Importante", cor: "#f9fd05" },
  urgente: { label: "Urgente", cor: "#dc2626" },
  evento: { label: "Evento", cor: "#15803d" },
};

export const TURNOS = [
  { valor: "manha", label: "Manhã" },
  { valor: "tarde", label: "Tarde" },
  { valor: "noite", label: "Noite" },
  { valor: "todos", label: "Todos os turnos" },
];

export const ANOS = [
  { valor: "1", label: "1º ano" },
  { valor: "2", label: "2º ano" },
  { valor: "3", label: "3º ano" },
  { valor: "4", label: "Técnico em Eletrônica" },
  { valor: "todos", label: "Todos os anos e cursos" },
];

export const NOME_ESCOLA = "Instituto Estadual Cecy Leite Costa";
export const NOME_CRIADOR = "Pedro Marcelo Roso Manica / Weyzert";
export const GITHUB_URL = import.meta.env.VITE_GITHUB_URL || "";