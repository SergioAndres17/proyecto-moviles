// src/pages/VerifyEmail/VerifyEmail.tsx
import {
  IonPage,
  IonContent,
  IonInput,
  IonButton,
  IonText,
  useIonToast,
} from "@ionic/react";
import { useHistory, useLocation } from "react-router-dom";

import { useState } from "react";
import "./VerifyEmail.scss";
import { verifyEmail } from "../../../../services/AuthService";

type LocationState = {
  email: string;
};

export function VerifyEmail() {
  const location = useLocation();
  const history = useHistory();
  const [present] = useIonToast();
  const [code, setCode] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const email = (location.state as LocationState)?.email || "";

  const handleVerify = async () => {
    if (!code) {
      present({
        message: "Por favor ingrese el código de verificación",
        duration: 3000,
        position: "top",
        color: "warning",
      });
      return;
    }

    if (!email) {
      present({
        message: "No se encontró el correo electrónico para verificar",
        duration: 3000,
        position: "top",
        color: "danger",
      });
      history.push("/signup");
      return;
    }

    setIsSubmitting(true);
    try {
      await verifyEmail(email, code);
      present({
        message: "¡Correo verificado exitosamente!",
        duration: 3000,
        position: "top",
        color: "success",
      });
      history.push("/login");
    } catch (error: any) {
      present({
        message: error.message || "Error al verificar el correo",
        duration: 3000,
        position: "top",
        color: "danger",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <IonPage>
      <IonContent className="verify-email-page ion-padding">
        <div className="verify-container">
          <IonText color="primary">
            <h2>Verificación de Correo</h2>
          </IonText>

          {email ? (
            <p className="instructions">
              Hemos enviado un código de verificación a <strong>{email}</strong>
              . Por favor ingréselo a continuación.
            </p>
          ) : (
            <p className="instructions error">
              No se encontró información de correo electrónico. Por favor
              complete el registro nuevamente.
            </p>
          )}

          <IonInput
            placeholder="Código de verificación"
            value={code}
            onIonChange={(e) => setCode(e.detail.value!)}
            className="code-input"
            disabled={!email}
          />

          <IonButton
            expand="block"
            onClick={handleVerify}
            disabled={isSubmitting || !code || !email}
          >
            {isSubmitting ? "Verificando..." : "Verificar"}
          </IonButton>

          <IonButton
            expand="block"
            fill="outline"
            onClick={() => history.push("/signup")}
          >
            Volver al registro
          </IonButton>
        </div>
      </IonContent>
    </IonPage>
  );
}
