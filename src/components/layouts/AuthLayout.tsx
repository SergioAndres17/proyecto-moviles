import { IonPage, IonContent } from "@ionic/react";
import CustomHeader from "../Header/CustomHeader";

interface AuthLayoutProps {
  children: React.ReactNode;
  pageName: string;
}

const AuthLayout: React.FC<AuthLayoutProps> = ({ children, pageName }) => {
  return (
    <IonPage>
      <CustomHeader
        pageName={pageName}
        showMenuButton={false}
        showLogoutButton={false}
      />
      <IonContent>{children}</IonContent>
    </IonPage>
  );
};

export default AuthLayout;
