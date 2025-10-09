import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from './pages/Home';
import Sintomas from './pages/sintomas/Sintomas';
import TipoFarmacos from './pages/tipo-farmacos/TipoFarmacos';
import Marcas from './pages/marcas/Marcas';
import Ubicaciones from './pages/ubicaciones/Ubicaciones';
import Medicamentos from './pages/medicamentos/Medicamentos';
import TipoPacientes from './pages/tipo-pacientes/TipoPacientes';
import Pacientes from './pages/pacientes/Pacientes';
import TandaLabores from './pages/tanda-labores/TandaLabores';
import Especialidades from './pages/especialidades/Especialidades';
import Medicos from './pages/medicos/Medicos';
import RegistroVisitas from './pages/registro-visitas/RegistroVisitas';

function App() {

  return (
    <Router>
        <Routes>
      
          <Route path="*" element={<Home />} />
          <Route path="/sintoma" element={<Sintomas />} />
          <Route path="/tipo-farmaco" element={<TipoFarmacos />} />
          <Route path="/marca" element={<Marcas />} />
          <Route path="/ubicacion" element={<Ubicaciones />} />
          <Route path="/medicamento" element={<Medicamentos />} />
          <Route path="/tipo-paciente" element={<TipoPacientes />} />
          <Route path="/paciente" element={<Pacientes />} />
          <Route path="/tanda-labor" element={<TandaLabores />} />
          <Route path="/especialidad" element={<Especialidades />} />
          <Route path="/medico" element={<Medicos />} />
          <Route path="/registro-visita" element={<RegistroVisitas />} />




        </Routes>
      </Router>
  )
}

export default App
