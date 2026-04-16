import apiService from "./api.service"; 

const usersService = {
  // Obtiene los perfiles de Ironhackers públicos (solo para empresas)
  getIronhackers: () => {
    return apiService.get("/users/ironhackers");
  }
};

export default usersService;