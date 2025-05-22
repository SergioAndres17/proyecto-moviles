import { IonApp, IonRouterOutlet, setupIonicReact } from "@ionic/react";
import { IonReactRouter } from "@ionic/react-router";
import { Redirect, Route } from "react-router-dom";

/* Core CSS required for Ionic components to work properly */
import "@ionic/react/css/core.css";

/* Basic CSS for apps built with Ionic */
import "@ionic/react/css/normalize.css";
import "@ionic/react/css/structure.css";
import "@ionic/react/css/typography.css";

/* Optional CSS utils that can be commented out */
import "@ionic/react/css/padding.css";
import "@ionic/react/css/float-elements.css";
import "@ionic/react/css/text-alignment.css";
import "@ionic/react/css/text-transformation.css";
import "@ionic/react/css/flex-utils.css";
import "@ionic/react/css/display.css";

/* Dark mode */
import "@ionic/react/css/palettes/dark.system.css";

/* Theme variables */
import "./theme/variables.css";

/* Pages */
import { Welcome } from "./pages/Welcome/Welcome";
import { Login } from "./pages/auth/Login/Login";
import { Signup } from "./pages/auth/Signup/Signup";
import { ForgotPassword } from "./pages/auth/Login/ForgotPassword/ForgotPassword";
import { Dashboard } from "./pages/app/Dashboard/Dashboard";
import { VerifyEmail } from "./pages/auth/Login/VerifyEmail/VerifyEmail";
import { TouristSite } from "./pages/app/Management/CreateTouristSites/TouristSites";
import { CreateReservation } from "./pages/app/Management/CreateReservation/CreateReservation";
import { CreateClient } from "./pages/app/Management/Clients/CreateClient";
import AuthLayout from "./components/layouts/AuthLayout";
import MainLayout from "./components/layouts/MainLayout";
import { CreateFactura } from "./pages/app/Management/CreateFactura/CreateFactura";
/* Importaciones de los listados completos */
import { ClientsPage } from "./pages/app/DataViews/Clients";
import { ReservationsPage } from "./pages/app/DataViews/Reservations";
import { TouristSitesPage } from "./pages/app/DataViews/TouristSites";
import { FacturasPage } from "./pages/app/DataViews/Facturas";
/* Layouts */

setupIonicReact();

export default function App() {
  return (
    <IonApp>
      <IonReactRouter>
        <IonRouterOutlet>
          {/* Rutas públicas (sin menú) */}
          <Route exact path="/welcome">
            <AuthLayout pageName="Bienvenido">
              <Welcome />
            </AuthLayout>
          </Route>

          <Route exact path="/login">
            <AuthLayout pageName="Iniciar Sesión">
              <Login />
            </AuthLayout>
          </Route>

          <Route exact path="/signup">
            <AuthLayout pageName="Registro">
              <Signup />
            </AuthLayout>
          </Route>

          <Route exact path="/forgot-password">
            <AuthLayout pageName="Recuperar Contraseña">
              <ForgotPassword />
            </AuthLayout>
          </Route>

          <Route exact path="/verify-email">
            <AuthLayout pageName="Verificar Email">
              <VerifyEmail />
            </AuthLayout>
          </Route>

          {/* Rutas privadas (con menú) */}
          <Route exact path="/dashboard">
            <MainLayout pageName="Dashboard">
              <Dashboard />
            </MainLayout>
          </Route>

          <Route exact path="/create-touristsite">
            <MainLayout pageName="Sitios Turísticos">
              <TouristSite />
            </MainLayout>
          </Route>

          <Route exact path="/create-reservation">
            <MainLayout pageName="Reservación">
              <CreateReservation />
            </MainLayout>
          </Route>

          <Route exact path="/create-client">
            <MainLayout pageName="Cliente">
              <CreateClient />
            </MainLayout>
          </Route>

          <Route exact path="/create-factura">
            <MainLayout pageName="Factura">
              <CreateFactura />
            </MainLayout>
          </Route>

          {/* Rutas para los listados completos */}
          <Route exact path="/clients">
            <MainLayout pageName="Clientes">
              <ClientsPage />
            </MainLayout>
          </Route>

          <Route exact path="/reservations">
            <MainLayout pageName="Reservaciones">
              <ReservationsPage />
            </MainLayout>
          </Route>

          <Route exact path="/tourist-sites">
            <MainLayout pageName="Sitios Turísticos">
              <TouristSitesPage />
            </MainLayout>
          </Route>

          <Route exact path="/facturas">
            <MainLayout pageName="Facturas">
              <FacturasPage />
            </MainLayout>
          </Route>

          {/* Rutas para los edit */}
          <Route exact path="/edit-touristsite/:id">
            <MainLayout pageName="Editar Sitio Turístico">
              <TouristSite />
            </MainLayout>
          </Route>

          <Route exact path="/edit-client/:id">
            <MainLayout pageName="Editar Cliente">
              <CreateClient />
            </MainLayout>
          </Route>

          <Route exact path="/edit-reservation/:id">
            <MainLayout pageName="Editar Reservación">
              <CreateReservation />
            </MainLayout>
          </Route>

          <Route exact path="/edit-factura/:id">
            <MainLayout pageName="Editar Factura">
              <CreateFactura />
            </MainLayout>
          </Route>

          <Redirect exact from="/" to="/welcome" />
        </IonRouterOutlet>
      </IonReactRouter>
    </IonApp>
  );
}
