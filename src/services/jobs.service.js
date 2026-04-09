import apiService from "./api.service";

class JobsService {
  constructor() {
    this.api = apiService;
  }

  // GET /api/jobs - Lista pública
  getAllJobs() {
    return this.api.get("/jobs");
  }

  // GET /api/jobs/:id - Detalle público
  getJobDetails(jobId) {
    return this.api.get(`/jobs/${jobId}`);
  }

  // POST /api/jobs - Crear (Solo Empresa)
  createJob(jobData) {
    return this.api.post("/jobs", jobData);
  }

  // PUT /api/jobs/:id - Editar (Solo Dueño)
  updateJob(jobId, jobData) {
    return this.api.put(`/jobs/${jobId}`, jobData);
  }

  // DELETE /api/jobs/:id - Borrar (Solo Dueño)
  deleteJob(jobId) {
    return this.api.delete(`/jobs/${jobId}`);
  }

  // GET /api/my-jobs - Dashboard de la empresa logueada
  getMyJobs() {
    return this.api.get("/my-jobs");
  }
}

const jobsService = new JobsService();

export default jobsService;