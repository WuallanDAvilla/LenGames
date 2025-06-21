// src/App.tsx

import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./contexts/AuthContext";

// Importação dos Componentes e Páginas
import { Layout } from "./components/Layout";
import { ProtectedRoute } from "./components/ProtectedRoute";
import { Home } from "./pages/Home";
import { Login } from "./pages/Login";
import { Games } from "./pages/Games";
import { GameDetailPage } from "./pages/GameDetailPage";
import { Leaderboard } from "./pages/Leaderboard";
import { Profile } from "./pages/Profile";
import { PublicProfile } from "./pages/PublicProfile";
import { Settings } from "./pages/Settings";
import { ErrorPage } from "./pages/ErrorPage";

// Importação dos componentes de jogos individuais
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
          {/* Rota Pública: Login */}
          <Route path="/login" element={<Login />} />

          {/* Rotas Protegidas dentro do Layout principal */}
          <Route
            path="/"
            element={
              <ProtectedRoute>
                <Layout />
              </ProtectedRoute>
            }
          >
            {/* O "index" define a página padrão para a rota "/" */}
            <Route index element={<Home />} />
            <Route path="jogos" element={<Games />} />
            <Route path="classificacao" element={<Leaderboard />} />
            <Route path="conta" element={<Profile />} />
            <Route path="perfil/:username" element={<PublicProfile />} />
            <Route path="configuracoes" element={<Settings />} />

            {/* Rotas para os jogos individuais */}
            <Route path="games/jogo-da-velha" element={<JogoDaVelha />} />
            <Route path="games/genius" element={<JogoDaMemoria />} />
            <Route path="games/jogo-da-cobrinha" element={<JogoDaCobrinha />} />
            <Route path="games/xadrez" element={<Xadrez />} />
            <Route path="games/tetris" element={<Tetris />} />
            <Route path="games/space-invaders" element={<SpaceInvaders />} />
            <Route path="games/dino-run" element={<DinoRun />} />

            {/* Rota para GameDetailPage (se ainda for usada) */}
            <Route path="games/:gameId" element={<GameDetailPage />} />
          </Route>

          {/* Rota de Erro (catch-all) */}
          <Route path="*" element={<ErrorPage />} />
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;
