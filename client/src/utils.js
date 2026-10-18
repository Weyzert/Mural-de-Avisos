export function passaFiltro(aviso, { turno, ano, tipo, busca }) {
  if (turno && !aviso.turnos.includes("todos") && !aviso.turnos.includes(turno)) return false;
  if (ano && !aviso.anos.includes("todos") && !aviso.anos.includes(ano)) return false;
  if (tipo && aviso.tipo !== tipo) return false;
  if (busca) {
    const t = busca.toLowerCase();
    if (!aviso.nome.toLowerCase().includes(t) && !aviso.texto.toLowerCase().includes(t)) return false;
  }
  return true;
}

export const formatarData = (iso) => new Date(iso).toLocaleString("pt-BR");
export const formatarDia = (d) => d.split("-").reverse().join("/");

export const rotulos = (valores, opcoes) =>
  valores.map((v) => opcoes.find((o) => o.valor === v)?.label ?? v);

export function hojeLocal() {
  const d = new Date();
  d.setMinutes(d.getMinutes() - d.getTimezoneOffset());
  return d.toISOString().slice(0, 10);
}

export function statusAviso(a) {
  const agora = new Date();
  if (agora < new Date(`${a.data}T${a.horaInicio}`)) return "agendado";
  if (agora < new Date(`${a.data}T${a.horaFim}`)) return "ativo";
  return "expirado";
}