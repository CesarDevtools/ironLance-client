import apiService from "./api.service"; 

const usersService = {
  // Obtiene los perfiles de Ironhackers públicos (solo para empresas)
  getIronhackers: () => {
    return apiService.get("/ironhackers");
  },

  // Obtiene los detalles de un Ironhacker específico por ID
  getIronhackerDetails: (userId) => {
    return apiService.get(`/${userId}`);
  }
};

export default usersService;