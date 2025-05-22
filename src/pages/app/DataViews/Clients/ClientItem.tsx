import {
  IonItem,
  IonLabel,
  IonBadge,
  IonButton,
  IonIcon,
  IonButtons,
} from "@ionic/react";
import { createOutline, trashOutline } from "ionicons/icons";
import "../DataViews.scss";
import { Client } from "../../../../services/clientService";

interface ClientItemProps {
  client: Client;
  onEdit: (id: number) => void;
  onDelete: (id: number) => void;
}

export const ClientItem: React.FC<ClientItemProps> = ({
  client,
  onEdit,
  onDelete,
}) => {
  const formatDate = (dateString: string) => {
    const options: Intl.DateTimeFormatOptions = {
      year: "numeric",
      month: "short",
      day: "numeric",
    };
    return new Date(dateString).toLocaleDateString("es-ES", options);
  };

  return (
    <IonItem className="management-item">
      <div className="item-content">
        <div className="item-main-info">
          <h2>{client.fullName}</h2>
          <p>
            {client.documentType} {client.documentNumber}
          </p>
        </div>

        <div className="item-secondary-info">
          <p>{client.email}</p>
          <p>{client.phone}</p>
        </div>

        <div className="item-meta">
          <IonBadge color={client.status ? "success" : "warning"}>
            {client.status ? "Activo" : "Inactivo"}
          </IonBadge>
          {client.birthDate && <p>Nac: {formatDate(client.birthDate)}</p>}
        </div>
      </div>

      <IonButtons slot="end" className="item-actions">
        <IonButton fill="clear" onClick={() => onEdit(client.id!)}>
          <IonIcon icon={createOutline} slot="icon-only" />
        </IonButton>
        <IonButton
          fill="clear"
          color="danger"
          onClick={() => onDelete(client.id!)}
        >
          <IonIcon icon={trashOutline} slot="icon-only" />
        </IonButton>
      </IonButtons>
    </IonItem>
  );
};
