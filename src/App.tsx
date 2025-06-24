import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./contexts/AuthContext";
import { Layout } from "./components/Layout/Layout";
import { ProtectedRoute } from "./router/ProtectedRoute";
import { GuestRoute } from "./router/GuestRoute"; 
import { Home } from "./pages/Home";
import { Login } from "./pages/Login";
import { Games } from "./pages/Games";
import { Leaderboard } from "./pages/Leaderboard";
import { Profile } from "./pages/Profile";
import { PublicProfile } from "./pages/PublicProfile";
import { Settings } from "./pages/Settings";
import { ErrorPage } from "./pages/ErrorPage";
import { JogoDaVelha } from "./features/games/tic-tac-toe/JogoDaVelha";
import { JogoDaMemoria } from "./features/games/memory-game/JogoDaMemoria";
import { JogoDaCobrinha } from "./features/games/snake/JogoDaCobrinha";
import { Xadrez } from "./features/games/chess/Xadrez";
import Tetris from "./features/games/tetris/Tetris";
import { SpaceInvaders } from "./features/games/space-invaders/SpaceInvaders";
import { DinoRun } from "./features/games/dino-run/DinoRun";

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
