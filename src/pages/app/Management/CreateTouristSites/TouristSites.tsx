import {
  IonInput,
  IonButton,
  IonPage,
  IonContent,
  IonItem,
  IonIcon,
  IonSelect,
  IonSelectOption,
  IonTextarea,
  IonText,
  IonModal,
  IonImg,
  useIonToast,
  IonLabel,
  IonLoading,
} from "@ionic/react";
import { useFormik } from "formik";
import { useHistory, useParams } from "react-router-dom";
import "./TouristSites.scss";
import { initialValues, validationSchema } from "./TouristSites.form";
import { useState, useEffect } from "react";
import {
  locationOutline,
  timeOutline,
  cashOutline,
  callOutline,
  imageOutline,
  earthOutline,
  ticketOutline,
  checkmarkOutline,
  readerOutline,
  homeOutline,
} from "ionicons/icons";
import CustomHeader from "../../../../components/Header/CustomHeader";
import {
  createTouristSite,
  updateTouristSite,
  fetchTouristSiteById,
} from "../../../../services/touristSiteService";

export function TouristSite() {
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
          await updateTouristSite(parseInt(id), {
            ...values,
            price: values.price == null ? 0 : values.price,
          });
          present({
            message: "Sitio turístico actualizado correctamente",
            duration: 3000,
            position: "top",
            color: "success",
          });
        } else {
          // Modo creación
          await createTouristSite({
            ...values,
            price: values.price == null ? 0 : values.price,
          });
          present({
            message: "Sitio turístico creado correctamente",
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
      const loadSiteData = async () => {
        try {
          const siteData = await fetchTouristSiteById(parseInt(id));
          formik.setValues({
            status: siteData.status ?? true,
            title: siteData.title,
            description: siteData.description,
            type: siteData.type,
            imageUrl: siteData.imageUrl,
            location: siteData.location,
            schedule: siteData.schedule,
            price: siteData.price,
            contact: siteData.contact,
          });
        } catch (error) {
          present({
            message: "Error al cargar los datos del sitio",
            duration: 3000,
            position: "top",
            color: "danger",
          });
          history.push("/tourist-sites");
        } finally {
          setIsLoading(false);
        }
      };

      loadSiteData();
    }
  }, [id]);

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        formik.setFieldValue("imageUrl", e.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <IonPage>
      <CustomHeader
        pageName={id ? "Editar Sitio Turístico" : "Sitio Turístico"}
        showMenuButton={true}
        showLogoutButton={true}
      />

      <IonContent class="tourist-site-registration ion-padding">
        <IonLoading isOpen={isLoading} message="Cargando datos..." />

        <h2>{id ? "Editar Sitio Turístico" : "Registro de Sitio Turístico"}</h2>

        {/* Título */}
        <IonItem className="custom-item">
          <IonIcon icon={homeOutline} slot="start" className="custom-icon" />
          <IonLabel>Título</IonLabel>
        </IonItem>
        <IonInput
          value={formik.values.title}
          placeholder="Ingrese el título del sitio turístico"
          onIonChange={(e) => formik.setFieldValue("title", e.detail.value)}
        />
        {formik.errors.title && (
          <IonText className="error">{formik.errors.title}</IonText>
        )}

        {/* Descripción */}
        <IonItem className="custom-item">
          <IonIcon icon={readerOutline} slot="start" className="custom-icon" />
          <IonLabel>Descripción</IonLabel>
        </IonItem>
        <IonTextarea
          value={formik.values.description}
          placeholder="Ingrese una descripción detallada del sitio"
          rows={4}
          onIonChange={(e) =>
            formik.setFieldValue("description", e.detail.value)
          }
        />
        {formik.errors.description && (
          <IonText className="error">{formik.errors.description}</IonText>
        )}

        {/* Tipo de sitio */}
        <IonItem className="custom-item">
          <IonIcon icon={earthOutline} slot="start" className="custom-icon" />
          <IonLabel position="stacked">Tipo de Sitio</IonLabel>
          <IonSelect
            interface="alert"
            placeholder="Seleccione el tipo de sitio"
            value={formik.values.type}
            onIonChange={(e) => formik.setFieldValue("type", e.detail.value)}
          >
            <IonSelectOption value="lugar">Lugar turístico</IonSelectOption>
            <IonSelectOption value="museo">Museo</IonSelectOption>
            <IonSelectOption value="parque">Parque</IonSelectOption>
            <IonSelectOption value="restaurante">Restaurante</IonSelectOption>
            <IonSelectOption value="hotel">Hotel</IonSelectOption>
          </IonSelect>
        </IonItem>
        {formik.errors.type && (
          <IonText className="error">{formik.errors.type}</IonText>
        )}

        {/* Imagen */}
        <IonItem className="custom-item">
          <IonIcon icon={imageOutline} slot="start" className="custom-icon" />
          <IonLabel>URL de la Imagen</IonLabel>
        </IonItem>
        <IonInput
          type="url"
          value={formik.values.imageUrl}
          placeholder="Ingrese la URL de la imagen"
          onIonChange={(e) => formik.setFieldValue("imageUrl", e.detail.value)}
        />
        {formik.errors.imageUrl && (
          <IonText className="error">{formik.errors.imageUrl}</IonText>
        )}

        {/* Alternativa: Subir imagen desde dispositivo 
        <input
          type="file"
          id="imageUpload"
          accept="image/*"
          onChange={handleImageUpload}
          style={{ display: "none" }}
        />
        <IonButton
          expand="block"
          fill="outline"
          className="upload-button"
          onClick={() => document.getElementById("imageUpload")?.click()}
        >
          <IonIcon icon={imageOutline} slot="start" />
          Subir imagen
        </IonButton>
        */}

        {/* Vista previa de la imagen */}
        {formik.values.imageUrl && (
          <IonImg
            src={formik.values.imageUrl}
            className="image-preview"
            alt="Vista previa de la imagen del sitio"
          />
        )}

        {/* Ubicación */}
        <IonItem className="custom-item">
          <IonIcon
            icon={locationOutline}
            slot="start"
            className="custom-icon"
          />
          <IonLabel>Ubicación</IonLabel>
        </IonItem>
        <IonInput
          value={formik.values.location}
          placeholder="Ingrese la ubicación del sitio"
          onIonChange={(e) => formik.setFieldValue("location", e.detail.value)}
        />
        {formik.errors.location && (
          <IonText className="error">{formik.errors.location}</IonText>
        )}

        {/* Horario */}
        <IonItem className="custom-item">
          <IonIcon icon={timeOutline} slot="start" className="custom-icon" />
          <IonLabel>Horario</IonLabel>
        </IonItem>
        <IonInput
          value={formik.values.schedule}
          placeholder="Ej: Abierto de 8:00 AM a 5:00 PM"
          onIonChange={(e) => formik.setFieldValue("schedule", e.detail.value)}
        />
        {formik.errors.schedule && (
          <IonText className="error">{formik.errors.schedule}</IonText>
        )}

        {/* Precio */}
        <IonItem className="custom-item">
          <IonIcon icon={cashOutline} slot="start" className="custom-icon" />
          <IonLabel>Precio (COP)</IonLabel>
        </IonItem>
        <IonInput
          type="number"
          value={formik.values.price}
          placeholder="Ingrese el precio de entrada"
          onIonChange={(e) => formik.setFieldValue("price", e.detail.value)}
        />
        {formik.errors.price && (
          <IonText className="error">{formik.errors.price}</IonText>
        )}

        {/* Contacto */}
        <IonItem className="custom-item">
          <IonIcon icon={callOutline} slot="start" className="custom-icon" />
          <IonLabel>Contacto</IonLabel>
        </IonItem>
        <IonInput
          value={formik.values.contact}
          placeholder="Ingrese información de contacto"
          onIonChange={(e) => formik.setFieldValue("contact", e.detail.value)}
        />
        {formik.errors.contact && (
          <IonText className="error">{formik.errors.contact}</IonText>
        )}

        {/* Botones de acción */}
        <div className="button-row">
          <IonButton
            expand="block"
            fill="outline"
            onClick={() => history.goBack()}
            disabled={isSubmitting}
          >
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
              ? "Actualizar Sitio"
              : "Registrar Sitio"}
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
              ? "El sitio turístico ha sido actualizado correctamente."
              : "El sitio turístico ha sido registrado correctamente."}
          </p>
          <div className="modal-buttons">
            <IonButton
              expand="block"
              onClick={() => {
                setShowSuccessModal(false);
                history.push("/tourist-sites");
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
