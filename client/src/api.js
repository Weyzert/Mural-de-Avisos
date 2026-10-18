const BASE = import.meta.env.VITE_API_URL || `http://${window.location.hostname}:3001`;

async function req(url, opcoes) {
  const r = await fetch(BASE + url, {
    headers: { "Content-Type": "application/json" },
    ...opcoes,
  });
  if (!r.ok) {
    const corpo = await r.json().catch(() => ({}));
    throw new Error(corpo.erro || `Erro ${r.status}`);
  }
  return r.status === 204 ? null : r.json();
}

export const api = {
  listar: () => req("/avisos"),
  listarAtivos: () => req("/avisos/ativos"),
  criar: (a) => req("/avisos", { method: "POST", body: JSON.stringify(a) }),
  editar: (id, a) => req(`/avisos/${id}`, { method: "PUT", body: JSON.stringify(a) }),
  excluir: (id) => req(`/avisos/${id}`, { method: "DELETE" }),
};