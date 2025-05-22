import {
  IonContent,
  IonRefresher,
  IonRefresherContent,
  useIonToast,
  IonGrid,
  IonRow,
  IonCol,
  IonCard,
  IonCardHeader,
  IonCardTitle,
  IonCardSubtitle,
  IonCardContent,
  IonImg,
  IonButton,
  IonIcon,
  IonLabel,
  IonItem,
  IonBadge,
} from "@ionic/react";
import {
  chevronDownOutline,
  chevronUpOutline,
  peopleOutline,
  locationOutline,
  calendarOutline,
  arrowForwardOutline,
  addOutline,
  cashOutline,
} from "ionicons/icons";
import { RefresherEventDetail } from "@ionic/core";
import { useState, useEffect } from "react";
import "./Dashboard.scss";

import { useHistory } from "react-router-dom";
import { fetchClients } from "../../../services/clientService";
import { fetchTouristSites } from "../../../services/touristSiteService";
import { fetchReservations } from "../../../services/reservationService";
import { fetchFacturas } from "../../../services/facturaService";

interface SummaryCardProps {
  title: string;
  icon: string;
  count: number;
  color: string;
  children: React.ReactNode;
  onViewAll?: () => void;
  onCreateNew?: () => void;
}

const SummaryCard: React.FC<SummaryCardProps> = ({
  title,
  icon,
  count,
  color,
  children,
  onViewAll,
  onCreateNew,
}) => {
  const [isExpanded, setIsExpanded] = useState(true);
  const history = useHistory();

  return (
    <IonCard style={{ borderLeft: `4px solid ${color}` }}>
      <IonItem
        button
        detail={false}
        lines="none"
        onClick={() => setIsExpanded(!isExpanded)}
        style={{ "--background": "transparent" }}
      >
        <IonIcon slot="start" icon={icon} style={{ color }} />
        <IonLabel style={{ fontWeight: "bold" }}>{title}</IonLabel>
        <IonBadge color="light" style={{ color, marginRight: "8px" }}>
          {count}
        </IonBadge>
        <IonIcon
          icon={isExpanded ? chevronUpOutline : chevronDownOutline}
          slot="end"
          color="medium"
        />
      </IonItem>

      {isExpanded && (
        <>
          <IonCardContent>{children}</IonCardContent>

          <IonGrid>
            <IonRow className="ion-justify-content-end">
              <IonCol size="auto">
                <IonButton fill="clear" size="small" onClick={onViewAll}>
                  <IonIcon slot="start" icon={arrowForwardOutline} />
                  Ver todos
                </IonButton>
              </IonCol>
              <IonCol size="auto">
                <IonButton
                  fill="solid"
                  size="small"
                  color={color}
                  onClick={onCreateNew}
                >
                  <IonIcon slot="start" icon={addOutline} />
                  Nuevo
                </IonButton>
              </IonCol>
            </IonRow>
          </IonGrid>
        </>
      )}
    </IonCard>
  );
};

export const Dashboard: React.FC = () => {
  const [present] = useIonToast();
  const history = useHistory();
  const [clients, setClients] = useState<any[]>([]);
  const [sites, setSites] = useState<any[]>([]);
  const [reservations, setReservations] = useState<any[]>([]);
  const [facturas, setFacturas] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const loadData = async () => {
    try {
      const [clientsData, sitesData, reservationsData, facturasData] =
        await Promise.all([
          fetchClients(),
          fetchTouristSites(),
          fetchReservations(),
          fetchFacturas(),
        ]);

      setClients(clientsData.slice(0, 3));
      setSites(sitesData.slice(0, 3));
      setReservations(reservationsData.slice(0, 3));
      setFacturas(facturasData.slice(0, 3));
    } catch (error) {
      console.error("Error loading data:", error);
      present({
        message: "Error al cargar los datos",
        duration: 2000,
        position: "top",
        color: "danger",
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleRefresh = (event: CustomEvent<RefresherEventDetail>) => {
    loadData().then(() => {
      event.detail.complete();
      present({
        message: "Datos actualizados",
        duration: 1500,
        position: "top",
      });
    });
  };

  const formatDate = (dateString: string) => {
    const options: Intl.DateTimeFormatOptions = {
      year: "numeric",
      month: "short",
      day: "numeric",
    };
    return new Date(dateString).toLocaleDateString("es-ES", options);
  };

  return (
    <IonContent fullscreen className="dashboard-page">
      <IonRefresher slot="fixed" onIonRefresh={handleRefresh}>
        <IonRefresherContent></IonRefresherContent>
      </IonRefresher>

      <div className="welcome-section">
        <h2>Bienvenido al Sistema</h2>
        <p>Resumen de actividades y registros recientes</p>
      </div>

      <div className="summary-container">
        <SummaryCard
          title="Clientes"
          icon={peopleOutline}
          count={clients.length}
          color="#3A8EBA"
          onViewAll={() => history.push("/clients")}
          onCreateNew={() => history.push("/create-client")}
        >
          {clients.map((client) => (
            <IonItem
              key={client.id}
              button
              detail={false}
              onClick={() => history.push(`/client/${client.id}`)}
            >
              <IonLabel>
                <h3>{client.fullName}</h3>
                <p>{client.phone}</p>
              </IonLabel>
              <IonLabel slot="end" className="ion-text-end">
                <p>
                  {formatDate(client.createdAt || new Date().toISOString())}
                </p>
              </IonLabel>
            </IonItem>
          ))}
        </SummaryCard>

        <SummaryCard
          title="Sitios Turísticos"
          icon={locationOutline}
          count={sites.length}
          color="#10B981"
          onViewAll={() => history.push("/tourist-sites")}
          onCreateNew={() => history.push("/create-touristsite")}
        >
          {sites.map((site) => (
            <IonItem
              key={site.id}
              button
              detail={false}
              onClick={() => history.push(`/tourist-site/${site.id}`)}
            >
              <IonLabel>
                <h3>{site.title}</h3>
                <p>{site.location}</p>
              </IonLabel>
              <IonBadge slot="end" color="light">
                {site.type}
              </IonBadge>
            </IonItem>
          ))}
        </SummaryCard>

        <SummaryCard
          title="Reservaciones"
          icon={calendarOutline}
          count={reservations.length}
          color="#F59E0B"
          onViewAll={() => history.push("/reservations")}
          onCreateNew={() => history.push("/create-reservation")}
        >
          {reservations.map((reservation) => (
            <IonItem
              key={reservation.id}
              button
              detail={false}
              onClick={() => history.push(`/reservation/${reservation.id}`)}
            >
              <IonLabel>
                <h3>#{reservation.id}</h3>
                <p>{reservation.cliente?.fullName || "Cliente"}</p>
              </IonLabel>
              <IonLabel slot="end" className="ion-text-end">
                <p>{formatDate(reservation.fecha)}</p>
                <IonBadge color={reservation.status ? "success" : "warning"}>
                  {reservation.status ? "Confirmada" : "Pendiente"}
                </IonBadge>
              </IonLabel>
            </IonItem>
          ))}
        </SummaryCard>

        {/* Nueva Card de Facturas */}
        <SummaryCard
          title="Facturas"
          icon={cashOutline}
          count={facturas.length}
          color="#00d47e"
          onViewAll={() => history.push("/facturas")}
          onCreateNew={() => history.push("/create-factura")}
        >
          {facturas.map((factura) => (
            <IonItem
              key={factura.id}
              button
              detail={false}
              onClick={() => history.push(`/factura/${factura.id}`)}
            >
              <IonLabel>
                <h3>#{factura.id}</h3>
                <p>{factura.descripcion || "Factura sin descripción"}</p>
              </IonLabel>
              <IonLabel slot="end" className="ion-text-end">
                <p>{formatDate(factura.fecha || new Date().toISOString())}</p>
                <IonBadge color={getStatusColor(factura.estadoPago)}>
                  {factura.estadoPago || "Pendiente"}
                </IonBadge>
              </IonLabel>
            </IonItem>
          ))}
        </SummaryCard>
      </div>
    </IonContent>
  );
};
// Función auxiliar para determinar el color del badge según el estado de pago
const getStatusColor = (estadoPago: string) => {
  switch (estadoPago?.toLowerCase()) {
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
