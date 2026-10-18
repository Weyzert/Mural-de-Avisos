import { BrowserRouter, NavLink, Routes, Route, Navigate } from "react-router-dom";
import AvisosAdmin from "./paginas/AvisosAdmin";
import Painel from "./paginas/Painel";
import Footer from "./componentes/Footer";
import { NOME_ESCOLA } from "./constantes";

export default function App() {
  return (
    <BrowserRouter>
      <header className="topo">
        <div className="topo-interno">
          <span className="marca">
            {NOME_ESCOLA}
            <small>Mural de avisos</small>
          </span>
          <nav className="menu" aria-label="Principal">
            <NavLink to="/painel">Painel</NavLink>
            <NavLink to="/admin">Gerenciar</NavLink>
          </nav>
        </div>
      </header>

      <main className="conteudo">
        <Routes>
          <Route path="/" element={<Navigate to="/painel" replace />} />
          <Route path="/painel" element={<Painel />} />
          <Route path="/admin" element={<AvisosAdmin />} />
        </Routes>
      </main>

      <Footer />
    </BrowserRouter>
  );
}