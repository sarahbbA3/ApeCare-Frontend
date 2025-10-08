import React, { useState, useEffect } from 'react';
import { Plus, Search, Edit2, Trash2, Eye, Filter, FileText, Users, Pill, MapPin, Stethoscope, Calendar, Activity } from 'lucide-react';

// Configuración del API
const API_BASE_URL = 'http://localhost:3000/api'; // Cambia el puerto según tu backend

// Componente principal
const DispensarioApp = () => {
  const [currentView, setCurrentView] = useState('dashboard');
  const [searchTerm, setSearchTerm] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [modalData, setModalData] = useState(null);
  const [modalType, setModalType] = useState('');

  // Estados para datos
  const [tiposFarmaco, setTiposFarmaco] = useState([]);
  const [marcas, setMarcas] = useState([]);
  const [ubicaciones, setUbicaciones] = useState([]);
  const [medicamentos, setMedicamentos] = useState([]);
  const [pacientes, setPacientes] = useState([]);
  const [medicos, setMedicos] = useState([]);
  const [visitas, setVisitas] = useState([]);
  const [especialidades, setEspecialidades] = useState([]);
  const [tandasLabor, setTandasLabor] = useState([]);
  const [tiposPaciente, setTiposPaciente] = useState([]);
  const [sintomas, setSintomas] = useState([]);
  const [estados, setEstados] = useState([]);

  // Función para hacer peticiones al API
  const fetchAPI = async (endpoint, options = {}) => {
    try {
      const response = await fetch(`${API_BASE_URL}${endpoint}`, {
        headers: {
          'Content-Type': 'application/json',
          ...options.headers,
        },
        ...options,
      });
      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Error en la petición:', error);
      alert('Error de conexión con el servidor');
      return null;
    }
  };

  // Cargar datos iniciales
  useEffect(() => {
    loadInitialData();
  }, []);

  const loadInitialData = async () => {
    // Simular datos iniciales (reemplazar con llamadas reales al API)
    setEstados([
      { Estado_ID: 1, Nombre: 'Activo' },
      { Estado_ID: 2, Nombre: 'Inactivo' }
    ]);

    setTiposPaciente([
      { TipoPaciente_ID: 1, Nombre: 'Estudiante' },
      { TipoPaciente_ID: 2, Nombre: 'Empleado' },
      { TipoPaciente_ID: 3, Nombre: 'Profesor' },
      { TipoPaciente_ID: 4, Nombre: 'Otros' }
    ]);

    setTandasLabor([
      { TandaLabor_ID: 1, Nombre: 'Matutina' },
      { TandaLabor_ID: 2, Nombre: 'Vespertina' },
      { TandaLabor_ID: 3, Nombre: 'Nocturna' }
    ]);

    // Aquí deberías hacer las llamadas reales al API
    // const tiposFarmacoData = await fetchAPI('/tipofarmacos');
    // setTiposFarmaco(tiposFarmacoData.data || []);
  };

  // Componente Dashboard
  const Dashboard = () => {
    const stats = [
      { title: 'Pacientes Registrados', value: pacientes.length, icon: Users, color: 'bg-blue-500' },
      { title: 'Médicos Activos', value: medicos.length, icon: Stethoscope, color: 'bg-green-500' },
      { title: 'Medicamentos', value: medicamentos.length, icon: Pill, color: 'bg-purple-500' },
      { title: 'Visitas Hoy', value: visitas.length, icon: Calendar, color: 'bg-orange-500' },
    ];

    return (
      <div className="space-y-6">
        <h1 className="text-3xl font-bold text-gray-800">Dashboard - Dispensario Médico UNAPEC</h1>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {stats.map((stat, index) => (
            <div key={index} className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-500 text-sm">{stat.title}</p>
                  <p className="text-3xl font-bold text-gray-800 mt-2">{stat.value}</p>
                </div>
                <div className={`${stat.color} p-4 rounded-full`}>
                  <stat.icon className="text-white" size={24} />
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-8">
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
              <Activity className="text-blue-500" />
              Acciones Rápidas
            </h2>
            <div className="space-y-3">
              <button
                onClick={() => setCurrentView('visitas')}
                className="w-full text-left px-4 py-3 bg-blue-50 hover:bg-blue-100 rounded-lg transition-colors"
              >
                <div className="font-semibold text-blue-700">Registrar Nueva Visita</div>
                <div className="text-sm text-gray-600">Registrar atención médica</div>
              </button>
              <button
                onClick={() => setCurrentView('pacientes')}
                className="w-full text-left px-4 py-3 bg-green-50 hover:bg-green-100 rounded-lg transition-colors"
              >
                <div className="font-semibold text-green-700">Nuevo Paciente</div>
                <div className="text-sm text-gray-600">Agregar paciente al sistema</div>
              </button>
              <button
                onClick={() => setCurrentView('medicamentos')}
                className="w-full text-left px-4 py-3 bg-purple-50 hover:bg-purple-100 rounded-lg transition-colors"
              >
                <div className="font-semibold text-purple-700">Gestionar Medicamentos</div>
                <div className="text-sm text-gray-600">Ver inventario de medicamentos</div>
              </button>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
              <FileText className="text-green-500" />
              Últimas Visitas
            </h2>
            <div className="space-y-3">
              {visitas.length === 0 ? (
                <p className="text-gray-500 text-center py-4">No hay visitas registradas</p>
              ) : (
                visitas.slice(0, 5).map((visita, index) => (
                  <div key={index} className="border-l-4 border-blue-500 pl-4 py-2">
                    <div className="font-semibold">Paciente: {visita.pacienteNombre}</div>
                    <div className="text-sm text-gray-600">Médico: {visita.medicoNombre}</div>
                    <div className="text-xs text-gray-500">{visita.FechaVisita} - {visita.HoraVisita}</div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      </div>
    );
  };

  // Componente de Tabla Genérica
  const DataTable = ({ title, data, columns, onAdd, onEdit, onDelete, addButtonText }) => {
    const [filteredData, setFilteredData] = useState(data);

    useEffect(() => {
      if (searchTerm) {
        const filtered = data.filter(item =>
          Object.values(item).some(val =>
            val?.toString().toLowerCase().includes(searchTerm.toLowerCase())
          )
        );
        setFilteredData(filtered);
      } else {
        setFilteredData(data);
      }
    }, [searchTerm, data]);

    return (
      <div className="space-y-4">
        <div className="flex justify-between items-center">
          <h1 className="text-3xl font-bold text-gray-800">{title}</h1>
          <button
            onClick={onAdd}
            className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
          >
            <Plus size={20} />
            {addButtonText || 'Agregar'}
          </button>
        </div>

        <div className="bg-white rounded-lg shadow-md p-4">
          <div className="relative mb-4">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
            <input
              type="text"
              placeholder="Buscar..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>

          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b-2 border-gray-200">
                <tr>
                  {columns.map((col, index) => (
                    <th key={index} className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      {col.label}
                    </th>
                  ))}
                  <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Acciones
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredData.length === 0 ? (
                  <tr>
                    <td colSpan={columns.length + 1} className="px-6 py-8 text-center text-gray-500">
                      No hay datos disponibles
                    </td>
                  </tr>
                ) : (
                  filteredData.map((item, rowIndex) => (
                    <tr key={rowIndex} className="hover:bg-gray-50 transition-colors">
                      {columns.map((col, colIndex) => (
                        <td key={colIndex} className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                          {col.render ? col.render(item) : item[col.field]}
                        </td>
                      ))}
                      <td className="px-6 py-4 whitespace-nowrap text-center">
                        <div className="flex justify-center gap-2">
                          <button
                            onClick={() => onEdit(item)}
                            className="text-blue-600 hover:text-blue-800 transition-colors"
                            title="Editar"
                          >
                            <Edit2 size={18} />
                          </button>
                          <button
                            onClick={() => onDelete(item)}
                            className="text-red-600 hover:text-red-800 transition-colors"
                            title="Eliminar"
                          >
                            <Trash2 size={18} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    );
  };

  // Modal de Formulario
  const FormModal = ({ isOpen, onClose, title, children }) => {
    if (!isOpen) return null;

    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
        <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
          <div className="flex justify-between items-center p-6 border-b">
            <h2 className="text-2xl font-bold text-gray-800">{title}</h2>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600 text-2xl"
            >
              ×
            </button>
          </div>
          <div className="p-6">
            {children}
          </div>
        </div>
      </div>
    );
  };

  // Formulario de Tipo de Fármaco
  const TipoFarmacoForm = ({ data, onSave, onCancel }) => {
    const [formData, setFormData] = useState(data || {
      Descripcion: '',
      Estado_ID: 1
    });

    const handleSubmit = (e) => {
      e.preventDefault();
      onSave(formData);
    };

    return (
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Descripción</label>
          <input
            type="text"
            value={formData.Descripcion}
            onChange={(e) => setFormData({...formData, Descripcion: e.target.value})}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
            required
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Estado</label>
          <select
            value={formData.Estado_ID}
            onChange={(e) => setFormData({...formData, Estado_ID: parseInt(e.target.value)})}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
          >
            {estados.map(estado => (
              <option key={estado.Estado_ID} value={estado.Estado_ID}>{estado.Nombre}</option>
            ))}
          </select>
        </div>
        <div className="flex justify-end gap-3 pt-4">
          <button
            type="button"
            onClick={onCancel}
            className="px-6 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
          >
            Cancelar
          </button>
          <button
            type="submit"
            className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            Guardar
          </button>
        </div>
      </form>
    );
  };

  // Formulario de Paciente
  const PacienteForm = ({ data, onSave, onCancel }) => {
    const [formData, setFormData] = useState(data || {
      Nombre: '',
      Cedula: '',
      NumeroCarnet: '',
      TipoPaciente_ID: 1,
      Estado_ID: 1
    });

    const handleSubmit = (e) => {
      e.preventDefault();
      onSave(formData);
    };

    return (
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Nombre Completo</label>
          <input
            type="text"
            value={formData.Nombre}
            onChange={(e) => setFormData({...formData, Nombre: e.target.value})}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
            required
          />
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Cédula</label>
            <input
              type="text"
              value={formData.Cedula}
              onChange={(e) => setFormData({...formData, Cedula: e.target.value})}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">No. Carnet</label>
            <input
              type="text"
              value={formData.NumeroCarnet}
              onChange={(e) => setFormData({...formData, NumeroCarnet: e.target.value})}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Tipo de Paciente</label>
          <select
            value={formData.TipoPaciente_ID}
            onChange={(e) => setFormData({...formData, TipoPaciente_ID: parseInt(e.target.value)})}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
          >
            {tiposPaciente.map(tipo => (
              <option key={tipo.TipoPaciente_ID} value={tipo.TipoPaciente_ID}>{tipo.Nombre}</option>
            ))}
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Estado</label>
          <select
            value={formData.Estado_ID}
            onChange={(e) => setFormData({...formData, Estado_ID: parseInt(e.target.value)})}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
          >
            {estados.map(estado => (
              <option key={estado.Estado_ID} value={estado.Estado_ID}>{estado.Nombre}</option>
            ))}
          </select>
        </div>
        <div className="flex justify-end gap-3 pt-4">
          <button
            type="button"
            onClick={onCancel}
            className="px-6 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
          >
            Cancelar
          </button>
          <button
            type="submit"
            className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            Guardar
          </button>
        </div>
      </form>
    );
  };

  // Formulario de Visita
  const VisitaForm = ({ data, onSave, onCancel }) => {
    const [formData, setFormData] = useState(data || {
      Medico_ID: '',
      Paciente_ID: '',
      FechaVisita: new Date().toISOString().split('T')[0],
      HoraVisita: new Date().toTimeString().split(' ')[0].substring(0, 5),
      Sintoma_ID: '',
      Medicamento_ID: '',
      Recomendaciones: '',
      Estado_ID: 1
    });

    const handleSubmit = (e) => {
      e.preventDefault();
      onSave(formData);
    };

    return (
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Médico</label>
            <select
              value={formData.Medico_ID}
              onChange={(e) => setFormData({...formData, Medico_ID: e.target.value})}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              required
            >
              <option value="">Seleccione un médico</option>
              {medicos.map(medico => (
                <option key={medico.Medico_ID} value={medico.Medico_ID}>{medico.Nombre}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Paciente</label>
            <select
              value={formData.Paciente_ID}
              onChange={(e) => setFormData({...formData, Paciente_ID: e.target.value})}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              required
            >
              <option value="">Seleccione un paciente</option>
              {pacientes.map(paciente => (
                <option key={paciente.Paciente_ID} value={paciente.Paciente_ID}>{paciente.Nombre}</option>
              ))}
            </select>
          </div>
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Fecha de Visita</label>
            <input
              type="date"
              value={formData.FechaVisita}
              onChange={(e) => setFormData({...formData, FechaVisita: e.target.value})}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Hora</label>
            <input
              type="time"
              value={formData.HoraVisita}
              onChange={(e) => setFormData({...formData, HoraVisita: e.target.value})}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Síntomas</label>
          <textarea
            value={formData.Sintoma_ID}
            onChange={(e) => setFormData({...formData, Sintoma_ID: e.target.value})}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
            rows="3"
            placeholder="Describa los síntomas del paciente"
            required
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Medicamento Suministrado</label>
          <select
            value={formData.Medicamento_ID}
            onChange={(e) => setFormData({...formData, Medicamento_ID: e.target.value})}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
          >
            <option value="">Sin medicamento</option>
            {medicamentos.map(med => (
              <option key={med.Medicamento_ID} value={med.Medicamento_ID}>{med.Descripcion}</option>
            ))}
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Recomendaciones</label>
          <textarea
            value={formData.Recomendaciones}
            onChange={(e) => setFormData({...formData, Recomendaciones: e.target.value})}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
            rows="3"
            placeholder="Recomendaciones médicas"
          />
        </div>
        <div className="flex justify-end gap-3 pt-4">
          <button
            type="button"
            onClick={onCancel}
            className="px-6 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
          >
            Cancelar
          </button>
          <button
            type="submit"
            className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            Guardar
          </button>
        </div>
      </form>
    );
  };

  // Handlers de CRUD
  const handleSave = async (entity, data) => {
    console.log('Guardando:', entity, data);
    // Aquí va la lógica para guardar en el backend
    // const result = await fetchAPI(`/${entity}`, { method: 'POST', body: JSON.stringify(data) });
    setShowModal(false);
    alert('Datos guardados exitosamente');
  };

  const handleEdit = (entity, item) => {
    setModalData(item);
    setModalType(entity);
    setShowModal(true);
  };

  const handleDelete = async (entity, item) => {
    if (window.confirm('¿Está seguro de eliminar este registro?')) {
      console.log('Eliminando:', entity, item);
      // const result = await fetchAPI(`/${entity}/${item.id}`, { method: 'DELETE' });
      alert('Registro eliminado');
    }
  };

  // Menú lateral
  const Sidebar = () => {
    const menuItems = [
      { id: 'dashboard', label: 'Dashboard', icon: Activity },
      { id: 'tiposfarmaco', label: 'Tipos de Fármaco', icon: Pill },
      { id: 'marcas', label: 'Marcas', icon: FileText },
      { id: 'ubicaciones', label: 'Ubicaciones', icon: MapPin },
      { id: 'medicamentos', label: 'Medicamentos', icon: Pill },
      { id: 'pacientes', label: 'Pacientes', icon: Users },
      { id: 'medicos', label: 'Médicos', icon: Stethoscope },
      { id: 'visitas', label: 'Visitas', icon: Calendar },
      { id: 'reportes', label: 'Reportes', icon: FileText },
    ];

    return (
      <div className="bg-gray-800 text-white w-64 min-h-screen p-4">
        <div className="mb-8">
          <h2 className="text-2xl font-bold">Dispensario</h2>
          <p className="text-sm text-gray-400">UNAPEC</p>
        </div>
        <nav>
          {menuItems.map(item => (
            <button
              key={item.id}
              onClick={() => {
                setCurrentView(item.id);
                setSearchTerm('');
              }}
              className={`w-full flex items-center gap-3 px-4 py-3 mb-2 rounded-lg transition-colors ${
                currentView === item.id
                  ? 'bg-blue-600 text-white'
                  : 'text-gray-300 hover:bg-gray-700'
              }`}
            >
              <item.icon size={20} />
              <span>{item.label}</span>
            </button>
          ))}
        </nav>
      </div>
    );
  };

  // Renderizado de vistas
  const renderView = () => {
    switch(currentView) {
      case 'dashboard':
        return <Dashboard />;

      case 'tiposfarmaco':
        return (
          <>
            <DataTable
              title="Tipos de Fármaco"
              data={tiposFarmaco}
              columns={[
                { label: 'ID', field: 'TipoFarmaco_ID' },
                { label: 'Descripción', field: 'Descripcion' },
                { label: 'Estado', field: 'Estado_ID', render: (item) => item.Estado_ID === 1 ? 'Activo' : 'Inactivo' },
              ]}
              onAdd={() => { setModalData(null); setModalType('tipofarmaco'); setShowModal(true); }}
              onEdit={(item) => handleEdit('tipofarmaco', item)}
              onDelete={(item) => handleDelete('tiposfarmaco', item)}
              addButtonText="Agregar Tipo"
            />
            <FormModal
              isOpen={showModal && modalType === 'tipofarmaco'}
              onClose={() => setShowModal(false)}
              title={modalData ? 'Editar Tipo de Fármaco' : 'Nuevo Tipo de Fármaco'}
            >
              <TipoFarmacoForm
                data={modalData}
                onSave={(data) => handleSave('tiposfarmaco', data)}
                onCancel={() => setShowModal(false)}
              />
            </FormModal>
          </>
        );

      case 'pacientes':
        return (
          <>
            <DataTable
              title="Pacientes"
              data={pacientes}
              columns={[
                { label: 'Nombre', field: 'Nombre' },
                { label: 'Cédula', field: 'Cedula' },
                { label: 'No. Carnet', field: 'NumeroCarnet' },
                { label: 'Tipo', field: 'TipoPaciente_ID', render: (item) => {
                  const tipo = tiposPaciente.find(t => t.TipoPaciente_ID === item.TipoPaciente_ID);
                  return tipo ? tipo.Nombre : '-';
                }},
                { label: 'Estado', field: 'Estado_ID', render: (item) => item.Estado_ID === 1 ? 'Activo' : 'Inactivo' },
              ]}
              onAdd={() => { setModalData(null); setModalType('paciente'); setShowModal(true); }}
              onEdit={(item) => handleEdit('paciente', item)}
              onDelete={(item) => handleDelete('pacientes', item)}
              addButtonText="Agregar Paciente"
            />
            <FormModal
              isOpen={showModal && modalType === 'paciente'}
              onClose={() => setShowModal(false)}
              title={modalData ? 'Editar Paciente' : 'Nuevo Paciente'}
            >
              <PacienteForm
                data={modalData}
                onSave={(data) => handleSave('pacientes', data)}
                onCancel={() => setShowModal(false)}
              />
            </FormModal>
          </>
        );

      case 'medicos':
        return (
          <DataTable
            title="Médicos"
            data={medicos}
            columns={[
              { label: 'Nombre', field: 'Nombre' },
              { label: 'Cédula', field: 'Cedula' },
              { label: 'Especialidad', field: 'Especialidad_ID' },
              { label: 'Tanda Labor', field: 'TandaLabor_ID', render: (item) => {
                const tanda = tandasLabor.find(t => t.TandaLabor_ID === item.TandaLabor_ID);
                return tanda ? tanda.Nombre : '-';
              }},
              { label: 'Estado', field: 'Estado_ID', render: (item) => item.Estado_ID === 1 ? 'Activo' : 'Inactivo' },
            ]}
            onAdd={() => alert('Formulario de Médico')}
            onEdit={(item) => alert('Editar: ' + item.Nombre)}
            onDelete={(item) => handleDelete('medicos', item)}
            addButtonText="Agregar Médico"
          />
        );

      case 'medicamentos':
        return (
          <DataTable
            title="Medicamentos"
            data={medicamentos}
            columns={[
              { label: 'Descripción', field: 'Descripcion' },
              { label: 'Tipo', field: 'TipoFarmaco_ID' },
              { label: 'Marca', field: 'Marca_ID' },
              { label: 'Dosis', field: 'Dosis' },
              { label: 'Ubicación', field: 'Ubicacion_ID' },
              { label: 'Estado', field: 'Estado_ID', render: (item) => item.Estado_ID === 1 ? 'Activo' : 'Inactivo' },
            ]}
            onAdd={() => alert('Formulario de Medicamento')}
            onEdit={(item) => alert('Editar: ' + item.Descripcion)}
            onDelete={(item) => handleDelete('medicamentos', item)}
            addButtonText="Agregar Medicamento"
          />
        );

      case 'visitas':
        return (
          <>
            <DataTable
              title="Registro de Visitas"
              data={visitas}
              columns={[
                { label: 'Fecha', field: 'FechaVisita' },
                { label: 'Hora', field: 'HoraVisita' },
                { label: 'Paciente', field: 'Paciente_ID' },
                { label: 'Médico', field: 'Medico_ID' },
                { label: 'Síntomas', field: 'Sintoma_ID', render: (item) => item.Sintoma_ID?.substring(0, 30) + '...' },
              ]}
              onAdd={() => { setModalData(null); setModalType('visita'); setShowModal(true); }}
              onEdit={(item) => handleEdit('visita', item)}
              onDelete={(item) => handleDelete('visitas', item)}
              addButtonText="Registrar Visita"
            />
            <FormModal
              isOpen={showModal && modalType === 'visita'}
              onClose={() => setShowModal(false)}
              title={modalData ? 'Editar Visita' : 'Nueva Visita'}
            >
              <VisitaForm
                data={modalData}
                onSave={(data) => handleSave('visitas', data)}
                onCancel={() => setShowModal(false)}
              />
            </FormModal>
          </>
        );

      case 'marcas':
        return (
          <DataTable
            title="Marcas de Laboratorios"
            data={marcas}
            columns={[
              { label: 'ID', field: 'Marca_ID' },
              { label: 'Descripción', field: 'Descripcion' },
              { label: 'Estado', field: 'Estado_ID', render: (item) => item.Estado_ID === 1 ? 'Activo' : 'Inactivo' },
            ]}
            onAdd={() => alert('Formulario de Marca')}
            onEdit={(item) => alert('Editar: ' + item.Descripcion)}
            onDelete={(item) => handleDelete('marcas', item)}
            addButtonText="Agregar Marca"
          />
        );

      case 'ubicaciones':
        return (
          <DataTable
            title="Ubicaciones"
            data={ubicaciones}
            columns={[
              { label: 'Descripción', field: 'Descripcion' },
              { label: 'Estante', field: 'Estante' },
              { label: 'Tramo', field: 'Tramo' },
              { label: 'Celda', field: 'Celda' },
              { label: 'Estado', field: 'Estado_ID', render: (item) => item.Estado_ID === 1 ? 'Activo' : 'Inactivo' },
            ]}
            onAdd={() => alert('Formulario de Ubicación')}
            onEdit={(item) => alert('Editar: ' + item.Descripcion)}
            onDelete={(item) => handleDelete('ubicaciones', item)}
            addButtonText="Agregar Ubicación"
          />
        );

      case 'reportes':
        return <ReportesView />;

      default:
        return <Dashboard />;
    }
  };

  // Vista de Reportes
  const ReportesView = () => {
    const [filtros, setFiltros] = useState({
      medico: '',
      paciente: '',
      fechaInicio: '',
      fechaFin: ''
    });

    const handleGenerarReporte = () => {
      console.log('Generar reporte con filtros:', filtros);
      alert('Generando reporte...');
    };

    return (
      <div className="space-y-6">
        <h1 className="text-3xl font-bold text-gray-800">Reportes de Visitas</h1>

        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
            <Filter className="text-blue-500" />
            Filtros de Búsqueda
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Médico</label>
              <select
                value={filtros.medico}
                onChange={(e) => setFiltros({...filtros, medico: e.target.value})}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              >
                <option value="">Todos los médicos</option>
                {medicos.map(medico => (
                  <option key={medico.Medico_ID} value={medico.Medico_ID}>{medico.Nombre}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Paciente</label>
              <select
                value={filtros.paciente}
                onChange={(e) => setFiltros({...filtros, paciente: e.target.value})}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              >
                <option value="">Todos los pacientes</option>
                {pacientes.map(paciente => (
                  <option key={paciente.Paciente_ID} value={paciente.Paciente_ID}>{paciente.Nombre}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Fecha Inicio</label>
              <input
                type="date"
                value={filtros.fechaInicio}
                onChange={(e) => setFiltros({...filtros, fechaInicio: e.target.value})}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Fecha Fin</label>
              <input
                type="date"
                value={filtros.fechaFin}
                onChange={(e) => setFiltros({...filtros, fechaFin: e.target.value})}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>

          <div className="flex justify-end gap-3 mt-6">
            <button
              onClick={() => setFiltros({ medico: '', paciente: '', fechaInicio: '', fechaFin: '' })}
              className="px-6 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
            >
              Limpiar Filtros
            </button>
            <button
              onClick={handleGenerarReporte}
              className="flex items-center gap-2 px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              <FileText size={20} />
              Generar Reporte
            </button>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-xl font-semibold mb-4">Resultados del Reporte</h2>
          {visitas.length === 0 ? (
            <div className="text-center py-12 text-gray-500">
              <FileText className="mx-auto mb-4 text-gray-300" size={64} />
              <p>No hay datos disponibles</p>
              <p className="text-sm">Seleccione los filtros y genere un reporte</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50 border-b-2 border-gray-200">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Fecha</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Paciente</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Médico</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Síntomas</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Medicamento</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {visitas.map((visita, index) => (
                    <tr key={index} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap text-sm">{visita.FechaVisita}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm">{visita.Paciente_ID}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm">{visita.Medico_ID}</td>
                      <td className="px-6 py-4 text-sm">{visita.Sintoma_ID}</td>
                      <td className="px-6 py-4 text-sm">{visita.Medicamento_ID || 'N/A'}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    );
  };

  return (
    <div className="flex min-h-screen bg-gray-100">
      <Sidebar />
      <div className="flex-1 p-8">
        {renderView()}
      </div>
    </div>
  );
};

export default DispensarioApp;

