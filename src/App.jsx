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
import ApplicationDetailsPage from "./pages/ApplicationDetails/ApplicationDetails";
import MyJobsPage from "./pages/MyJobsPage/MyJobsPage";
import CreateJobPage from "./pages/CreateJobPage/CreateJobPage";
import EditJobPage from "./pages/EditJobPage/EditJobPage";
import IronhackersBoardPage from "./pages/IronhackersBoardPage/IronhackersBoardPage";
import IronhackerDetailsPage from "./pages/IronhackerDetails/IronhackerDetails";

function App() {
  return (
    <div className="App">
       <Navbar /> 

      <Routes>
        {/* --- RUTAS PÚBLICAS --- */}
        <Route path="/" element={ <IsAnon> <LandingPage /> </IsAnon>} />
        <Route path="/jobs" element={ <JobBoardPage /> } />
        <Route path="/jobs/:id" element={ <JobDetailsPage /> } />

        {/* --- RUTAS DE INVITADOS (ISANON) --- */}
        <Route path="/signup" element={<IsAnon> <SignupPage /> </IsAnon>} />
        <Route path="/login" element={<IsAnon> <LoginPage /> </IsAnon>} />

        {/* --- RUTAS PRIVADAS (ISPRIVATE) --- */}
        <Route path="/profile" element={<IsPrivate> <ProfilePage /> </IsPrivate>} />

        {/* Específicas: IRONHACKER */}
        <Route 
          path="/my-applications" 
          element={<IsPrivate allowedRoles={["IRONHACKER"]}> <MyApplicationsPage /> </IsPrivate>} 
        />

        {/* Específicas: COMPANY */}
         <Route 
          path="/ironhackers" 
          element={<IsPrivate allowedRoles={["COMPANY"]}><IronhackersBoardPage /></IsPrivate>} 
        />
        <Route 
          path="/ironhackers/:userId" 
          element={<IsPrivate ><IronhackerDetailsPage /></IsPrivate>} 
        />
        <Route 
          path="/my-jobs" 
          element={<IsPrivate allowedRoles={["COMPANY"]}><MyJobsPage /></IsPrivate>} 
        />
        <Route 
          path="/jobs/create" 
          element={<IsPrivate allowedRoles={["COMPANY"]}><CreateJobPage /></IsPrivate>} 
        />
        <Route 
          path="/jobs/edit/:id" 
          element={<IsPrivate allowedRoles={["COMPANY"]}><EditJobPage /></IsPrivate>} 
        />
        <Route 
          path="/jobs/:jobId/applicants" 
          element={<IsPrivate allowedRoles={["COMPANY"]}><JobApplicantsPage /></IsPrivate>} 
        />

        <Route 
          path="/applications/:id" 
          element={<IsPrivate allowedRoles={["COMPANY"]}><ApplicationDetailsPage /></IsPrivate>} 
        />
        {/* 404 */}
        <Route path="*" element={<div>404 - Not Found</div>} />
      </Routes>
    </div>
  );
}

export default App;