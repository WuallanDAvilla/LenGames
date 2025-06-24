import React, { lazy, Suspense } from "react";
import ReactDOM from "react-dom/client";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { Toaster } from "react-hot-toast";
import "../src/styles/global.css";
import { AuthProvider } from "./contexts/AuthContext.tsx";
import { ProtectedRoute } from "./router/ProtectedRoute.tsx";
import { Layout } from "./components/Layout/Layout.tsx";
import { GlobalLoader } from "./components/GlobalLoader/GlobalLoader.tsx";

const Home = lazy(() =>
  import("./pages/Home.tsx").then((module) => ({ default: module.Home }))
);
const Login = lazy(() =>
  import("./pages/Login.tsx").then((module) => ({ default: module.Login }))
);
const Games = lazy(() =>
  import("./pages/Games.tsx").then((module) => ({ default: module.Games }))
);
const Profile = lazy(() =>
  import("./pages/Profile.tsx").then((module) => ({ default: module.Profile }))
);
const PublicProfile = lazy(() =>
  import("./pages/PublicProfile.tsx").then((module) => ({
    default: module.PublicProfile,
  }))
);
const Settings = lazy(() =>
  import("./pages/Settings.tsx").then((module) => ({
    default: module.Settings,
  }))
);
const GameDetailPage = lazy(() =>
  import("./pages/GameDetailPage.tsx").then((module) => ({
    default: module.GameDetailPage,
  }))
);
const Leaderboard = lazy(() =>
  import("./pages/Leaderboard.tsx").then((module) => ({
    default: module.Leaderboard,
  }))
);
import { ErrorPage } from "./pages/ErrorPage.tsx";

const suspenseWrapper = (element: React.ReactElement) => (
  <Suspense fallback={<GlobalLoader />}>{element}</Suspense>
);

const router = createBrowserRouter([
  {
    path: "/",
    element: <Layout />,
    errorElement: <ErrorPage />,
    children: [
      { index: true, element: suspenseWrapper(<Home />) },
      { path: "games", element: suspenseWrapper(<Games />) },
      { path: "games/:gameId", element: suspenseWrapper(<GameDetailPage />) },
      { path: "leaderboard", element: suspenseWrapper(<Leaderboard />) },
      {
        path: "conta",
        element: suspenseWrapper(
          <ProtectedRoute>
            <Profile />
          </ProtectedRoute>
        ),
      },
      {
        path: "perfil/:username",
        element: suspenseWrapper(<PublicProfile />),
      },
      {
        path: "settings",
        element: suspenseWrapper(
          <ProtectedRoute>
            <Settings />
          </ProtectedRoute>
        ),
      },
      { path: "*", element: <ErrorPage /> },
    ],
  },
  {
    path: "/login",
    element: suspenseWrapper(<Login />),
  },
]);

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <AuthProvider>
      <Toaster
        position="top-right"
        toastOptions={{ style: { background: "#363636", color: "#fff" } }}
      />
      <RouterProvider router={router} />
    </AuthProvider>
  </React.StrictMode>
);
