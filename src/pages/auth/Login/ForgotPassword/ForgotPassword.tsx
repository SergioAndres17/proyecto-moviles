import {
  IonInput,
  IonButton,
  IonPage,
  IonContent,
  IonItem,
  IonIcon,
  IonLabel,
  IonText,
} from "@ionic/react";
import CustomHeader from "../../../../components/Header/CustomHeader";
import { useFormik } from "formik";
import { useHistory } from "react-router-dom";
import "./ForgotPassword.scss";
import { mailOutline } from "ionicons/icons";
import { initialValues, validationSchema } from "./forgotPassword.form";
import { useState } from "react";

export function ForgotPassword() {
  const [submissionSuccess, setSubmissionSuccess] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const formik = useFormik({
    initialValues: initialValues(),
    validationSchema: validationSchema(),
    validateOnChange: false,
    onSubmit: async (values) => {
      setIsSubmitting(true);
      try {
        // Simulación de llamada a API
        await new Promise((resolve) => setTimeout(resolve, 1500));
        console.log("Solicitud de recuperación enviada a:", values.email);
        setSubmissionSuccess(true);
      } catch (error) {
        console.error("Error al enviar solicitud:", error);
      } finally {
        setIsSubmitting(false);
      }
    },
  });

  const history = useHistory();

  return (
    <IonPage>
      {/* Header personalizado 
      <CustomHeader
        pageName="Recuperar contraseña"
        showMenuButton={false}
        showLogoutButton={true}
      />*/}

      <IonContent class="forgot-password-page ion-padding">
        <h2>Recuperar Contraseña</h2>
        <div className="forgot-password-container">
          {submissionSuccess ? (
            <div className="success-message">
              <IonText color="light">
                <p>
                  Hemos enviado un correo a{" "}
                  <strong>{formik.values.email}</strong> con instrucciones para
                  restablecer tu contraseña.
                </p>
                <p>Por favor revisa tu bandeja de entrada.</p>
              </IonText>
              <IonButton
                expand="block"
                className="submit-button"
                onClick={() => history.push("/login")}
              >
                Volver al inicio de sesión
              </IonButton>
            </div>
          ) : (
            <>
              <div className="forgot-password-description">
                <p>
                  Ingrese su correo electrónico para recibir instrucciones sobre
                  cómo restablecer su contraseña.
                </p>
              </div>

              <form onSubmit={formik.handleSubmit}>
                <IonItem className="custom-itemheader">
                  <IonIcon
                    icon={mailOutline}
                    slot="start"
                    className="custom-icon"
                  />
                  <IonLabel>Correo Electrónico</IonLabel>
                </IonItem>
                <IonItem className="custom-item">
                  <IonInput
                    type="email"
                    placeholder="tucorreo@ejemplo.com"
                    onIonChange={(e) =>
                      formik.setFieldValue("email", e.detail.value)
                    }
                    className={formik.errors.email ? "ion-invalid" : ""}
                  />
                </IonItem>

                {formik.errors.email && (
                  <span className="error-message">{formik.errors.email}</span>
                )}

                <IonButton
                  expand="block"
                  type="submit"
                  className="submit-button"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? "Enviando..." : "Enviar instrucciones"}
                </IonButton>
              </form>

              <div className="back-to-login">
                <p>
                  ¿Recordaste tu contraseña? <a href="/login">Inicia sesión</a>
                </p>
              </div>
            </>
          )}
        </div>
      </IonContent>
    </IonPage>
  );
}
