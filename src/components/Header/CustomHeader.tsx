import {
  IonHeader,
  IonToolbar,
  IonTitle,
  IonButtons,
  IonButton,
  IonIcon,
  IonMenuButton,
} from "@ionic/react";
import { logOutOutline, busOutline, personCircleOutline } from "ionicons/icons";
import { useHistory } from "react-router-dom";
import "./CustomHeader.scss";

interface CustomHeaderProps {
  pageName: string;
  showMenuButton?: boolean;
  showLogoutButton?: boolean;
}

const CustomHeader: React.FC<CustomHeaderProps> = ({
  pageName,
  showMenuButton = true,
  showLogoutButton = true,
}) => {
  const history = useHistory();

  const handleLogout = () => {
    history.push("/welcome");
  };

  return (
    <IonHeader className="custom-header">
      <IonToolbar>
        {showMenuButton && (
          <IonButtons slot="start">
            <IonMenuButton />
          </IonButtons>
        )}

        <div className="header-center">
          <IonIcon icon={busOutline} className="header-icon" />
          <IonTitle>{pageName}</IonTitle>
        </div>

        {showLogoutButton && (
          <IonButtons slot="end">
            <IonButton onClick={handleLogout}>
              <IonIcon icon={logOutOutline} />
            </IonButton>
          </IonButtons>
        )}
      </IonToolbar>
    </IonHeader>
  );
};

export default CustomHeader;
