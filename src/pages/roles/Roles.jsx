import { useEffect, useState } from "react";
import {
  obtenerRoles,
  crearRol,
  editarRol,
  eliminarRol,
} from "../../services/RolesServices";
import Layout from "../../components/common/Layout";
import { useAuth } from "../../context/AuthContext";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Shield, Search, Plus, Edit, Trash2, Users } from "lucide-react";
import { Label } from "@/components/ui/label";
import { X } from "lucide-react";

const Roles = () => {
  const { usuario } = useAuth();
  const esMedico = usuario?.rol === "MEDICO"; // valido por rol

  if (esMedico) {
    return (
      <Layout>
        <div className="min-h-screen flex items-center justify-center text-slate-600 text-lg">
          No tienes permisos para acceder a esta sección.
        </div>
      </Layout>
    );
  }

  const [roles, setRoles] = useState([]);
  const [formData, setFormData] = useState({
    nombre: "",
    descripcion: "",
  });
  const [editandoRol, setEditandoRol] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [error, setError] = useState(null);
  const [cargando, setCargando] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    cargarRoles();
  }, []);

  const cargarRoles = async () => {
    setCargando(true);
    setError(null);
    try {
      const data = await obtenerRoles();
      setRoles(data || []);
    } catch (err) {
      console.error("Error al cargar roles:", err);
      setError("No se pudieron cargar los roles");
    } finally {
      setCargando(false);
    }
  };

  const abrirModal = (rol = null) => {
    setEditandoRol(rol);
    setFormData({
      nombre: rol?.nombre || "",
      descripcion: rol?.descripcion || "",
    });
    setIsModalOpen(true);
  };

  const cerrarModal = () => {
    setIsModalOpen(false);
    setEditandoRol(null);
    setFormData({
      nombre: "",
      descripcion: "",
    });
  };

  const guardarRol = async (e) => {
    e.preventDefault();
    const payload = {
      nombre: formData.nombre,
      descripcion: formData.descripcion,
    };

    try {
      if (editandoRol) {
        await editarRol(editandoRol.id, payload);
      } else {
        await crearRol(payload);
      }
      cerrarModal();
      cargarRoles();
    } catch (err) {
      console.error("Error al guardar rol:", err);
      alert("Hubo un error al guardar");
    }
  };

  const eliminar = async (id) => {
    if (!window.confirm("¿Eliminar este rol?")) return;
    try {
      await eliminarRol(id);
      cargarRoles();
    } catch (err) {
      console.error("Error al eliminar:", err);
      alert("Hubo un error al eliminar");
    }
  };

  const formatearFecha = (d) => d || "-";

  const totalRoles = roles.length;
  const rolesActivos = roles.filter((r) => r.activo).length;
  const totalUsuarios = roles.reduce((sum, r) => sum + (r.usuariosAsignados || 0), 0);

  const filteredRoles = roles.filter(
    (rol) =>
      rol.nombre.toLowerCase().includes(searchTerm.toLowerCase()) ||
      rol.descripcion.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <Layout>
      <div className="container mx-auto p-6 space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-foreground flex items-center gap-2">
              <Shield className="h-8 w-8 text-primary" />
              Roles del Sistema
            </h1>
            <p className="text-muted-foreground mt-1">Gestiona roles y accesos de usuario</p>
          </div>

          <Button
            onClick={() => abrirModal()}
            className="gap-2"
          >
            <Plus className="h-4 w-4" />
            Agregar Rol
          </Button>
        </div>

        {/* Stats */}
        <div className="grid gap-4 md:grid-cols-3">
          <div className="bg-card rounded-lg border border-border p-6">
            <p className="text-sm font-medium text-muted-foreground">Total de Roles</p>
            <p className="text-2xl font-bold text-foreground">{totalRoles}</p>
          </div>

          <div className="bg-card rounded-lg border border-border p-6">
            <p className="text-sm font-medium text-muted-foreground">Usuarios Asignados</p>
            <p className="text-2xl font-bold text-foreground">{totalUsuarios}</p>
          </div>
        </div>

        {/* Search + Table */}
        <div className="bg-card rounded-lg border border-border p-6">
          <div className="relative mb-4">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder="Buscar rol por nombre o descripción..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>

          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-border">
                  <th className="text-left p-3 text-sm font-semibold text-muted-foreground">Nombre</th>
                  <th className="text-left p-3 text-sm font-semibold text-muted-foreground">Descripción</th>
                  <th className="text-left p-3 text-sm font-semibold text-muted-foreground">Creación</th>
                  <th className="text-left p-3 text-sm font-semibold text-muted-foreground">Actualización</th>
                  <th className="text-center p-3 text-sm font-semibold text-muted-foreground">Usuarios</th>
                  <th className="text-center p-3 text-sm font-semibold text-muted-foreground">Acciones</th>
                </tr>
              </thead>

              <tbody>
                {filteredRoles.length === 0 ? (
                  <tr>
                    <td colSpan="6" className="px-4 py-6 text-center text-muted-foreground">
                      No hay roles registrados
                    </td>
                  </tr>
                ) : (
                  filteredRoles.map((r) => (
                    <tr key={r.id} className="border-b border-border hover:bg-muted/50">
                      <td className="p-3 font-medium text-foreground">{r.nombre}</td>
                      <td className="p-3 text-muted-foreground">{r.descripcion}</td>
                      <td className="p-3 text-muted-foreground">{formatearFecha(r.fechaCreacion)}</td>
                      <td className="p-3 text-muted-foreground">{formatearFecha(r.fechaActualizacion)}</td>
                      <td className="p-3 text-center">
                        <span className="inline-flex items-center gap-1 text-muted-foreground">
                          <Users className="h-4 w-4" />
                          {r.usuariosAsignados}
                        </span>
                      </td>
                      <td className="p-3 text-center">
                        <div className="flex items-center justify-center gap-2">
                          <Button variant="ghost" size="sm" onClick={() => abrirModal(r)}>
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button variant="ghost" size="sm" onClick={() => eliminar(r.id)}>
                            <Trash2 className="h-4 w-4" />
                          </Button>
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

      {/* FORM MODAL */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-background/80 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-card border border-border rounded-lg w-full max-w-xl p-6 shadow-xl overflow-y-auto max-h-[90vh]">
            {/* HEADER */}
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-semibold text-foreground">
                {editandoRol ? "Editar Rol" : "Nuevo Rol"}
                            </h2>
              <Button variant="ghost" size="icon" onClick={cerrarModal}>
                <X className="h-4 w-4" />
              </Button>
            </div>

            {/* FORM */}
            <form onSubmit={guardarRol} className="space-y-4">
              {/* Nombre */}
              <div>
                <Label htmlFor="nombre">Nombre del Rol</Label>
                <Input
                  id="nombre"
                  value={formData.nombre}
                  onChange={(e) => setFormData({ ...formData, nombre: e.target.value })}
                  placeholder="Ej: Supervisor"
                  required
                />
              </div>

              {/* Descripción */}
              <div>
                <Label htmlFor="descripcion">Descripción</Label>
                <textarea
                  id="descripcion"
                  value={formData.descripcion}
                  onChange={(e) => setFormData({ ...formData, descripcion: e.target.value })}
                  placeholder="Descripción del rol..."
                  rows={3}
                  className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                  required
                />
              </div>

              {/* Botones */}
              <div className="flex gap-2 pt-4">
                <Button
                  type="button"
                  variant="outline"
                  onClick={cerrarModal}
                  className="flex-1 bg-transparent"
                >
                  Cancelar
                </Button>
                <Button type="submit" className="flex-1">
                  {editandoRol ? "Actualizar" : "Guardar"}
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </Layout>
  );
};

export default Roles;