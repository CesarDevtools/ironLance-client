import axios from "axios";

const apiService = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
});

// Interceptor para inyectar el token en cada petición
apiService.interceptors.request.use((config) => {
  const storedToken = localStorage.getItem("authToken");

  if (storedToken) {
    config.headers.Authorization = `Bearer ${storedToken}`;
  }

  return config;
});

export default apiService;