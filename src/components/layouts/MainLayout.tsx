import {
  IonMenu,
  IonContent,
  IonList,
  IonItem,
  IonLabel,
  IonMenuToggle,
  IonAvatar,
  IonIcon,
  IonPage,
} from "@ionic/react";
import {
  homeOutline,
  documentTextOutline,
  peopleOutline,
  locationOutline,
  receiptOutline,
  personOutline,
} from "ionicons/icons";
import { useHistory } from "react-router-dom";
import "../Header/CustomHeader.scss";
import CustomHeader from "../Header/CustomHeader";

interface MainLayoutProps {
  children: React.ReactNode;
  pageName: string;
}

const MainLayout: React.FC<MainLayoutProps> = ({ children, pageName }) => {
  const history = useHistory();

  const handleNavigation = (path: string) => {
    history.push(path);
    const menu = document.querySelector("ion-menu");
    menu?.close();
  };

  return (
    <>
      {/* Menú Lateral */}
      <IonMenu
        contentId="main-content"
        menuId="main-menu"
        side="start"
        className="custom-menu"
      >
        <IonContent className="menu-content">
          {/* Sección de perfil */}
          <div className="profile-section">
            <IonAvatar className="profile-avatar">
              <IonIcon icon={personOutline} className="profile-icon" />
            </IonAvatar>
            <IonLabel className="profile-name">Usuario</IonLabel>
            <IonLabel className="profile-email">usuario@ejemplo.com</IonLabel>
          </div>

          {/* Items del menú */}
          <IonList className="menu-list">
            <IonMenuToggle autoHide={false}>
              <IonItem
                button
                className="menu-item"
                onClick={() => handleNavigation("/dashboard")}
              >
                <IonIcon
                  slot="start"
                  icon={homeOutline}
                  className="menu-icon"
                />
                <IonLabel>Inicio</IonLabel>
              </IonItem>
            </IonMenuToggle>

            <IonMenuToggle autoHide={false}>
              <IonItem
                button
                className="menu-item"
                onClick={() => handleNavigation("/create-reservation")}
              >
                <IonIcon
                  slot="start"
                  icon={documentTextOutline}
                  className="menu-icon"
                />
                <IonLabel>Crear Reservación</IonLabel>
              </IonItem>
            </IonMenuToggle>

            <IonMenuToggle autoHide={false}>
              <IonItem
                button
                className="menu-item"
                onClick={() => handleNavigation("/create-client")}
              >
                <IonIcon
                  slot="start"
                  icon={peopleOutline}
                  className="menu-icon"
                />
                <IonLabel>Crear Cliente</IonLabel>
              </IonItem>
            </IonMenuToggle>

            <IonMenuToggle autoHide={false}>
              <IonItem
                button
                className="menu-item"
                onClick={() => handleNavigation("/create-touristsite")}
              >
                <IonIcon
                  slot="start"
                  icon={locationOutline}
                  className="menu-icon"
                />
                <IonLabel>Crear Sitio Turístico</IonLabel>
              </IonItem>
            </IonMenuToggle>

            <IonMenuToggle autoHide={false}>
              <IonItem
                button
                className="menu-item"
                onClick={() => handleNavigation("/create-factura")}
              >
                <IonIcon
                  slot="start"
                  icon={receiptOutline}
                  className="menu-icon"
                />
                <IonLabel>Generar Factura</IonLabel>
              </IonItem>
            </IonMenuToggle>
          </IonList>
        </IonContent>
      </IonMenu>

      {/* Página principal */}
      <IonPage id="main-content">
        <CustomHeader
          pageName={pageName}
          showMenuButton={true}
          showLogoutButton={true}
        />
        {children}
      </IonPage>
    </>
  );
};

export default MainLayout;
