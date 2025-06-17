// src/components/Layout.tsx

import { Outlet } from 'react-router-dom';
import { NavBar } from './NavBar.tsx';
import { Footer } from './Footer.tsx'; 
import './Layout.css'; 
export function Layout() {
  return (
    <div className="site-container">
      <NavBar />
      <main className="main-content">
        <Outlet />
      </main>
      <Footer />
    </div>
  );
}