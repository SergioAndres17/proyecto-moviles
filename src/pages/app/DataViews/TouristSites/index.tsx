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
import { TouristSiteItem } from "./TouristSiteItem";
import "../DataViews.scss";
import {
  fetchTouristSites,
  deleteTouristSite,
  TouristSite,
} from "../../../../services/touristSiteService";
import CustomHeader from "../../../../components/Header/CustomHeader";

export const TouristSitesPage: React.FC = () => {
  const [sites, setSites] = useState<TouristSite[]>([]);
  const [filteredSites, setFilteredSites] = useState<TouristSite[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(true);
  const [typeFilter, setTypeFilter] = useState<string>("all");
  const [present] = useIonToast();
  const [presentAlert] = useIonAlert();
  const history = useHistory();

  const loadSites = async () => {
    try {
      setLoading(true);
      const data = await fetchTouristSites();
      setSites(data);
      applyFilters(data, searchTerm, typeFilter);
    } catch (error) {
      console.error("Error loading tourist sites:", error);
      present({
        message: "Error al cargar los sitios turísticos",
        duration: 2000,
        position: "top",
        color: "danger",
      });
    } finally {
      setLoading(false);
    }
  };

  const applyFilters = (data: TouristSite[], term: string, type: string) => {
    let filtered = data;

    // Filtrar por término de búsqueda
    if (term.trim() !== "") {
      filtered = filtered.filter(
        (site) =>
          site.title?.toLowerCase().includes(term.toLowerCase()) ||
          site.location?.toLowerCase().includes(term.toLowerCase()) ||
          site.type?.toLowerCase().includes(term.toLowerCase()) ||
          site.description?.toLowerCase().includes(term.toLowerCase())
      );
    }

    // Filtrar por tipo
    if (type !== "all") {
      filtered = filtered.filter(
        (site) => site.type.toLowerCase() === type.toLowerCase()
      );
    }

    setFilteredSites(filtered);
  };

  useEffect(() => {
    loadSites();
  }, []);

  useEffect(() => {
    applyFilters(sites, searchTerm, typeFilter);
  }, [searchTerm, typeFilter, sites]);

  const handleRefresh = (event: CustomEvent<RefresherEventDetail>) => {
    loadSites().then(() => {
      event.detail.complete();
      present({
        message: "Sitios turísticos actualizados",
        duration: 1500,
        position: "top",
      });
    });
  };

  const handleEdit = (id: number) => {
    history.push(`/edit-touristsite/${id}`);
  };

  const handleDelete = (id: number) => {
    presentAlert({
      header: "Confirmar eliminación",
      message: "¿Estás seguro de que deseas eliminar este sitio turístico?",
      buttons: [
        { text: "Cancelar", role: "cancel" },
        {
          text: "Eliminar",
          handler: async () => {
            try {
              await deleteTouristSite(id);
              await loadSites();
              present({
                message: "Sitio turístico eliminado correctamente",
                duration: 2000,
                position: "top",
                color: "success",
              });
            } catch (error) {
              present({
                message: "Error al eliminar el sitio turístico",
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

  // Extraer tipos únicos para los filtros
  const siteTypes = Array.from(new Set(sites.map((site) => site.type)));

  return (
    <IonPage>
      <IonHeader>
        <CustomHeader
          pageName="Vista de Sitios Turísticos"
          showMenuButton={true}
          showLogoutButton={true}
        />
        <IonToolbar>
          <IonTitle>Sitios Turísticos</IonTitle>
          <IonButton
            slot="end"
            fill="clear"
            onClick={() => history.push("/create-touristsite")}
          >
            <IonIcon icon={addOutline} slot="icon-only" />
          </IonButton>
        </IonToolbar>
        <IonToolbar>
          <IonSearchbar
            value={searchTerm}
            onIonChange={(e) => setSearchTerm(e.detail.value || "")}
            placeholder="Buscar por nombre, código o ubicación"
            debounce={300}
          />
        </IonToolbar>
        <IonToolbar>
          <IonSegment
            value={typeFilter}
            onIonChange={(e) => setTypeFilter(e.detail.value as string)}
            scrollable
          >
            <IonSegmentButton value="all">
              <IonLabel>Todos</IonLabel>
            </IonSegmentButton>
            {siteTypes.map((type) => (
              <IonSegmentButton key={type} value={type}>
                <IonLabel>{type}</IonLabel>
              </IonSegmentButton>
            ))}
          </IonSegment>
        </IonToolbar>
      </IonHeader>

      <IonContent fullscreen>
        <IonRefresher slot="fixed" onIonRefresh={handleRefresh}>
          <IonRefresherContent></IonRefresherContent>
        </IonRefresher>

        <IonLoading isOpen={loading} message="Cargando sitios turísticos..." />

        {!loading && filteredSites.length === 0 ? (
          <div className="empty-state">
            <p>
              {searchTerm || typeFilter !== "all"
                ? "No se encontraron sitios que coincidan con los filtros"
                : "No hay sitios turísticos registrados"}
            </p>
            <IonButton
              fill="solid"
              color="primary"
              onClick={() => history.push("/create-touristsite")}
            >
              Agregar primer sitio
            </IonButton>
          </div>
        ) : (
          <IonList className="management-list">
            {filteredSites.map((site) => (
              <TouristSiteItem
                key={site.id}
                site={site}
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
