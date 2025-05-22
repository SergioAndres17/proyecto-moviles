import {
  IonContent,
  IonHeader,
  IonPage,
  IonTitle,
  IonToolbar,
  IonSearchbar,
  IonList,
  IonRefresher,
  IonRefresherContent,
  useIonToast,
  IonButton,
  IonIcon,
  useIonAlert,
  IonLoading,
  IonSegment,
  IonSegmentButton,
  IonLabel,
} from "@ionic/react";
import { addOutline } from "ionicons/icons";
import { RefresherEventDetail } from "@ionic/core";
import { useState, useEffect } from "react";
import { useHistory } from "react-router-dom";
import CustomHeader from "../../../../components/Header/CustomHeader";

import { ReservationItem } from "./ReservationItem";
import "../DataViews.scss";
import {
  fetchReservations,
  deleteReservation,
  Reservation,
} from "../../../../services/reservationService";

export const ReservationsPage: React.FC = () => {
  const [reservations, setReservations] = useState<Reservation[]>([]);
  const [filteredReservations, setFilteredReservations] = useState<
    Reservation[]
  >([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [present] = useIonToast();
  const [presentAlert] = useIonAlert();
  const history = useHistory();

  const loadReservations = async () => {
    try {
      setLoading(true);
      const data = await fetchReservations();
      setReservations(data);
      applyFilters(data, searchTerm, statusFilter);
    } catch (error) {
      console.error("Error loading reservations:", error);
      present({
        message: "Error al cargar las reservaciones",
        duration: 2000,
        position: "top",
        color: "danger",
      });
    } finally {
      setLoading(false);
    }
  };

  const applyFilters = (data: Reservation[], term: string, status: string) => {
    let filtered = data;

    // Filtrar por término de búsqueda
    if (term.trim() !== "") {
      filtered = filtered.filter(
        (reservation) =>
          reservation.fecha?.includes(term) ||
          reservation.hora?.includes(term) ||
          reservation.tipoReserva?.toLowerCase().includes(term.toLowerCase()) ||
          reservation.observaciones
            ?.toLowerCase()
            .includes(term.toLowerCase()) ||
          reservation.cliente.id.toString().includes(term) ||
          reservation.sitioTuristico.id.toString().includes(term)
      );
    }

    // Filtrar por estado
    if (status !== "all") {
      const statusBool = status === "confirmed";
      filtered = filtered.filter(
        (reservation) => reservation.status === statusBool
      );
    }

    setFilteredReservations(filtered);
  };

  useEffect(() => {
    loadReservations();
  }, []);

  useEffect(() => {
    applyFilters(reservations, searchTerm, statusFilter);
  }, [searchTerm, statusFilter, reservations]);

  const handleRefresh = (event: CustomEvent<RefresherEventDetail>) => {
    loadReservations().then(() => {
      event.detail.complete();
      present({
        message: "Reservaciones actualizadas",
        duration: 1500,
        position: "top",
      });
    });
  };

  const handleEdit = (id: number) => {
    history.push(`/edit-reservation/${id}`);
  };

  const handleDelete = (id: number) => {
    presentAlert({
      header: "Confirmar eliminación",
      message: "¿Estás seguro de que deseas eliminar esta reservación?",
      buttons: [
        { text: "Cancelar", role: "cancel" },
        {
          text: "Eliminar",
          handler: async () => {
            try {
              await deleteReservation(id);
              await loadReservations();
              present({
                message: "Reservación eliminada correctamente",
                duration: 2000,
                position: "top",
                color: "success",
              });
            } catch (error) {
              present({
                message: "Error al eliminar la reservación",
                duration: 2000,
                position: "top",
                color: "danger",
              });
            }
          },
        },
      ],
    });
  };

  return (
    <IonPage>
      <CustomHeader
        pageName="Vista de Reservaciones"
        showMenuButton={true}
        showLogoutButton={true}
      />
      <IonHeader>
        <IonToolbar>
          <IonTitle>Reservaciones</IonTitle>
          <IonButton
            slot="end"
            fill="clear"
            onClick={() => history.push("/create-reservation")}
          >
            <IonIcon icon={addOutline} slot="icon-only" />
          </IonButton>
        </IonToolbar>
        <IonToolbar>
          <IonSearchbar
            value={searchTerm}
            onIonChange={(e) => setSearchTerm(e.detail.value || "")}
            placeholder="Buscar por fecha, cliente o sitio"
            debounce={300}
          />
        </IonToolbar>
        <IonToolbar>
          <IonSegment
            value={statusFilter}
            onIonChange={(e) => setStatusFilter(e.detail.value as string)}
            scrollable
          >
            <IonSegmentButton value="all">
              <IonLabel>Todas</IonLabel>
            </IonSegmentButton>
            <IonSegmentButton value="confirmed">
              <IonLabel>Confirmadas</IonLabel>
            </IonSegmentButton>
            <IonSegmentButton value="pending">
              <IonLabel>Pendientes</IonLabel>
            </IonSegmentButton>
          </IonSegment>
        </IonToolbar>
      </IonHeader>

      <IonContent fullscreen>
        <IonRefresher slot="fixed" onIonRefresh={handleRefresh}>
          <IonRefresherContent></IonRefresherContent>
        </IonRefresher>

        <IonLoading isOpen={loading} message="Cargando reservaciones..." />

        {!loading && filteredReservations.length === 0 ? (
          <div className="empty-state">
            <p>
              {searchTerm || statusFilter !== "all"
                ? "No se encontraron reservaciones que coincidan con los filtros"
                : "No hay reservaciones registradas"}
            </p>
            <IonButton
              fill="solid"
              color="primary"
              onClick={() => history.push("/create-reservation")}
            >
              Crear primera reservación
            </IonButton>
          </div>
        ) : (
          <IonList className="management-list">
            {filteredReservations.map((reservation) => (
              <ReservationItem
                key={reservation.id}
                reservation={reservation}
                onEdit={handleEdit}
                onDelete={handleDelete}
              />
            ))}
          </IonList>
        )}
      </IonContent>
    </IonPage>
  );
};
