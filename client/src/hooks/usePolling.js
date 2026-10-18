import { useEffect, useRef, useState, useCallback } from "react";

export function usePolling(buscar, intervaloMs = 5000) {
  const [dados, setDados] = useState([]);
  const [erro, setErro] = useState(null);
  const [carregando, setCarregando] = useState(true);
  const [ultimaAtualizacao, setUltima] = useState(null);
  const ocupado = useRef(false);

  const atualizar = useCallback(async () => {
    if (ocupado.current) return;
    ocupado.current = true;
    try {
      setDados(await buscar());
      setErro(null);
      setUltima(new Date());
    } catch (e) {
      setErro(e.message); // mantém os dados antigos na tela
    } finally {
      ocupado.current = false;
      setCarregando(false);
    }
  }, [buscar]);

  useEffect(() => {
    atualizar();
    const id = setInterval(() => {
      if (!document.hidden) atualizar();
    }, intervaloMs);
    return () => clearInterval(id);
  }, [atualizar, intervaloMs]);

  return { dados, erro, carregando, ultimaAtualizacao, atualizar };
}