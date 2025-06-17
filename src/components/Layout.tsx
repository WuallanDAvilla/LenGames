// src/components/Layout.tsx

import { Outlet } from 'react-router-dom';
import { Navbar } from './NavBar';

// O <Outlet /> é um componente especial do React Router.
// Ele funciona como um espaço reservado onde as páginas das rotas filhas
// (Home, Games, Profile, etc.) serão renderizadas.
export function Layout() {
  return (
    <>
      <Navbar />
      <main>
        <Outlet />
      </main>
      {/* No futuro, você poderia adicionar um <Footer /> aqui */}
    </>
  );
} 