import { IonPage, IonContent, IonText, IonButton, IonIcon } from "@ionic/react";
import { checkmarkOutline } from "ionicons/icons";
import { useHistory, useLocation } from "react-router-dom";
import "./SuccessModal.scss";

interface LocationState {
  email?: string;
}

const SuccessModalPage: React.FC = () => {
  const history = useHistory();
  const location = useLocation<LocationState>();
  const email = location.state?.email;

  const handleGoToLogin = () => {
    history.replace("/login");
  };

  const handleCloseModal = () => {
    history.replace("/welcome");
  };

  return (
    <IonPage>
      <IonContent className="success-page ion-padding">
        <div className="success-container">
          <IonText>
            <h2>¡Registro exitoso!</h2>
          </IonText>

          <div className="modal-description">
            <p>
              Tu registro con el correo electrónico {email} fue completado
              correctamente.
            </p>
          </div>

          <div className="success-buttons">
            <IonButton
              expand="block"
              color="primary"
              onClick={handleGoToLogin}
              className="success-button"
            >
              <IonIcon icon={checkmarkOutline} slot="start" />
              IR AL LOGIN
            </IonButton>

            <IonButton
              expand="block"
              color="medium"
              fill="outline"
              onClick={handleCloseModal}
              className="success-button"
            >
              CERRAR
            </IonButton>
          </div>
        </div>
      </IonContent>
    </IonPage>
  );
};

export default SuccessModalPage;
