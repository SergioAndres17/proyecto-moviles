import {
  IonItem,
  IonLabel,
  IonBadge,
  IonButton,
  IonIcon,
  IonButtons,
} from "@ionic/react";
import {
  createOutline,
  trashOutline,
  calendarOutline,
  peopleOutline,
  locationOutline,
} from "ionicons/icons";
import "../DataViews.scss";
import { Reservation } from "../../../../services/reservationService";

interface ReservationItemProps {
  reservation: Reservation;
  onEdit: (id: number) => void;
  onDelete: (id: number) => void;
}

export const ReservationItem: React.FC<ReservationItemProps> = ({
  reservation,
  onEdit,
  onDelete,
}) => {
  const formatDateTime = (fecha: string, hora: string) => {
    const date = new Date(fecha);
    const time = hora.split(":").slice(0, 2).join(":");

    return (
      date.toLocaleDateString("es-ES", {
        weekday: "short",
        day: "numeric",
        month: "short",
      }) + ` · ${time}`
    );
  };

  return (
    <IonItem className="management-item">
      <div className="item-content">
        <div className="item-main-info">
          <h2>
            <IonIcon icon={calendarOutline} color="primary" />
            {formatDateTime(reservation.fecha, reservation.hora)}
          </h2>
          <p>
            <IonIcon icon={peopleOutline} color="medium" />
            {reservation.numeroPersonas} personas
          </p>
        </div>

        <div className="item-secondary-info">
          <p>
            <IonIcon icon={locationOutline} color="medium" />
            Sitio: #{reservation.sitioTuristico.id}
          </p>
          <p>Cliente: #{reservation.cliente.id}</p>
          {reservation.observaciones && <p>Obs: {reservation.observaciones}</p>}
        </div>

        <div className="item-meta">
          <IonBadge color={reservation.status ? "success" : "warning"}>
            {reservation.status ? "Confirmada" : "Pendiente"}
          </IonBadge>
          <p>{reservation.tipoReserva}</p>
        </div>
      </div>

      <IonButtons slot="end" className="item-actions">
        <IonButton fill="clear" onClick={() => onEdit(reservation.id!)}>
          <IonIcon icon={createOutline} slot="icon-only" />
        </IonButton>
        <IonButton
          fill="clear"
          color="danger"
          onClick={() => onDelete(reservation.id!)}
        >
          <IonIcon icon={trashOutline} slot="icon-only" />
        </IonButton>
      </IonButtons>
    </IonItem>
  );
};
