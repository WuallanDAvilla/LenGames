import { Outlet, useLocation } from "react-router-dom";
import { AnimatePresence } from "framer-motion"; 
import { NavBar } from "../NavBar/NavBar.tsx";
import { Footer } from "../Footer/Footer.tsx";
import { AnimatedPage } from "../AnimatedPage/AnimatedPage.tsx"; 
import "./Layout.css";

export function Layout() {
  const location = useLocation(); 

  return (
    <div className="site-container">
      <NavBar />
      <main className="main-content">
        <AnimatePresence mode="wait">
          <div key={location.pathname}>
            <AnimatedPage>
              <Outlet />
            </AnimatedPage>
          </div>
        </AnimatePresence>
      </main>
      <Footer />
    </div>
  );
}
