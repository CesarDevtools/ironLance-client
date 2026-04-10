import "./App.css";
import { Routes, Route } from "react-router-dom";

// Componentes de protección
import IsPrivate from "./components/IsPrivate";
import IsAnon from "./components/IsAnon";

//Paginas
import SignupPage from "./pages/SignupPage/SignupPage";


function App() {
  return (
    <div className="App">
      {/* <Navbar /> */}

      <Routes>
        {/* --- RUTAS PÚBLICAS --- */}
        <Route path="/" element={<div>Landing Page</div>} />
        <Route path="/jobs" element={<div>Jobs Board</div>} />
        <Route path="/jobs/:id" element={<div>Job Details</div>} />

        {/* --- RUTAS DE INVITADOS (ISANON) --- */}
        <Route path="/signup" element={<IsAnon><div><SignupPage /></div></IsAnon>} />
        <Route path="/login" element={<IsAnon><div>Login Page</div></IsAnon>} />

        {/* --- RUTAS PRIVADAS (ISPRIVATE) --- */}
        <Route path="/profile" element={<IsPrivate><div>My Profile</div></IsPrivate>} />

        {/* Específicas: IRONHACKER */}
        <Route 
          path="/my-applications" 
          element={<IsPrivate allowedRoles={["IRONHACKER"]}><div>My Applications (List)</div></IsPrivate>} 
        />
        <Route 
          path="/my-applications/:id" 
          element={<IsPrivate allowedRoles={["IRONHACKER"]}><div>Application Details</div></IsPrivate>} 
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
          path="/jobs/:id/applicants" 
          element={<IsPrivate allowedRoles={["COMPANY"]}><div>Lista de Aplicantes (Gestión)</div></IsPrivate>} 
        />

        {/* 404 */}
        <Route path="*" element={<div>404 - Not Found</div>} />
      </Routes>
    </div>
  );
}

export default App;