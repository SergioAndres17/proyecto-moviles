import {
  IonInput,
  IonButton,
  IonPage,
  IonContent,
  IonItem,
  IonIcon,
  IonSelect,
  IonSelectOption,
  IonLabel,
  IonDatetime,
  IonModal,
  IonButtons,
  useIonToast,
  IonText,
} from "@ionic/react";

import { useFormik } from "formik";
import { useHistory } from "react-router-dom";
import "./Signup.scss";
import {
  calendarOutline,
  callOutline,
  cardOutline,
  eyeOffOutline,
  eyeOutline,
  lockClosedOutline,
  mailOutline,
  personOutline,
  checkmarkOutline,
  closeOutline,
} from "ionicons/icons";
import { initialValues, validationSchema } from "./signup.form";
import { useState } from "react";
import CustomHeader from "../../../components/Header/CustomHeader";
import { registerUser } from "../../../services/AuthService";

type LocationState = {
  email: string;
};

export function Signup() {
  const history = useHistory();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [present] = useIonToast();

  // Estados para el selector de fecha
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [selectedDate, setSelectedDate] = useState<string | null>(null);
  const [showPassword, setShowPassword] = useState(false);

  const formik = useFormik({
    initialValues: initialValues(),
    validationSchema: validationSchema(),
    validateOnChange: false,
    onSubmit: async (values) => {
      setIsSubmitting(true);
      setErrorMessage(null);

      try {
        const formattedValues = {
          ...values,
          birthDate: values.birthDate
            ? new Date(values.birthDate).toISOString().split("T")[0]
            : null,
        };

        await registerUser(formattedValues);

        // Redirigir directamente a verify-email
        history.push("/verify-email", {
          email: values.email,
        } as LocationState);
      } catch (error: any) {
        const message = error.message || "Error en el registro";
        setErrorMessage(message);
        present({
          message,
          duration: 5000,
          position: "top",
          color: "danger",
        });
      } finally {
        setIsSubmitting(false);
      }
    },
  });

  const handleDateConfirm = (date: string) => {
    formik.setFieldValue("birthDate", date);
    setShowDatePicker(false);
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  return (
    <IonPage>
      {/* Contenido principal de la página */}
      <IonContent class="signup-page ion-padding">
        <h2>Registro de Personas</h2>

        {/* SECCIÓN: FECHA DE NACIMIENTO */}
        <IonItem
          className="custom-item"
          button
          onClick={() => setShowDatePicker(true)}
          lines="full"
        >
          <IonIcon
            icon={calendarOutline}
            slot="start"
            className="custom-icon"
          />
          <IonLabel>Fecha de Nacimiento</IonLabel>
          <IonLabel
            slot="end"
            color={formik.values.birthDate ? undefined : "medium"}
          >
            {formik.values.birthDate
              ? new Date(formik.values.birthDate).toLocaleDateString("es-ES")
              : "Seleccione fecha"}
          </IonLabel>
        </IonItem>
        {formik.errors.birthDate && (
          <IonText color="danger" className="ion-padding-start">
            <small>{formik.errors.birthDate}</small>
          </IonText>
        )}

        {/* Modal del selector de fecha */}
        <IonModal
          isOpen={showDatePicker}
          onDidDismiss={() => setShowDatePicker(false)}
          className="date-picker-modal"
        >
          <IonContent>
            <IonDatetime
              presentation="date"
              locale="es-ES"
              min="1900-01-01"
              max={new Date().toISOString()}
              value={selectedDate || formik.values.birthDate || undefined}
              onIonChange={(e) => setSelectedDate(e.detail.value as string)}
              showDefaultButtons={false}
            >
              <span slot="title">Seleccione su fecha de nacimiento</span>
            </IonDatetime>

            <IonButtons className="ion-padding">
              <IonButton
                expand="block"
                color="medium"
                onClick={() => setShowDatePicker(false)}
              >
                Cancelar
              </IonButton>
              <IonButton
                expand="block"
                onClick={() => {
                  if (selectedDate) {
                    handleDateConfirm(selectedDate);
                  }
                }}
              >
                Confirmar
              </IonButton>
            </IonButtons>
          </IonContent>
        </IonModal>

        {/* SECCIÓN: TIPO DE DOCUMENTO */}
        <IonItem className="custom-item" lines="full">
          <IonIcon icon={cardOutline} slot="start" className="custom-icon" />
          <IonLabel position="stacked">Tipo de Documento</IonLabel>
          <IonSelect
            interface="alert"
            placeholder="Seleccione tipo de documento"
            value={formik.values.documentType}
            onIonChange={(e) =>
              formik.setFieldValue("documentType", e.detail.value)
            }
            className="document-type-select"
          >
            <IonSelectOption value="cc">Cédula de Ciudadanía</IonSelectOption>
            <IonSelectOption value="ti">Tarjeta de Identidad</IonSelectOption>
            <IonSelectOption value="ce">Cédula de Extranjería</IonSelectOption>
            <IonSelectOption value="passport">Pasaporte</IonSelectOption>
            <IonSelectOption value="nit">NIT</IonSelectOption>
          </IonSelect>
        </IonItem>
        {formik.errors.documentType && (
          <IonText color="danger" className="ion-padding-start">
            <small>{formik.errors.documentType}</small>
          </IonText>
        )}

        {/* SECCIÓN: NÚMERO DE DOCUMENTO */}
        <IonItem className="custom-item">
          <IonIcon icon={cardOutline} slot="start" className="custom-icon" />
          <IonLabel>Número de Documento</IonLabel>
        </IonItem>
        <IonInput
          value={formik.values.documentNumber}
          placeholder="Ingrese número de documento"
          onIonChange={(e) =>
            formik.setFieldValue("documentNumber", e.detail.value)
          }
        />
        {formik.errors.documentNumber && (
          <IonText color="danger" className="ion-padding-start">
            <small>{formik.errors.documentNumber}</small>
          </IonText>
        )}

        {/* SECCIÓN: NOMBRE COMPLETO */}
        <IonItem className="custom-item">
          <IonIcon icon={personOutline} slot="start" className="custom-icon" />
          <IonLabel>Nombre Completo</IonLabel>
        </IonItem>
        <IonInput
          value={formik.values.fullName}
          placeholder="Ingrese su nombre completo"
          onIonChange={(e) => formik.setFieldValue("fullName", e.detail.value)}
        />
        {formik.errors.fullName && (
          <IonText color="danger" className="ion-padding-start">
            <small>{formik.errors.fullName}</small>
          </IonText>
        )}

        {/* SECCIÓN: CORREO ELECTRÓNICO */}
        <IonItem className="custom-item">
          <IonIcon icon={mailOutline} slot="start" className="custom-icon" />
          <IonLabel>Correo Electrónico</IonLabel>
        </IonItem>
        <IonInput
          type="email"
          value={formik.values.email}
          placeholder="Ingrese su correo electrónico"
          onIonChange={(e) => formik.setFieldValue("email", e.detail.value)}
        />
        {formik.errors.email && (
          <IonText color="danger" className="ion-padding-start">
            <small>{formik.errors.email}</small>
          </IonText>
        )}

        {/* SECCIÓN: NÚMERO DE TELÉFONO */}
        <IonItem className="custom-item">
          <IonIcon icon={callOutline} slot="start" className="custom-icon" />
          <IonLabel>Número de Teléfono</IonLabel>
        </IonItem>
        <IonInput
          type="tel"
          value={formik.values.phone}
          placeholder="Ingrese su número de teléfono"
          onIonChange={(e) => formik.setFieldValue("phone", e.detail.value)}
        />
        {formik.errors.phone && (
          <IonText color="danger" className="ion-padding-start">
            <small>{formik.errors.phone}</small>
          </IonText>
        )}

        {/* SECCIÓN: CONTRASEÑA */}
        <IonItem className="custom-item" lines="none">
          <IonIcon
            icon={lockClosedOutline}
            slot="start"
            className="custom-icon"
          />
          <IonLabel>Contraseña</IonLabel>
        </IonItem>
        <IonInput
          type={showPassword ? "text" : "password"}
          value={formik.values.password}
          placeholder="Ingresa tu contraseña"
          onIonChange={(e) => formik.setFieldValue("password", e.detail.value)}
          className={formik.errors.password ? "ion-invalid" : ""}
        >
          <IonIcon
            icon={showPassword ? eyeOffOutline : eyeOutline}
            slot="end"
            onClick={togglePasswordVisibility}
            className="password-toggle"
          />
        </IonInput>
        {formik.errors.password && (
          <IonText color="danger" className="ion-padding-start">
            <small>{formik.errors.password}</small>
          </IonText>
        )}

        {/* SECCIÓN: CONFIRMAR CONTRASEÑA */}
        <IonItem className="custom-item" lines="none">
          <IonIcon
            icon={lockClosedOutline}
            slot="start"
            className="custom-icon"
          />
          <IonLabel>Confirme su contraseña</IonLabel>
        </IonItem>
        <IonInput
          type={showPassword ? "text" : "password"}
          value={formik.values.confirmPassword}
          placeholder="Confirme su contraseña"
          onIonChange={(e) =>
            formik.setFieldValue("confirmPassword", e.detail.value)
          }
          className={formik.errors.confirmPassword ? "ion-invalid" : ""}
        >
          <IonIcon
            icon={showPassword ? eyeOffOutline : eyeOutline}
            slot="end"
            onClick={togglePasswordVisibility}
            className="password-toggle"
          />
        </IonInput>
        {formik.errors.confirmPassword && (
          <IonText color="danger" className="ion-padding-start">
            <small>{formik.errors.confirmPassword}</small>
          </IonText>
        )}

        {/* Mensaje de error general */}
        {errorMessage && (
          <IonText color="danger" className="ion-padding">
            <p>{errorMessage}</p>
          </IonText>
        )}

        {/* Botones de acción */}
        <div className="button-row">
          <IonButton
            expand="block"
            fill="outline"
            onClick={() => history.push("/welcome")}
            disabled={isSubmitting}
          >
            Retroceder
          </IonButton>

          <IonButton
            expand="block"
            onClick={() => formik.handleSubmit()}
            disabled={isSubmitting}
          >
            {isSubmitting ? "Procesando..." : "Registrarse"}
          </IonButton>
        </div>
      </IonContent>
    </IonPage>
  );
}
