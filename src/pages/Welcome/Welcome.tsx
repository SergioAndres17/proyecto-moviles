import { IonContent, IonPage, IonButton } from "@ionic/react";
import { useHistory } from "react-router-dom";
import "./Welcome.scss";
import { company } from "../../assets";

export function Welcome() {
  const history = useHistory();

  return (
    <IonPage>
      {/* Logo de la compañía */}
      <div className="welcome-page__image">
        <img src={company.logo} alt="Entrar" />
      </div>
      <IonContent className="welcome-page">
        <div className="welcome-container">
          <h1>BIENVENIDOS</h1>
          <h2>Ingresa y descubre nuevos lugares.</h2>

          <div className="button-group">
            <IonButton expand="block" onClick={() => history.push("/login")}>
              Iniciar Sesión
            </IonButton>

            <IonButton
              expand="block"
              fill="outline"
              onClick={() => history.push("/signup")}
            >
              Registrarse
            </IonButton>
          </div>
        </div>
      </IonContent>
    </IonPage>
  );
}
