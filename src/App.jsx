import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom"
import { useAuth } from "./context/AuthContext"  
import LoginPage from "./pages/Login"
import Home from "./pages/Home"
import Sintomas from "./pages/sintomas/Sintomas"
import TipoFarmacos from "./pages/tipo-farmacos/TipoFarmacos"
import Marcas from "./pages/marcas/Marcas"
import Ubicaciones from "./pages/ubicaciones/Ubicaciones"
import Medicamentos from "./pages/medicamentos/Medicamentos"
import TipoPacientes from "./pages/tipo-pacientes/TipoPacientes"
import Pacientes from "./pages/pacientes/Pacientes"
import TandaLabores from "./pages/tanda-labores/TandaLabores"
import Especialidades from "./pages/especialidades/Especialidades"
import Medicos from "./pages/medicos/Medicos"
import RegistroVisitas from "./pages/registro-visitas/RegistroVisitas"
import Roles from "./pages/roles/Roles"
import Usuarios from "./pages/usuarios/Usuarios"

function App() {
  const { isAuthenticated, loading } = useAuth() 

  if (loading) return null 

  return (
    <Router>
      <Routes>
        <Route path="/login" element={<LoginPage />} />
        <Route path="/" element={isAuthenticated ? <Home /> : <Navigate to="/login" replace />} />
        <Route path="/sintoma" element={isAuthenticated ? <Sintomas /> : <Navigate to="/login" />} />
        <Route path="/tipo-farmaco" element={isAuthenticated ? <TipoFarmacos /> : <Navigate to="/login" />} />
        <Route path="/marca" element={isAuthenticated ? <Marcas /> : <Navigate to="/login" />} />
        <Route path="/ubicacion" element={isAuthenticated ? <Ubicaciones /> : <Navigate to="/login" />} />
        <Route path="/medicamento" element={isAuthenticated ? <Medicamentos /> : <Navigate to="/login" />} />
        <Route path="/tipo-paciente" element={isAuthenticated ? <TipoPacientes /> : <Navigate to="/login" />} />
        <Route path="/paciente" element={isAuthenticated ? <Pacientes /> : <Navigate to="/login" />} />
        <Route path="/tanda-labor" element={isAuthenticated ? <TandaLabores /> : <Navigate to="/login" />} />
        <Route path="/especialidad" element={isAuthenticated ? <Especialidades /> : <Navigate to="/login" />} />
        <Route path="/medico" element={isAuthenticated ? <Medicos /> : <Navigate to="/login" />} />
        <Route path="/registro-visita" element={isAuthenticated ? <RegistroVisitas /> : <Navigate to="/login" />} />
        <Route path="/rol" element={isAuthenticated ? <Roles /> : <Navigate to="/login" />} />
        <Route path="/usuario" element={isAuthenticated ? <Usuarios /> : <Navigate to="/login" />} />
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </Router>
  )
}

export default App