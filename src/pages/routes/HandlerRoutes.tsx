import { Login } from "../auth/Login/Login";
import { AuthRoutes } from "./AuthRoutes";
import { Redirect, Route } from "react-router-dom";

export function HandlerRoutes() {
  const username = null; // Debería venir de un contexto o estado global

  return (
    <>
      {!username ? (
        <Route path="/auth" component={Login} exact />
      ) : (
        <AuthRoutes />
      )}
    </>
  );
}
