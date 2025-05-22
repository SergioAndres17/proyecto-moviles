import {
  IonItem,
  IonLabel,
  IonBadge,
  IonButton,
  IonIcon,
  IonButtons,
  IonText,
} from "@ionic/react";
import {
  createOutline,
  trashOutline,
  receiptOutline,
  cardOutline,
  calendarOutline,
} from "ionicons/icons";
import "../DataViews.scss";
import { Factura } from "../../../../services/facturaService";

interface FacturaItemProps {
  factura: Factura;
  onEdit: (id: number) => void;
  onDelete: (id: number) => void;
}

export const FacturaItem: React.FC<FacturaItemProps> = ({
  factura,
  onEdit,
  onDelete,
}) => {
  const getEstadoColor = (estado: string) => {
    switch (estado?.toLowerCase()) {
      case "pagado":
        return "success";
      case "pendiente":
        return "warning";
      case "cancelado":
        return "danger";
      default:
        return "medium";
    }
  };

  return (
    <IonItem className="management-item">
      <div className="item-content">
        <div className="item-main-info">
          <h2>
            <IonIcon icon={receiptOutline} color="primary" />
            Factura #{factura.id}
          </h2>
          <IonText color="medium">
            <p>
              <IonIcon icon={calendarOutline} />
              Reserva: #{factura.reservacion.id}
            </p>
          </IonText>
        </div>

        <div className="item-secondary-info">
          <p>{factura.descripcion || "Sin descripción"}</p>
        </div>

        <div className="item-meta">
          <IonBadge color={getEstadoColor(factura.estadoPago)}>
            {factura.estadoPago}
          </IonBadge>
          <p>
            <IonIcon icon={cardOutline} />
            {factura.metodoPago}
          </p>
        </div>
      </div>

      <IonButtons slot="end" className="item-actions">
        <IonButton fill="clear" onClick={() => onEdit(factura.id!)}>
          <IonIcon icon={createOutline} slot="icon-only" />
        </IonButton>
        <IonButton
          fill="clear"
          color="danger"
          onClick={() => onDelete(factura.id!)}
        >
          <IonIcon icon={trashOutline} slot="icon-only" />
        </IonButton>
      </IonButtons>
    </IonItem>
  );
};
