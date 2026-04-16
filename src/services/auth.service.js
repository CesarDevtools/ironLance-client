import apiService from "./api.service";

class AuthService {
  constructor() {
    this.api = apiService;
  }

  // POST /api/auth/signup - Registro de usuario
  signup(userData) {
    return this.api.post("/auth/signup", userData);
  }

  // POST /api/auth/login - Inicio de sesión
  login(credentials) {
    return this.api.post("/auth/login", credentials);
  }

  // GET /api/auth/verify - Verificar token de usuario
  verify() {
    return this.api.get("/auth/verify");
  }

  // PUT /api/auth/update - Actualizar perfil de usuario
  updateProfile(updatedData) {
    return this.api.put("/auth/update", updatedData);
  }
}

const authService = new AuthService();

export default authService;