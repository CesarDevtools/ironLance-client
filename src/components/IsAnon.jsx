import { useContext } from "react";
import { AuthContext } from "../context/auth.context";
import { Navigate } from "react-router-dom";
import { Center, Loader } from "@mantine/core";

function IsAnon({ children }) {
  const { isLoggedIn, isLoading } = useContext(AuthContext);

  // 1. Mientras comprobamos si hay alguien logueado
  if (isLoading) {
    return (
      <Center style={{ height: "100vh" }}>
        <Loader size="xl" type="dots" />
      </Center>
    );
  }

  // 2. Si YA está logueado, no le dejamos estar aquí. 
  // Lo mandamos a la Home o a su Dashboard principal.
  if (isLoggedIn) {
    return <Navigate to="/" />;
  }

  // 3. Si NO está logueado, le dejamos ver el Login/Signup
  return children;
}

export default IsAnon;