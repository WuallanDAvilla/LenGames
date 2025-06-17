// src/components/Layout.tsx

import { Outlet } from 'react-router-dom';
import { NavBar } from './NavBar.tsx'; // Importando com 'B' maiúsculo

export function Layout() {
  return (
    <>
      <NavBar /> {/* Usando o componente com 'B' maiúsculo */}
      <main>
        <Outlet />
      </main>
    </>
  );
}