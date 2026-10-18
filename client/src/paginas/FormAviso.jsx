import { useState } from "react";
import { TIPOS, TURNOS, ANOS } from "../constantes";
import { hojeLocal } from "../utils";

const vazio = () => ({
  nome: "", texto: "", data: hojeLocal(), horaInicio: "", horaFim: "",
  autor: "", turnos: [], anos: [], tipo: "informativo",
});

// "todos" é exclusivo: marcá-lo desmarca os demais, e marcar outro desmarca "todos"
function alternar(lista, valor) {
  if (valor === "todos") return lista.includes("todos") ? [] : ["todos"];
  const semTodos = lista.filter((v) => v !== "todos");
  return semTodos.includes(valor) ? semTodos.filter((v) => v !== valor) : [...semTodos, valor];
}

function Opcoes({ legenda, opcoes, selecionados, onAlternar }) {
  return (
    <fieldset className="campo col-total">
      <legend>{legenda}</legend>
      <div className="opcoes">
        {opcoes.map((o) => (
          <label key={o.valor} className="opcao">
            <input
              type="checkbox"
              checked={selecionados.includes(o.valor)}
              onChange={() => onAlternar(o.valor)}
            />
            {o.label}
          </label>
        ))}
      </div>
    </fieldset>
  );
}

export default function FormAviso({ inicial, onSalvar, onCancelar }) {
  const [form, setForm] = useState(inicial || vazio());
  const [erro, setErro] = useState(null);
  const [salvando, setSalvando] = useState(false);

  const set = (campo) => (e) => setForm({ ...form, [campo]: e.target.value });

  async function enviar(e) {
    e.preventDefault();
    setErro(null);
    if (!form.turnos.length || !form.anos.length) {
      return setErro("Selecione ao menos um turno e um ano.");
    }
    if (form.horaFim <= form.horaInicio) {
      return setErro("A hora de fim deve ser depois da hora de início.");
    }
    setSalvando(true);
    try {
      await onSalvar(form);
      if (!inicial) setForm(vazio());
    } catch (e) {
      setErro(e.message);
    } finally {
      setSalvando(false);
    }
  }

  return (
    <form className="form" onSubmit={enviar}>
      <label className="campo col-total">
        <span>Nome do aviso</span>
        <input value={form.nome} onChange={set("nome")} maxLength={80} required />
      </label>

      <label className="campo col-total">
        <span>Texto informativo</span>
        <textarea rows={4} value={form.texto} onChange={set("texto")} maxLength={600} required />
        <small className="contador">{form.texto.length}/600</small>
      </label>

      <label className="campo">
        <span>Dia</span>
        <input type="date" min={hojeLocal()} value={form.data} onChange={set("data")} required />
      </label>
      <label className="campo">
        <span>Início</span>
        <input type="time" value={form.horaInicio} onChange={set("horaInicio")} required />
      </label>
      <label className="campo">
        <span>Fim</span>
        <input type="time" value={form.horaFim} onChange={set("horaFim")} required />
      </label>

      <label className="campo">
        <span>Tipo</span>
        <select value={form.tipo} onChange={set("tipo")}>
          {Object.entries(TIPOS).map(([k, t]) => <option key={k} value={k}>{t.label}</option>)}
        </select>
      </label>
      <label className="campo">
        <span>Quem está fazendo o aviso</span>
        <input value={form.autor} onChange={set("autor")} required />
      </label>

      <Opcoes legenda="Turnos" opcoes={TURNOS} selecionados={form.turnos}
        onAlternar={(v) => setForm({ ...form, turnos: alternar(form.turnos, v) })} />
      <Opcoes legenda="Anos" opcoes={ANOS} selecionados={form.anos}
        onAlternar={(v) => setForm({ ...form, anos: alternar(form.anos, v) })} />

      {erro && <p className="faixa faixa-erro col-total" role="alert">{erro}</p>}

      <div className="acoes col-total">
        <button className="btn btn-primario" disabled={salvando}>
          {salvando ? "Salvando..." : inicial ? "Salvar alterações" : "Criar aviso"}
        </button>
        {onCancelar && (
          <button type="button" className="btn btn-secundario" onClick={onCancelar}>Cancelar</button>
        )}
      </div>
    </form>
  );
}