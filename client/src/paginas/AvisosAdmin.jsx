import { useState, useCallback } from "react";
import { api } from "../api";
import { usePolling } from "../hooks/usePolling";
import { statusAviso } from "../utils";
import CartaoAviso from "../componentes/CartaoAviso";
import FormAviso from "./FormAviso";

export default function AvisosAdmin() {
  const buscar = useCallback(() => api.listar(), []);
  const { dados: avisos, erro, atualizar } = usePolling(buscar, 15000);
  const [editando, setEditando] = useState(null);
  const [msg, setMsg] = useState(null); // { tipo: "ok" | "erro", texto }

  function avisar(tipo, texto) {
    setMsg({ tipo, texto });
    setTimeout(() => setMsg(null), 4000);
  }

  async function criar(form) {
    await api.criar(form);
    await atualizar();
    avisar("ok", "Aviso criado com sucesso!");
  }

  async function editar(form) {
    await api.editar(editando.id, form);
    setEditando(null);
    await atualizar();
    avisar("ok", "Aviso atualizado!");
  }

  async function excluir(a) {
    if (!window.confirm(`Excluir o aviso "${a.nome}"?`)) return;
    try {
      await api.excluir(a.id);
      await atualizar();
      avisar("ok", "Aviso excluído.");
    } catch (e) {
      avisar("erro", e.message);
    }
  }

  function iniciarEdicao(a) {
    setEditando(a);
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  return (
    <section>
      <h1>Gerenciar avisos</h1>

      {erro && <p className="faixa faixa-erro" role="status">Sem conexão com o servidor: {erro}</p>}
      {msg && <p className={`faixa faixa-${msg.tipo}`} role="status">{msg.texto}</p>}

      <div className="layout-admin">
        <div className="painel-form">
          <h2>{editando ? `Editando: ${editando.nome}` : "Novo aviso"}</h2>
          <FormAviso
            key={editando?.id ?? "novo"}
            inicial={editando}
            onSalvar={editando ? editar : criar}
            onCancelar={editando ? () => setEditando(null) : undefined}
          />
        </div>

        <div>
          <h2>Avisos cadastrados ({avisos.length})</h2>
          {avisos.length === 0 && <p className="vazio">Nenhum aviso cadastrado.</p>}
          <div className="grade-avisos grade-admin">
            {avisos.map((a) => (
              <CartaoAviso key={a.id} aviso={a} status={statusAviso(a)}>
                <div className="acoes">
                  <button className="btn btn-secundario" onClick={() => iniciarEdicao(a)}>Editar</button>
                  <button className="btn btn-perigo" onClick={() => excluir(a)}>Excluir</button>
                </div>
              </CartaoAviso>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}