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
  IonLoading,
  IonDatetimeButton,
} from "@ionic/react";
import { useFormik } from "formik";
import { useHistory, useParams } from "react-router-dom";
import "./CreateClient.scss";
import {
  calendarOutline,
  callOutline,
  cardOutline,
  mailOutline,
  personOutline,
  checkmarkOutline,
  arrowBackOutline,
} from "ionicons/icons";
import { initialValues, validationSchema } from "./CreateClient.form";
import { useEffect, useState } from "react";

import CustomHeader from "../../../../components/Header/CustomHeader";
import {
  createClient,
  updateClient,
  getClientById,
} from "../../../../services/clientService";

export function CreateClient() {
  const history = useHistory();
  const { id } = useParams<{ id?: string }>();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [isLoading, setIsLoading] = useState(!!id); // Cargar solo si estamos editando

  const [present] = useIonToast();

  const formik = useFormik({
    initialValues: initialValues(),
    validationSchema: validationSchema(),
    validateOnChange: false,
    onSubmit: async (values) => {
      setIsSubmitting(true);

      try {
        if (id) {
          // Modo edición
          await updateClient(parseInt(id), values);
          present({
            message: "Cliente actualizado correctamente",
            duration: 3000,
            position: "top",
            color: "success",
          });
        } else {
          // Modo creación
          await createClient(values);
          present({
            message: "Cliente registrado correctamente",
            duration: 3000,
            position: "top",
            color: "success",
          });
        }

        setShowSuccessModal(true);
      } catch (error: any) {
        present({
          message: error.message || "Error al procesar la solicitud",
          duration: 5000,
          position: "top",
          color: "danger",
        });
      } finally {
        setIsSubmitting(false);
      }
    },
  });

  // Cargar datos para edición
  useEffect(() => {
    if (id) {
      const loadClientData = async () => {
        try {
          const clientData = await getClientById(parseInt(id));
          formik.setValues({
            documentType: clientData.documentType,
            documentNumber: clientData.documentNumber,
            fullName: clientData.fullName,
            birthDate: clientData.birthDate,
            email: clientData.email,
            phone: clientData.phone,
            status: clientData.status,
          });
        } catch (error) {
          present({
            message: "Error al cargar los datos del cliente",
            duration: 3000,
            position: "top",
            color: "danger",
          });
          history.push("/clients");
        } finally {
          setIsLoading(false);
        }
      };

      loadClientData();
    }
  }, [id]);
  // Estados para el selector de fecha
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [selectedDate, setSelectedDate] = useState<string | null>(null);

  const handleDateConfirm = (date: string) => {
    formik.setFieldValue("birthDate", date);
    setShowDatePicker(false);
  };

  return (
    <IonPage>
      <CustomHeader
        pageName={id ? "Editar Cliente" : "Cliente"}
        showMenuButton={true}
        showLogoutButton={true}
      />

      <IonContent class="client-page ion-padding">
        <IonLoading isOpen={isLoading} message="Cargando datos..." />

        <h2>{id ? "Editar Cliente" : "Registro de Cliente"}</h2>

        {/* Tipo de Documento */}
        <IonItem className="custom-item" lines="full">
          <IonIcon icon={cardOutline} slot="start" className="custom-icon" />
          <IonLabel position="stacked">Tipo de Documento</IonLabel>
          <IonSelect
            interface="alert"
            placeholder="Seleccione el tipo"
            value={formik.values.documentType}
            onIonChange={(e) =>
              formik.setFieldValue("documentType", e.detail.value)
            }
          >
            <IonSelectOption value="CC">Cédula de Ciudadanía</IonSelectOption>
            <IonSelectOption value="CE">Cédula de Extranjería</IonSelectOption>
            <IonSelectOption value="TI">Tarjeta de Identidad</IonSelectOption>
            <IonSelectOption value="PP">Pasaporte</IonSelectOption>
            <IonSelectOption value="NIT">NIT</IonSelectOption>
          </IonSelect>
        </IonItem>
        {formik.errors.documentType && (
          <IonText color="danger" className="ion-padding-start">
            <small>{formik.errors.documentType}</small>
          </IonText>
        )}

        {/* Número de Documento */}
        <IonItem className="custom-item">
          <IonIcon icon={cardOutline} slot="start" className="custom-icon" />
          <IonLabel>Número de Documento</IonLabel>
        </IonItem>
        <IonInput
          value={formik.values.documentNumber}
          placeholder="Ingrese el número de documento"
          onIonChange={(e) =>
            formik.setFieldValue("documentNumber", e.detail.value)
          }
        />
        {formik.errors.documentNumber && (
          <IonText color="danger" className="ion-padding-start">
            <small>{formik.errors.documentNumber}</small>
          </IonText>
        )}

        {/* Nombre Completo */}
        <IonItem className="custom-item">
          <IonIcon icon={personOutline} slot="start" className="custom-icon" />
          <IonLabel>Nombre Completo</IonLabel>
        </IonItem>
        <IonInput
          value={formik.values.fullName}
          placeholder="Ingrese el nombre completo"
          onIonChange={(e) => formik.setFieldValue("fullName", e.detail.value)}
        />
        {formik.errors.fullName && (
          <IonText color="danger" className="ion-padding-start">
            <small>{formik.errors.fullName}</small>
          </IonText>
        )}

        {/* Fecha de Nacimiento */}
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

        {/* Email */}
        <IonItem className="custom-item">
          <IonIcon icon={mailOutline} slot="start" className="custom-icon" />
          <IonLabel>Email</IonLabel>
        </IonItem>
        <IonInput
          type="email"
          value={formik.values.email}
          placeholder="Ingrese el email"
          onIonChange={(e) => formik.setFieldValue("email", e.detail.value)}
        />
        {formik.errors.email && (
          <IonText color="danger" className="ion-padding-start">
            <small>{formik.errors.email}</small>
          </IonText>
        )}

        {/* Teléfono */}
        <IonItem className="custom-item">
          <IonIcon icon={callOutline} slot="start" className="custom-icon" />
          <IonLabel>Teléfono</IonLabel>
        </IonItem>
        <IonInput
          type="tel"
          value={formik.values.phone}
          placeholder="Ingrese el teléfono"
          onIonChange={(e) => formik.setFieldValue("phone", e.detail.value)}
        />
        {formik.errors.phone && (
          <IonText color="danger" className="ion-padding-start">
            <small>{formik.errors.phone}</small>
          </IonText>
        )}

        {/* Botones de acción */}
        <div className="button-row">
          <IonButton
            expand="block"
            fill="outline"
            onClick={() => history.goBack()}
            disabled={isSubmitting}
          >
            <IonIcon icon={arrowBackOutline} slot="start" />
            Cancelar
          </IonButton>

          <IonButton
            expand="block"
            onClick={() => formik.handleSubmit()}
            disabled={isSubmitting}
          >
            {isSubmitting
              ? "Procesando..."
              : id
              ? "Actualizar Cliente"
              : "Registrar Cliente"}
            <IonIcon icon={checkmarkOutline} slot="end" />
          </IonButton>
        </div>
      </IonContent>

      {/* Modal de éxito */}
      <IonModal isOpen={showSuccessModal} className="success-modal">
        <div className="modal-content">
          <IonIcon
            icon={checkmarkOutline}
            color="success"
            style={{ fontSize: "3rem", marginBottom: "16px" }}
          />
          <h2 className="modal-title">
            {id ? "¡Actualización exitosa!" : "¡Registro exitoso!"}
          </h2>
          <p className="modal-message">
            {id
              ? "El cliente ha sido actualizado correctamente."
              : "El cliente ha sido registrado correctamente."}
          </p>
          <div className="modal-buttons">
            <IonButton
              expand="block"
              onClick={() => {
                setShowSuccessModal(false);
                history.push("/clients");
              }}
            >
              Aceptar
            </IonButton>
          </div>
        </div>
      </IonModal>
    </IonPage>
  );
}
