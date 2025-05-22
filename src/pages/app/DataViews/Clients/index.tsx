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
} from "@ionic/react";
import { addOutline } from "ionicons/icons";
import { RefresherEventDetail } from "@ionic/core";
import { useState, useEffect } from "react";
import { useHistory } from "react-router-dom";
import {
  fetchClients,
  deleteClient,
  Client,
} from "../../../../services/clientService";
import { ClientItem } from "./ClientItem";
import "../DataViews.scss";
import CustomHeader from "../../../../components/Header/CustomHeader";

export const ClientsPage: React.FC = () => {
  const [clients, setClients] = useState<Client[]>([]);
  const [filteredClients, setFilteredClients] = useState<Client[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(true);
  const [present] = useIonToast();
  const [presentAlert] = useIonAlert();
  const history = useHistory();

  const loadClients = async () => {
    try {
      setLoading(true);
      const data = await fetchClients();
      setClients(data);
      setFilteredClients(data);
    } catch (error) {
      console.error("Error loading clients:", error);
      present({
        message: "Error al cargar los clientes",
        duration: 2000,
        position: "top",
        color: "danger",
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadClients();
  }, []);

  useEffect(() => {
    if (searchTerm.trim() === "") {
      setFilteredClients(clients);
    } else {
      const filtered = clients.filter(
        (client) =>
          client.fullName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
          client.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
          client.phone?.toLowerCase().includes(searchTerm.toLowerCase()) ||
          client.documentNumber
            ?.toLowerCase()
            .includes(searchTerm.toLowerCase())
      );
      setFilteredClients(filtered);
    }
  }, [searchTerm, clients]);

  const handleRefresh = (event: CustomEvent<RefresherEventDetail>) => {
    loadClients().then(() => {
      event.detail.complete();
      present({
        message: "Clientes actualizados",
        duration: 1500,
        position: "top",
      });
    });
  };

  const handleEdit = (id: number) => {
    history.push(`/edit-client/${id}`);
  };

  const handleDelete = (id: number) => {
    presentAlert({
      header: "Confirmar eliminación",
      message: "¿Estás seguro de que deseas eliminar este cliente?",
      buttons: [
        { text: "Cancelar", role: "cancel" },
        {
          text: "Eliminar",
          handler: async () => {
            try {
              await deleteClient(id);
              await loadClients();
              present({
                message: "Cliente eliminado correctamente",
                duration: 2000,
                position: "top",
                color: "success",
              });
            } catch (error) {
              present({
                message: "Error al eliminar el cliente",
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
        pageName="Vista de Clientes"
        showMenuButton={true}
        showLogoutButton={true}
      />

      <IonToolbar>
        <IonSearchbar
          value={searchTerm}
          onIonChange={(e) => setSearchTerm(e.detail.value || "")}
          placeholder="Buscar por nombre, email o teléfono"
          debounce={300}
        />
      </IonToolbar>

      <IonContent fullscreen>
        <IonRefresher slot="fixed" onIonRefresh={handleRefresh}>
          <IonRefresherContent></IonRefresherContent>
        </IonRefresher>

        <IonLoading isOpen={loading} message="Cargando clientes..." />

        {!loading && filteredClients.length === 0 ? (
          <div className="empty-state">
            <p>
              {searchTerm
                ? "No se encontraron clientes que coincidan con la búsqueda"
                : "No hay clientes registrados"}
            </p>
            <IonButton
              fill="solid"
              color="primary"
              onClick={() => history.push("/create-client")}
            >
              Agregar primer cliente
            </IonButton>
          </div>
        ) : (
          <IonList className="management-list">
            {filteredClients.map((client) => (
              <ClientItem
                key={client.id}
                client={client}
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
