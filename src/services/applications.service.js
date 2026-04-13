import apiService from "./api.service";

class ApplicationsService {
  constructor() {
    this.api = apiService;
  }

  /**
   * 1. Aplicar a una oferta (Sólo Ironhackers)
   * @param {Object} appData - { job: "ID_DEL_PUESTO", message: "Hola, me interesa..." }
   */
  createApplication(appData) {
    return this.api.post("/applications", appData);
  }

  /*
   * 2. Ver mis aplicaciones enviadas (Sólo Ironhackers)
   */
  getMyApplications() {
    return this.api.get("/my-applications");
  }

  /**
   * 3. Ver detalle de una aplicación específica (Empresa)
   * @param {String} appId - ID de la aplicación
   */
  getApplicationDetails(appId) {
    return this.api.get(`/applications/${appId}`);
  }

  /**
   * 4. Ver aplicantes de un Job específico (Sólo Empresas)
   * @param {String} jobId - ID del puesto de trabajo
   */
  getJobApplications(jobId) {
    return this.api.get(`/jobs/${jobId}/applications`);
  }

  /**
   * 5. Cambiar el estado de una aplicación (Sólo Empresas)
   * @param {String} appId - ID de la aplicación
   * @param {String} status - " "PENDING", "IN PROCESS", "REJECTED", "HIRED" "
   */
  updateApplicationStatus(appId, status) {
    return this.api.put(`/applications/${appId}`, { status });
  }
}

const applicationsService = new ApplicationsService();

export default applicationsService;