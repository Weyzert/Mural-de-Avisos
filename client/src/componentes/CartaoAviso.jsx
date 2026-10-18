import { TIPOS, TURNOS, ANOS } from "../constantes";
import { formatarDia, rotulos } from "../utils";

export default function CartaoAviso({ aviso, status, children }) {
  const tipo = TIPOS[aviso.tipo] ?? TIPOS.informativo;

  return (
    <article className="cartao" data-tipo={aviso.tipo} style={{ "--cor-tipo": tipo.cor }}>
      <div className="cartao-topo">
        <span className="selo">{tipo.label}</span>
        {status && (
          <span className={`status status-${status}`}>
            {status === "ativo" ? "Em exibição" : "Agendado"}
          </span>
        )}
      </div>

      <h2 className="cartao-titulo">{aviso.nome}</h2>
      <p className="cartao-texto">{aviso.texto}</p>

      <div className="etiquetas">
        {rotulos(aviso.turnos, TURNOS).map((t) => <span key={t} className="etiqueta">{t}</span>)}
        {rotulos(aviso.anos, ANOS).map((a) => <span key={a} className="etiqueta">{a}</span>)}
      </div>

      <p className="cartao-meta">
        {formatarDia(aviso.data)} · {aviso.horaInicio} às {aviso.horaFim}
        <br />
        Por {aviso.autor}
      </p>

      {children}
    </article>
  );
}