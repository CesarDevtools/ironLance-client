import apiService from "./api.service";

class ApplicationsService {
  constructor() {
    this.api = apiService;
  }

  // POST /api/applications - Crear una aplicación
  createApplication(appData) {
    return this.api.post("/applications", appData);
  }

  // GET /api/my-applications - Mis aplicaciones enviadas
  getMyApplications() {
    return this.api.get("/my-applications");
  }

  // GET /api/applications/:appId - Detalle de una aplicación
  getApplicationDetails(appId) {
    return this.api.get(`/applications/${appId}`);
  }

  // GET /api/jobs/:jobId/applications - Aplicantes de un puesto
  getJobApplications(jobId) {
    return this.api.get(`/jobs/${jobId}/applications`);
  }

  // PUT /api/applications/:appId - Cambiar estado de una aplicación
  updateApplicationStatus(appId, status) {
    return this.api.put(`/applications/${appId}`, { status });
  }
}

const applicationsService = new ApplicationsService();

export default applicationsService;