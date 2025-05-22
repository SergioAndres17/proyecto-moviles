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
import { FacturaItem } from "./FacturaItem";
import "../DataViews.scss";
import {
  fetchFacturas,
  deleteFactura,
  Factura,
} from "../../../../services/facturaService";
import CustomHeader from "../../../../components/Header/CustomHeader";

export const FacturasPage: React.FC = () => {
  const [facturas, setFacturas] = useState<Factura[]>([]);
  const [filteredFacturas, setFilteredFacturas] = useState<Factura[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [present] = useIonToast();
  const [presentAlert] = useIonAlert();
  const history = useHistory();

  const loadFacturas = async () => {
    try {
      setLoading(true);
      const data = await fetchFacturas();
      setFacturas(data);
      applyFilters(data, searchTerm, statusFilter);
    } catch (error) {
      console.error("Error loading invoices:", error);
      present({
        message: "Error al cargar las facturas",
        duration: 2000,
        position: "top",
        color: "danger",
      });
    } finally {
      setLoading(false);
    }
  };

  const applyFilters = (data: Factura[], term: string, status: string) => {
    let filtered = data;

    // Filtrar por término de búsqueda
    if (term.trim() !== "") {
      filtered = filtered.filter(
        (factura) =>
          factura.id?.toString().includes(term) ||
          factura.descripcion?.toLowerCase().includes(term.toLowerCase()) ||
          factura.reservacion.id.toString().includes(term) ||
          factura.metodoPago?.toLowerCase().includes(term.toLowerCase()) ||
          factura.estadoPago?.toLowerCase().includes(term.toLowerCase())
      );
    }

    // Filtrar por estado de pago
    if (status !== "all") {
      filtered = filtered.filter(
        (factura) => factura.estadoPago.toLowerCase() === status.toLowerCase()
      );
    }

    setFilteredFacturas(filtered);
  };

  useEffect(() => {
    loadFacturas();
  }, []);

  useEffect(() => {
    applyFilters(facturas, searchTerm, statusFilter);
  }, [searchTerm, statusFilter, facturas]);

  const handleRefresh = (event: CustomEvent<RefresherEventDetail>) => {
    loadFacturas().then(() => {
      event.detail.complete();
      present({
        message: "Facturas actualizadas",
        duration: 1500,
        position: "top",
      });
    });
  };

  const handleEdit = (id: number) => {
    history.push(`/edit-factura/${id}`);
  };

  const handleDelete = (id: number) => {
    presentAlert({
      header: "Confirmar eliminación",
      message: "¿Estás seguro de que deseas eliminar esta factura?",
      buttons: [
        { text: "Cancelar", role: "cancel" },
        {
          text: "Eliminar",
          handler: async () => {
            try {
              await deleteFactura(id);
              await loadFacturas();
              present({
                message: "Factura eliminada correctamente",
                duration: 2000,
                position: "top",
                color: "success",
              });
            } catch (error) {
              present({
                message: "Error al eliminar la factura",
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

  // Estados de pago únicos para los filtros
  const paymentStatuses = Array.from(
    new Set(facturas.map((f) => f.estadoPago))
  );

  return (
    <IonPage>
      <CustomHeader
        pageName="Vista de Facturas"
        showMenuButton={true}
        showLogoutButton={true}
      />
      <IonHeader>
        <IonToolbar>
          <IonSearchbar
            value={searchTerm}
            onIonChange={(e) => setSearchTerm(e.detail.value || "")}
            placeholder="Buscar por ID, descripción o reserva"
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
            {paymentStatuses.map((status) => (
              <IonSegmentButton key={status} value={status}>
                <IonLabel>{status}</IonLabel>
              </IonSegmentButton>
            ))}
          </IonSegment>
        </IonToolbar>
      </IonHeader>

      <IonContent fullscreen>
        <IonRefresher slot="fixed" onIonRefresh={handleRefresh}>
          <IonRefresherContent></IonRefresherContent>
        </IonRefresher>

        <IonLoading isOpen={loading} message="Cargando facturas..." />

        {!loading && filteredFacturas.length === 0 ? (
          <div className="empty-state">
            <p>
              {searchTerm || statusFilter !== "all"
                ? "No se encontraron facturas que coincidan con los filtros"
                : "No hay facturas registradas"}
            </p>
            <IonButton
              fill="solid"
              color="primary"
              onClick={() => history.push("/create-factura")}
            >
              Crear primera factura
            </IonButton>
          </div>
        ) : (
          <IonList className="management-list">
            {filteredFacturas.map((factura) => (
              <FacturaItem
                key={factura.id}
                factura={factura}
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
