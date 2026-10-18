import { useState, useEffect, useCallback, useMemo } from "react";
import { api } from "../api";
import { usePolling } from "../hooks/usePolling";
import { TIPOS, TURNOS, ANOS } from "../constantes";
import { passaFiltro } from "../utils";
import CartaoAviso from "../componentes/CartaoAviso";

const ORDEM_TIPO = Object.keys(TIPOS).reverse(); // urgente primeiro
const FILTRO_VAZIO = { turno: "", ano: "", tipo: "", busca: "" };

export default function Painel() {
  const buscar = useCallback(() => api.listarAtivos(), []);
  const { dados, erro, carregando, ultimaAtualizacao } = usePolling(buscar, 5000);
  const [filtro, setFiltro] = useState(FILTRO_VAZIO);
  const [telaCheia, setTelaCheia] = useState(false);

  useEffect(() => {
    const h = () => setTelaCheia(Boolean(document.fullscreenElement));
    document.addEventListener("fullscreenchange", h);
    return () => document.removeEventListener("fullscreenchange", h);
  }, []);

  function alternarTelaCheia() {
    if (document.fullscreenElement) document.exitFullscreen();
    else document.documentElement.requestFullscreen?.();
  }

  const set = (campo) => (e) => setFiltro({ ...filtro, [campo]: e.target.value });
  const filtrando = Object.values(filtro).some(Boolean);

  const avisos = useMemo(
    () =>
      dados
        .filter((a) => passaFiltro(a, filtro))
        .sort(
          (a, b) =>
            ORDEM_TIPO.indexOf(a.tipo) - ORDEM_TIPO.indexOf(b.tipo) ||
            new Date(b.criadoEm) - new Date(a.criadoEm)
        ),
    [dados, filtro]
  );

  return (
    <section className={telaCheia ? "modo-tv" : ""}>
      <div className="painel-cabecalho">
        <h1>Avisos</h1>
        <button className="btn btn-secundario" onClick={alternarTelaCheia}>
          {telaCheia ? "Sair da tela cheia" : "Tela cheia"}
        </button>
      </div>

      <div className="filtros">
        <label className="campo">
          <span>Turno</span>
          <select value={filtro.turno} onChange={set("turno")}>
            <option value="">Todos</option>
            {TURNOS.filter((t) => t.valor !== "todos").map((t) => (
              <option key={t.valor} value={t.valor}>{t.label}</option>
            ))}
          </select>
        </label>
        <label className="campo">
          <span>Ano/Curso</span>
          <select value={filtro.ano} onChange={set("ano")}>
            <option value="">Todos</option>
            {ANOS.filter((a) => a.valor !== "todos").map((a) => (
              <option key={a.valor} value={a.valor}>{a.label}</option>
            ))}
          </select>
        </label>
        <label className="campo">
          <span>Tipo</span>
          <select value={filtro.tipo} onChange={set("tipo")}>
            <option value="">Todos</option>
            {Object.entries(TIPOS).map(([k, t]) => <option key={k} value={k}>{t.label}</option>)}
          </select>
        </label>
        <label className="campo">
          <span>Buscar</span>
          <input type="search" placeholder="Título ou texto" value={filtro.busca} onChange={set("busca")} />
        </label>
        {filtrando && (
          <button className="btn btn-secundario filtros-limpar" onClick={() => setFiltro(FILTRO_VAZIO)}>
            Limpar filtros
          </button>
        )}
      </div>

      <p className="status-linha" role="status">
        {avisos.length} {avisos.length === 1 ? "aviso" : "avisos"}
        {ultimaAtualizacao && ` · atualizado às ${ultimaAtualizacao.toLocaleTimeString("pt-BR")}`}
        {erro && " · sem conexão, exibindo os últimos dados recebidos"}
      </p>

      {carregando && <p className="vazio">Carregando...</p>}
      {!carregando && avisos.length === 0 && (
        <p className="vazio">
          {filtrando ? "Nenhum aviso para os filtros selecionados." : "Nenhum aviso no momento."}
        </p>
      )}

      <div className="grade-avisos">
        {avisos.map((a) => <CartaoAviso key={a.id} aviso={a} />)}
      </div>
    </section>
  );
}