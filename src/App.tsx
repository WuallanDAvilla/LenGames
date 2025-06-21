// src/App.tsx

import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./contexts/AuthContext";

// Componentes
import { Layout } from "./components/Layout";
import { ProtectedRoute } from "./components/ProtectedRoute";
import { GuestRoute } from "./components/GuestRoute"; // Agora este arquivo existe!

// Páginas
import { Home } from "./pages/Home";
import { Login } from "./pages/Login";
import { Games } from "./pages/Games";
import { Leaderboard } from "./pages/Leaderboard";
import { Profile } from "./pages/Profile";
import { PublicProfile } from "./pages/PublicProfile";
import { Settings } from "./pages/Settings";
import { ErrorPage } from "./pages/ErrorPage";

// Jogos (verificando os caminhos com base na sua estrutura)
import { JogoDaVelha } from "./components/games/JogoDaVelha";
import { JogoDaMemoria } from "./components/games/JogoDaMemoria";
import { JogoDaCobrinha } from "./components/games/JogoDaCobrinha";
import { Xadrez } from "./components/games/Xadrez";
import Tetris from "./components/games/tetris/Tetris";
import { SpaceInvaders } from "./components/games/space-invaders/SpaceInvaders";
import { DinoRun } from "./components/games/dino-run/DinoRun";

function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          <Route element={<Layout />}>
            {/* --- ROTAS PÚBLICAS --- */}
            <Route path="/" element={<Home />} />
            <Route path="/jogos" element={<Games />} />
            <Route path="/classificacao" element={<Leaderboard />} />
            <Route path="/perfil/:username" element={<PublicProfile />} />

            {/* Rotas dos Jogos (com proteção interna) */}
            <Route path="/games/jogo-da-velha" element={<JogoDaVelha />} />
            <Route path="/games/genius" element={<JogoDaMemoria />} />
            <Route
              path="/games/jogo-da-cobrinha"
              element={<JogoDaCobrinha />}
            />
            <Route path="/games/xadrez" element={<Xadrez />} />
            <Route path="/games/tetris" element={<Tetris />} />
            <Route path="/games/space-invaders" element={<SpaceInvaders />} />
            <Route path="/games/dino-run" element={<DinoRun />} />

            {/* --- ROTAS PROTEGIDAS --- */}
            <Route
              path="/conta"
              element={
                <ProtectedRoute>
                  <Profile />
                </ProtectedRoute>
              }
            />
            <Route
              path="/configuracoes"
              element={
                <ProtectedRoute>
                  <Settings />
                </ProtectedRoute>
              }
            />
          </Route>

          {/* --- ROTA DE LOGIN (SEM LAYOUT) --- */}
          <Route
            path="/login"
            element={
              <GuestRoute>
                <Login />
              </GuestRoute>
            }
          />
          <Route path="*" element={<ErrorPage />} />
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;
