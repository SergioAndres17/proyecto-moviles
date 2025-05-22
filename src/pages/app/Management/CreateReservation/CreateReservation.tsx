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
  IonDatetime,
  IonLabel,
  useIonToast,
  IonPopover,
  IonSearchbar,
  IonList,
  IonAvatar,
  IonImg,
  IonLoading,
} from "@ionic/react";
import { useFormik } from "formik";
import { useHistory, useParams } from "react-router-dom";
import "./CreateReservation.scss";
import { useEffect, useState } from "react";
import {
  calendarOutline,
  timeOutline,
  peopleOutline,
  documentTextOutline,
  ticketOutline,
  checkmarkOutline,
  personOutline,
  locationOutline,
} from "ionicons/icons";
import CustomHeader from "../../../../components/Header/CustomHeader";
import { fetchClients, Client } from "../../../../services/clientService";
import {
  fetchTouristSites,
  TouristSite,
} from "../../../../services/touristSiteService";
import { initialValues, validationSchema } from "./CreateReservation.form";
import {
  createReservation,
  updateReservation,
  fetchReservationById,
} from "../../../../services/reservationService";

export function CreateReservation() {
  const history = useHistory();
  const { id } = useParams<{ id?: string }>();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [isLoading, setIsLoading] = useState(!!id);
  const [present] = useIonToast();

  // Estados para clientes y sitios turísticos
  const [clients, setClients] = useState<Client[]>([]);
  const [touristSites, setTouristSites] = useState<TouristSite[]>([]);
  const [filteredClients, setFilteredClients] = useState<Client[]>([]);
  const [filteredTouristSites, setFilteredTouristSites] = useState<
    TouristSite[]
  >([]);
  const [showClientSearch, setShowClientSearch] = useState(false);
  const [showSiteSearch, setShowSiteSearch] = useState(false);
  const [clientSearchTerm, setClientSearchTerm] = useState("");
  const [siteSearchTerm, setSiteSearchTerm] = useState("");

  // Cargar clientes y sitios turísticos al iniciar
  useEffect(() => {
    const loadData = async () => {
      try {
        const clientsData = await fetchClients();
        const sitesData = await fetchTouristSites();
        setClients(clientsData);
        setFilteredClients(clientsData);
        setTouristSites(sitesData);
        setFilteredTouristSites(sitesData);
      } catch (error) {
        present({
          message: "Error cargando datos",
          duration: 3000,
          position: "top",
          color: "danger",
        });
      }
    };
    loadData();
  }, []);

  // Filtrar clientes
  useEffect(() => {
    if (clientSearchTerm) {
      setFilteredClients(
        clients.filter(
          (client) =>
            client.fullName
              .toLowerCase()
              .includes(clientSearchTerm.toLowerCase()) ||
            client.documentNumber.includes(clientSearchTerm)
        )
      );
    } else {
      setFilteredClients(clients);
    }
  }, [clientSearchTerm, clients]);

  // Filtrar sitios turísticos
  useEffect(() => {
    if (siteSearchTerm) {
      setFilteredTouristSites(
        touristSites.filter((site) =>
          site.title.toLowerCase().includes(siteSearchTerm.toLowerCase())
        )
      );
    } else {
      setFilteredTouristSites(touristSites);
    }
  }, [siteSearchTerm, touristSites]);

  const formik = useFormik({
    initialValues: initialValues(),
    validationSchema: validationSchema(),
    validateOnChange: false,
    onSubmit: async (values) => {
      setIsSubmitting(true);

      try {
        // Formatear datos para la API
        const formattedData = {
          ...values,
          fecha: values.fecha.split("T")[0],
          hora: values.hora.includes("T")
            ? values.hora.split("T")[1].split(".")[0]
            : values.hora,
          user: {
            id: 1, // ID del usuario autenticado
          },
        };

        if (id) {
          // Modo edición
          await updateReservation(parseInt(id), formattedData);
          present({
            message: "Reservación actualizada correctamente",
            duration: 3000,
            position: "top",
            color: "success",
          });
        } else {
          // Modo creación
          await createReservation(formattedData);
          present({
            message: "Reservación creada correctamente",
            duration: 3000,
            position: "top",
            color: "success",
          });
        }

        setShowSuccessModal(true);
      } catch (error: any) {
        present({
          message: error.message || "Error al procesar la reservación",
          duration: 5000,
          position: "top",
          color: "danger",
        });
      } finally {
        setIsSubmitting(false);
      }
    },
  });

  // Cargar datos iniciales
  useEffect(() => {
    const loadData = async () => {
      try {
        const [clientsData, sitesData] = await Promise.all([
          fetchClients(),
          fetchTouristSites(),
        ]);

        setClients(clientsData);
        setFilteredClients(clientsData);
        setTouristSites(sitesData);
        setFilteredTouristSites(sitesData);

        // Si hay ID, cargar datos de la reservación
        if (id) {
          const reservationData = await fetchReservationById(parseInt(id));
          formik.setValues({
            fecha: `${reservationData.fecha}T00:00:00`, // Formatear para el datetime
            hora: `2000-01-01T${reservationData.hora}`, // Formatear para el datetime
            numeroPersonas: reservationData.numeroPersonas,
            observaciones: reservationData.observaciones,
            tipoReserva: reservationData.tipoReserva,
            status: reservationData.status ?? true,
            user: { id: reservationData.user?.id ?? 1 },
            cliente: { id: reservationData.cliente?.id },
            sitioTuristico: { id: reservationData.sitioTuristico?.id },
          });
        }
      } catch (error) {
        present({
          message: "Error cargando datos",
          duration: 3000,
          position: "top",
          color: "danger",
        });
        if (id) history.push("/reservations");
      } finally {
        setIsLoading(false);
      }
    };

    loadData();
  }, [id]);

  // Filtrar clientes
  useEffect(() => {
    if (clientSearchTerm) {
      setFilteredClients(
        clients.filter(
          (client) =>
            client.fullName
              .toLowerCase()
              .includes(clientSearchTerm.toLowerCase()) ||
            client.documentNumber.includes(clientSearchTerm)
        )
      );
    } else {
      setFilteredClients(clients);
    }
  }, [clientSearchTerm, clients]);

  // Filtrar sitios turísticos
  useEffect(() => {
    if (siteSearchTerm) {
      setFilteredTouristSites(
        touristSites.filter((site) =>
          site.title.toLowerCase().includes(siteSearchTerm.toLowerCase())
        )
      );
    } else {
      setFilteredTouristSites(touristSites);
    }
  }, [siteSearchTerm, touristSites]);

  // Formatear fecha para mostrar
  const formatDisplayDate = (dateString: string) => {
    if (!dateString) return "Seleccione fecha";
    const date = new Date(dateString);
    return date.toLocaleDateString("es-ES");
  };

  // Formatear hora para mostrar
  const formatDisplayTime = (timeString: string) => {
    if (!timeString) return "Seleccione hora";
    const time = timeString.includes("T")
      ? timeString.split("T")[1].substring(0, 5)
      : timeString.substring(0, 5);
    return time;
  };

  return (
    <IonPage>
      <CustomHeader
        pageName={id ? "Editar Reservación" : "Reservación"}
        showMenuButton={true}
        showLogoutButton={true}
      />

      <IonContent class="create-reservation ion-padding">
        <IonLoading isOpen={isLoading} message="Cargando datos..." />

        <h2>{id ? "Editar Reservación" : "Registro de reservaciones"}</h2>

        {/* Fecha */}
        <IonItem className="custom-item" button id="open-date-picker">
          <IonIcon
            icon={calendarOutline}
            slot="start"
            className="custom-icon"
          />
          <IonLabel>Fecha</IonLabel>
          <IonLabel
            slot="end"
            className={formik.values.fecha ? "selected-value" : ""}
          >
            {formatDisplayDate(formik.values.fecha)}
          </IonLabel>
        </IonItem>
        <IonPopover trigger="open-date-picker" size="auto">
          <IonDatetime
            presentation="date"
            value={formik.values.fecha}
            onIonChange={(e) => formik.setFieldValue("fecha", e.detail.value)}
            min={new Date().toISOString()}
            locale="es-ES"
          />
        </IonPopover>
        {formik.errors.fecha && (
          <IonText className="error">{formik.errors.fecha}</IonText>
        )}

        {/* Hora */}
        <IonItem className="custom-item" button id="open-time-picker">
          <IonIcon icon={timeOutline} slot="start" className="custom-icon" />
          <IonLabel>Hora</IonLabel>
          <IonLabel
            slot="end"
            className={formik.values.hora ? "selected-value" : ""}
          >
            {formatDisplayTime(formik.values.hora)}
          </IonLabel>
        </IonItem>
        <IonPopover trigger="open-time-picker" size="auto">
          <IonDatetime
            presentation="time"
            value={formik.values.hora}
            onIonChange={(e) => formik.setFieldValue("hora", e.detail.value)}
            locale="es-ES"
          />
        </IonPopover>
        {formik.errors.hora && (
          <IonText className="error">{formik.errors.hora}</IonText>
        )}

        {/* Número de Personas */}
        <IonItem className="custom-item">
          <IonIcon icon={peopleOutline} slot="start" className="custom-icon" />
          <IonLabel>Número de Personas</IonLabel>
        </IonItem>
        <IonInput
          type="number"
          value={formik.values.numeroPersonas}
          placeholder="Ingrese el número de personas"
          onIonChange={(e) =>
            formik.setFieldValue("numeroPersonas", e.detail.value)
          }
        />
        {formik.errors.numeroPersonas && (
          <IonText className="error">{formik.errors.numeroPersonas}</IonText>
        )}

        {/* Tipo de Reserva */}
        <IonItem className="custom-item" lines="full">
          <IonIcon icon={ticketOutline} slot="start" className="custom-icon" />
          <IonLabel position="stacked">Tipo de Reserva</IonLabel>
          <IonSelect
            interface="alert"
            placeholder="Seleccione el tipo de reserva"
            value={formik.values.tipoReserva}
            onIonChange={(e) =>
              formik.setFieldValue("tipoReserva", e.detail.value)
            }
          >
            <IonSelectOption value="Servicio de viaje">
              Servicio de viaje
            </IonSelectOption>
            <IonSelectOption value="Tour guiado">Tour guiado</IonSelectOption>
            <IonSelectOption value="Paquete turístico">
              Paquete turístico
            </IonSelectOption>
            <IonSelectOption value="Hospedaje">Hospedaje</IonSelectOption>
          </IonSelect>
        </IonItem>
        {formik.errors.tipoReserva && (
          <IonText className="error">{formik.errors.tipoReserva}</IonText>
        )}

        {/* Selector de Cliente */}
        <IonItem
          className="custom-item"
          button
          onClick={() => setShowClientSearch(true)}
        >
          <IonIcon icon={personOutline} slot="start" className="custom-icon" />
          <IonLabel>Cliente</IonLabel>
          <IonLabel
            slot="end"
            color={formik.values.cliente.id ? undefined : "medium"}
          >
            {formik.values.cliente.id
              ? clients.find((c) => c.id === formik.values.cliente.id)
                  ?.fullName || `ID: ${formik.values.cliente.id}`
              : "Seleccione cliente"}
          </IonLabel>
        </IonItem>
        {formik.errors.cliente?.id && (
          <IonText className="error">{formik.errors.cliente.id}</IonText>
        )}

        {/* Modal de búsqueda de clientes */}
        <IonModal
          isOpen={showClientSearch}
          onDidDismiss={() => {
            setShowClientSearch(false);
            setClientSearchTerm("");
          }}
          className="search-modal"
        >
          <IonContent>
            <IonSearchbar
              value={clientSearchTerm}
              onIonChange={(e) => setClientSearchTerm(e.detail.value || "")}
              placeholder="Buscar cliente..."
            />
            <IonList>
              {filteredClients.map((client) => (
                <IonItem
                  key={client.id}
                  button
                  detail={false}
                  onClick={() => {
                    formik.setFieldValue("cliente.id", client.id);
                    setShowClientSearch(false);
                  }}
                >
                  <IonLabel>
                    <h2>{client.fullName}</h2>
                    <p>
                      {client.documentType}: {client.documentNumber}
                    </p>
                  </IonLabel>
                </IonItem>
              ))}
            </IonList>
          </IonContent>
        </IonModal>

        {/* Selector de Sitio Turístico */}
        <IonItem
          className="custom-item"
          button
          onClick={() => setShowSiteSearch(true)}
        >
          <IonIcon
            icon={locationOutline}
            slot="start"
            className="custom-icon"
          />
          <IonLabel>Sitio Turístico</IonLabel>
          <IonLabel
            slot="end"
            color={formik.values.sitioTuristico.id ? undefined : "medium"}
          >
            {formik.values.sitioTuristico.id
              ? touristSites.find(
                  (s) => s.id === formik.values.sitioTuristico.id
                )?.title || `ID: ${formik.values.sitioTuristico.id}`
              : "Seleccione sitio"}
          </IonLabel>
        </IonItem>
        {formik.errors.sitioTuristico?.id && (
          <IonText className="error">{formik.errors.sitioTuristico.id}</IonText>
        )}

        {/* Modal de búsqueda de sitios turísticos */}
        <IonModal
          isOpen={showSiteSearch}
          onDidDismiss={() => {
            setShowSiteSearch(false);
            setSiteSearchTerm("");
          }}
          className="search-modal"
        >
          <IonContent>
            <IonSearchbar
              value={siteSearchTerm}
              onIonChange={(e) => setSiteSearchTerm(e.detail.value || "")}
              placeholder="Buscar sitio turístico..."
            />
            <IonList>
              {filteredTouristSites.map((site) => (
                <IonItem
                  key={site.id}
                  button
                  detail={false}
                  onClick={() => {
                    formik.setFieldValue("sitioTuristico.id", site.id);
                    setShowSiteSearch(false);
                  }}
                >
                  {site.imageUrl && (
                    <IonAvatar slot="start">
                      <IonImg src={site.imageUrl} />
                    </IonAvatar>
                  )}
                  <IonLabel>
                    <h2>{site.title}</h2>
                    <p>{site.location}</p>
                  </IonLabel>
                </IonItem>
              ))}
            </IonList>
          </IonContent>
        </IonModal>

        {/* Observaciones */}
        <IonItem className="custom-item">
          <IonIcon
            icon={documentTextOutline}
            slot="start"
            className="custom-icon"
          />
          <IonLabel>Observaciones</IonLabel>
        </IonItem>
        <IonTextarea
          value={formik.values.observaciones}
          placeholder="Ingrese observaciones adicionales"
          rows={4}
          onIonChange={(e) =>
            formik.setFieldValue("observaciones", e.detail.value)
          }
        />
        {formik.errors.observaciones && (
          <IonText className="error">{formik.errors.observaciones}</IonText>
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
              ? "Actualizar Reservación"
              : "Crear Reservación"}
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
            {id ? "¡Actualización exitosa!" : "¡Reservación creada!"}
          </h2>
          <p className="modal-message">
            {id
              ? "La reservación ha sido actualizada correctamente."
              : "La reservación ha sido creada correctamente."}
          </p>
          <div className="modal-buttons">
            <IonButton
              expand="block"
              onClick={() => {
                setShowSuccessModal(false);
                history.push("/reservations");
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
