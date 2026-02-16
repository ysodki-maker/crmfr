import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import PrivateRoute from "./PrivateRoute";
import PublicRoute from "./PublicRoute";
import Sidebar from "../components/layout/Sidebar";

// Auth Pages
import Login from "../pages/auth/Login";

// Dashboard
import Dashboard from "../pages/dashboard/Dashboard";

// Projets
import ProjetsList from "../pages/projets/ProjetsList";
import ProjetCreate from "../pages/projets/ProjetCreate";
import ProjetEdit from "../pages/projets/ProjetEdit";
import ProjetView from "../pages/projets/ProjetView";
import EspacesList from "../pages/espaces/EspacesList";
import EspaceCreate from "../pages/espaces/EspaceCreate";
import EspaceEdit from "../pages/espaces/EspaceEdit";
import EspaceDetails from "../pages/espaces/Espacedetails";
import ProjetMesures from "../pages/projets/ProjetMesures";
import UsersList from "../pages/users/UsersList";
import UserCreate from "../pages/users/UserCreate";
import UserEdit from "../pages/users/UserEdit";

const MainLayout = ({ children }) => (
  <div className="flex h-screen overflow-hidden bg-neutral-50">
    <Sidebar />
    <div className="flex-1 overflow-hidden">{children}</div>
  </div>
);

const AppRoutes = () => {
  return (
    <BrowserRouter>
      <Routes>
        {/* Routes Utilisateurs */}
        <Route
          path="/users"
          element={
            <PrivateRoute requiredRole="ADMIN">
              <MainLayout>
                <UsersList />
              </MainLayout>
            </PrivateRoute>
          }
        />
        <Route
          path="/users/create"
          element={
            <PrivateRoute requiredRole="ADMIN">
              <MainLayout>
                <UserCreate />
              </MainLayout>
            </PrivateRoute>
          }
        />
        <Route
          path="/users/:id/edit"
          element={
            <PrivateRoute requiredRole="ADMIN">
              <MainLayout>
                <UserEdit />
              </MainLayout>
            </PrivateRoute>
          }
        />
        {/* Routes publiques */}
        <Route
          path="/login"
          element={
            <PublicRoute>
              <Login />
            </PublicRoute>
          }
        />

        {/* Routes protégées */}
        <Route
          path="/dashboard"
          element={
            <PrivateRoute>
              <MainLayout>
                <Dashboard />
              </MainLayout>
            </PrivateRoute>
          }
        />

        {/* Routes Projets */}
        <Route
          path="/projets"
          element={
            <PrivateRoute>
              <MainLayout>
                <ProjetsList />
              </MainLayout>
            </PrivateRoute>
          }
        />
        <Route
          path="/projets/create"
          element={
            <PrivateRoute>
              <MainLayout>
                <ProjetCreate />
              </MainLayout>
            </PrivateRoute>
          }
        />
        <Route
          path="/projets/:id"
          element={
            <PrivateRoute>
              <MainLayout>
                <ProjetView />
              </MainLayout>
            </PrivateRoute>
          }
        />
        <Route
          path="/projets/:id/edit"
          element={
            <PrivateRoute>
              <MainLayout>
                <ProjetEdit />
              </MainLayout>
            </PrivateRoute>
          }
        />

        {/* Redirect par défaut */}
        <Route path="/" element={<Navigate to="/dashboard" replace />} />
        <Route path="*" element={<Navigate to="/dashboard" replace />} />

        <Route
          path="/projets/:projetId/espaces"
          element={
            <PrivateRoute>
              <MainLayout>
                <EspacesList />
              </MainLayout>
            </PrivateRoute>
          }
        />
        <Route
          path="/projets/:projetId/espaces/create"
          element={
            <PrivateRoute>
              <MainLayout>
                <EspaceCreate />
              </MainLayout>
            </PrivateRoute>
          }
        />
        <Route
          path="/espaces/:id"
          element={
            <PrivateRoute>
              <MainLayout>
                <EspaceDetails />
              </MainLayout>
            </PrivateRoute>
          }
        />
        <Route
          path="/espaces/:id/edit"
          element={
            <PrivateRoute>
              <MainLayout>
                <EspaceEdit />
              </MainLayout>
            </PrivateRoute>
          }
        />
        <Route
          path="/projets/:projetId/mesures"
          element={
            <PrivateRoute>
              <MainLayout>
                <ProjetMesures />
              </MainLayout>
            </PrivateRoute>
          }
        />
      </Routes>
    </BrowserRouter>
  );
};

export default AppRoutes;
