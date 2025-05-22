import {
  IonInput,
  IonButton,
  IonPage,
  IonContent,
  IonItem,
  IonIcon,
  IonLabel,
  IonCheckbox,
  useIonToast,
  IonText,
} from "@ionic/react";
import CustomHeader from "../../../components/Header/CustomHeader";
import { useFormik } from "formik";
import { useHistory } from "react-router-dom";
import "./Login.scss";
import {
  eyeOutline,
  eyeOffOutline,
  mailOutline,
  lockClosedOutline,
} from "ionicons/icons";
import { useEffect, useState } from "react";
import { initialValues, validationSchema } from "./Login.form";
import { loginUser } from "../../../services/AuthService";

export function Login() {
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [present] = useIonToast();

  const formik = useFormik({
    initialValues: initialValues(),
    validationSchema: validationSchema(),
    validateOnChange: false,
    onSubmit: async (values) => {
      setIsSubmitting(true);

      try {
        const response = await loginUser({
          email: values.email.trim().toLowerCase(),
          password: values.password,
        });

        console.log("Login exitoso:", response);

        // Guardar en localStorage si el usuario seleccionó "Recordarme"
        if (rememberMe) {
          localStorage.setItem("rememberedEmail", values.email);
        } else {
          localStorage.removeItem("rememberedEmail");
        }

        // Redirigir al dashboard
        history.push("/dashboard");
      } catch (error: any) {
        console.error("Error en login:", error);
        present({
          message: error.message || "Error al iniciar sesión",
          duration: 3000,
          position: "top",
          color: "danger",
        });
      } finally {
        setIsSubmitting(false);
      }
    },
  });

  const history = useHistory();

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };
  // Cargar email recordado si existe
  useEffect(() => {
    const rememberedEmail = localStorage.getItem("rememberedEmail");
    if (rememberedEmail) {
      formik.setFieldValue("email", rememberedEmail);
      setRememberMe(true);
    }
  }, []);

  return (
    <IonPage>
      {/* Header personalizado 
      <CustomHeader
        pageName="Iniciar sesión"
        showMenuButton={false}
        showLogoutButton={false}
      />*/}

      <IonContent class="login-page ion-padding">
        <h2>Bienvenido</h2>
        <div className="login-container">
          {/* Descripción */}
          <div className="login-description">
            <p>Por favor, ingresa tus credenciales para acceder a tu cuenta</p>
          </div>

          {/* Formulario de login */}
          <form onSubmit={formik.handleSubmit}>
            {/* Campo de email */}
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
              <IonText color="danger" className="error-message">
                <small>{formik.errors.email}</small>
              </IonText>
            )}

            {/* Campo de contraseña */}
            <IonItem className="custom-itemheader">
              <IonIcon
                icon={lockClosedOutline}
                slot="start"
                className="custom-icon"
              />
              <IonLabel>Contraseña</IonLabel>
            </IonItem>
            <IonItem className="custom-item" lines="none">
              <IonInput
                type={showPassword ? "text" : "password"}
                placeholder="Ingresa tu contraseña"
                onIonChange={(e) =>
                  formik.setFieldValue("password", e.detail.value)
                }
                className={formik.errors.password ? "ion-invalid" : ""}
              />
              <IonIcon
                icon={showPassword ? eyeOffOutline : eyeOutline}
                slot="end"
                onClick={togglePasswordVisibility}
                className="password-toggle"
              />
            </IonItem>
            {formik.errors.password && (
              <IonText color="danger" className="error-message">
                <small>{formik.errors.password}</small>
              </IonText>
            )}

            {/* Opciones de recordar y olvidar contraseña */}
            <div className="login-options">
              <IonItem lines="none">
                <IonCheckbox
                  checked={rememberMe}
                  onIonChange={(e) => setRememberMe(e.detail.checked)}
                  slot="start"
                />
                <IonLabel>Recordarme</IonLabel>
              </IonItem>
            </div>
            <div className="login-options">
              <IonItem lines="none">
                <IonButton
                  fill="clear"
                  routerLink="/forgot-password"
                  className="forgot-password"
                >
                  ¿Olvidaste tu contraseña?
                </IonButton>
              </IonItem>
            </div>

            {/* Botón de login */}
            <div className="button-row">
              {/* Botón de registro */}
              <IonButton expand="block" type="submit" disabled={isSubmitting}>
                {isSubmitting ? "Iniciando sesión..." : "Iniciar sesión"}
              </IonButton>
            </div>

            {/* Enlace a registro */}
            <div className="register-link">
              <p>
                ¿No tienes una cuenta? <a href="/signup">Regístrate</a>
              </p>
            </div>
          </form>
        </div>
      </IonContent>
    </IonPage>
  );
}
