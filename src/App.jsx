import "./App.css";
import { Routes, Route } from "react-router-dom";

// Componentes de protección
import IsPrivate from "./components/IsPrivate";
import IsAnon from "./components/IsAnon";

// Componentes
import Navbar from "./components/Navbar/Navbar";

//Paginas
import SignupPage from "./pages/SignupPage/SignupPage";
import ProfilePage from "./pages/ProfilePage/ProfilePage";
import LoginPage from "./pages/LoginPage/LoginPage";
import LandingPage from "./pages/LandingPage/LandingPage";
import JobBoardPage from "./pages/JobsBoardPage/JobsBoardPage";
import JobDetailsPage from "./pages/JobDetailsPage/JobDetailsPage";
import MyApplicationsPage from "./pages/MyApplicationsPage/MyApplicationsPage";
import JobApplicantsPage from "./pages/JobApplicantsPage/JobApplicantsPage";


function App() {
  return (
    <div className="App">
       <Navbar /> 

      <Routes>
        {/* --- RUTAS PÚBLICAS --- */}
        <Route path="/" element={<div> <LandingPage /></div>} />
        <Route path="/jobs" element={<div><JobBoardPage /></div>} />
        <Route path="/jobs/:id" element={<div><JobDetailsPage /></div>} />

        {/* --- RUTAS DE INVITADOS (ISANON) --- */}
        <Route path="/signup" element={<IsAnon><div><SignupPage /></div></IsAnon>} />
        <Route path="/login" element={<IsAnon><div><LoginPage /></div></IsAnon>} />

        {/* --- RUTAS PRIVADAS (ISPRIVATE) --- */}
        <Route path="/profile" element={<IsPrivate><div><ProfilePage /></div></IsPrivate>} />

        {/* Específicas: IRONHACKER */}
        <Route 
          path="/my-applications" 
          element={<IsPrivate allowedRoles={["IRONHACKER"]}><div><MyApplicationsPage /></div></IsPrivate>} 
        />

        {/* Específicas: COMPANY */}
        <Route 
          path="/my-jobs" 
          element={<IsPrivate allowedRoles={["COMPANY"]}><div>My Posted Jobs</div></IsPrivate>} 
        />
        <Route 
          path="/jobs/create" 
          element={<IsPrivate allowedRoles={["COMPANY"]}><div>Create Job</div></IsPrivate>} 
        />
        <Route 
          path="/jobs/edit/:id" 
          element={<IsPrivate allowedRoles={["COMPANY"]}><div>Edit Job</div></IsPrivate>} 
        />
        <Route 
          path="/jobs/:jobId/applicants" 
          element={<IsPrivate allowedRoles={["COMPANY"]}><JobApplicantsPage /></IsPrivate>} 
        />

        <Route 
          path="/applications/:id" 
          element={<IsPrivate allowedRoles={["COMPANY"]}><div>Application Details</div></IsPrivate>} 
        />
        {/* 404 */}
        <Route path="*" element={<div>404 - Not Found</div>} />
      </Routes>
    </div>
  );
}

export default App;