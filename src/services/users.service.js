import apiService from "./api.service"; 

const usersService = {
  // GET /api/users/ironhackers - Lista de alumnos públicos
  getIronhackers: () => {
    return apiService.get("/ironhackers");
  },

  // GET /api/users/:userId - Detalles de un alumno
  getIronhackerDetails: (userId) => {
    return apiService.get(`/${userId}`);
  }
};

export default usersService;