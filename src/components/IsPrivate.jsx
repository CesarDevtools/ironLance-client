import { useContext } from "react";
import { AuthContext } from "../context/auth.context";
import { Navigate } from "react-router-dom";
import { Center, Loader } from "@mantine/core";

function IsPrivate({ children, allowedRoles }) {
  const { isLoggedIn, isLoading, user } = useContext(AuthContext);

  // 1. Mientras validamos el token
  if (isLoading) {
    return (
      <Center style={{ height: "100vh" }}>
        <Loader size="xl" type="dots" />
      </Center>
    );
  }

  // 2. Si no está logueado
  if (!isLoggedIn) {
    return <Navigate to="/login" />;
  }

  // 3. Si está logueado pero la ruta requiere un rol específico que el usuario NO tiene
  if (allowedRoles && !allowedRoles.includes(user.role)) {
    return <Navigate to="/" />;
  }

  // 4. Si todo esta logueado y tiene el rol necesario
  return children;
}

export default IsPrivate;