// src/components/Layout.tsx

import { Outlet } from 'react-router-dom';
import { NavBar } from './NavBar.tsx';
import { Footer } from './Footer.tsx'; // <-- MUDANÇA 1: Importe o Footer
import './Layout.css'; // <-- MUDANÇA 2: Importe um novo CSS para o Layout

export function Layout() {
  return (
    // MUDANÇA 3: Envolvemos tudo em um div para controlar o layout com Flexbox
    <div className="site-container">
      <NavBar />
      {/* O 'main' agora é o conteúdo principal que pode crescer */}
      <main className="main-content">
        <Outlet />
      </main>
      <Footer />
    </div>
  );
}