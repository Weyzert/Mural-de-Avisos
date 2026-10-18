import { useEffect, useState } from "react";
import { NOME_CRIADOR, GITHUB_URL } from "../constantes";

export default function Footer() {
  const [ano, setAno] = useState(new Date().getFullYear());

  useEffect(() => {
    const id = setInterval(() => setAno(new Date().getFullYear()), 60 * 60 * 1000);
    return () => clearInterval(id);
  }, []);

  return (
    <footer className="rodape">
      <span>© {ano} {NOME_CRIADOR}. Todos os direitos reservados.</span>
      {GITHUB_URL && (
        <a href={GITHUB_URL} target="_blank" rel="noopener noreferrer">
          Código no GitHub ↗
        </a>
      )}
    </footer>
  );
}