import apiService from "./api.service";

class AuthService {
  constructor() {
    // Definimos el prefijo de las rutas de este servicio
    this.api = apiService;
  }

  // POST /auth/signup
  // Recibe el objeto con todos los campos (email, password, role, firstName/companyName, etc.)
  signup(userData) {
    return this.api.post("/auth/signup", userData);
  }

  // POST /auth/login
  // Recibe { email, password }
  login(credentials) {
    return this.api.post("/auth/login", credentials);
  }

  // GET /auth/verify api.service.js ya inyecta el token desde el localStorage
  verify() {
    return this.api.get("/auth/verify");
  }
}

const authService = new AuthService();

export default authService;