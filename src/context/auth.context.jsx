import { createContext, useState, useEffect } from "react";
import authService from "../services/auth.service";

const AuthContext = createContext();

function AuthProviderWrapper(props) {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [user, setUser] = useState(null);

  // 1. Función para guardar el Token tras el Login
  const storeToken = (token) => {
    localStorage.setItem("authToken", token);
  };

  // 2. Función para validar el Token contra el Backend
  const authenticateUser = () => {
    const storedToken = localStorage.getItem("authToken");

    if (storedToken) {
      // Usamos nuestro servicio de auth para llamar a /verify
      authService.verify()
        .then((response) => {
          // Si el token es válido, el backend nos devuelve el payload (id, email, role, name)
          const userPayload = response.data;
          setIsLoggedIn(true);
          setIsLoading(false);
          setUser(userPayload);
        })
        .catch((error) => {
          // Si el token es falso, expiró o hubo error: reseteamos todo
          removeToken();
          setIsLoggedIn(false);
          setIsLoading(false);
          setUser(null);
        });
    } else {
      // No hay token en localStorage
      setIsLoggedIn(false);
      setIsLoading(false);
      setUser(null);
    }
  };

  const removeToken = () => {
    localStorage.removeItem("authToken");
  };

  const logOutUser = () => {
    removeToken();
    authenticateUser(); // Esto actualizará los estados a false/null
  };

  // 3. Efecto de carga inicial: se ejecuta una sola vez cuando se abre la app
  useEffect(() => {
    authenticateUser();
  }, []);

  return (
    <AuthContext.Provider
      value={{
        isLoggedIn,
        isLoading,
        user,
        storeToken,
        authenticateUser,
        logOutUser,
      }}
    >
      {props.children}
    </AuthContext.Provider>
  );
}

export { AuthContext, AuthProviderWrapper };