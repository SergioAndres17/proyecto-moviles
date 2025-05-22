import {
  IonItem,
  IonLabel,
  IonBadge,
  IonButton,
  IonIcon,
  IonButtons,
  IonThumbnail,
  IonImg,
} from "@ionic/react";
import {
  createOutline,
  trashOutline,
  locationOutline,
  timeOutline,
  ticketOutline,
} from "ionicons/icons";
import "../DataViews.scss";
import { TouristSite } from "../../../../services/touristSiteService";

interface TouristSiteItemProps {
  site: TouristSite;
  onEdit: (id: number) => void;
  onDelete: (id: number) => void;
}

export const TouristSiteItem: React.FC<TouristSiteItemProps> = ({
  site,
  onEdit,
  onDelete,
}) => {
  return (
    <IonItem className="management-item">
      {site.imageUrl && (
        <IonThumbnail slot="start">
          <IonImg src={site.imageUrl} alt={site.title} />
        </IonThumbnail>
      )}

      <div className="item-content">
        <div className="item-main-info">
          <h2>{site.title}</h2>
        </div>

        <div className="item-secondary-info">
          <p>
            <IonIcon icon={locationOutline} />
            {site.location}
          </p>
          <p>
            <IonIcon icon={timeOutline} />
            {site.schedule}
          </p>
          {site.price > 0 && (
            <p>
              <IonIcon icon={ticketOutline} />${site.price.toFixed(2)}
            </p>
          )}
        </div>

        <div className="item-meta">
          <IonBadge color={site.status ? "success" : "warning"}>
            {site.status ? "Activo" : "Inactivo"}
          </IonBadge>
        </div>
      </div>

      <IonButtons slot="end" className="item-actions">
        <IonButton fill="clear" onClick={() => onEdit(site.id!)}>
          <IonIcon icon={createOutline} slot="icon-only" />
        </IonButton>
        <IonButton
          fill="clear"
          color="danger"
          onClick={() => onDelete(site.id!)}
        >
          <IonIcon icon={trashOutline} slot="icon-only" />
        </IonButton>
      </IonButtons>
    </IonItem>
  );
};
