import { useEffect, useState } from "react";
import {
  obtenerUsuarios,
  crearUsuario,
  editarUsuario,
  eliminarUsuario,
} from "../../services/UsuariosServices";
import { obtenerRoles } from "../../services/RolesServices";
import Layout from "../../components/common/Layout";
import { useAuth } from "../../context/AuthContext";
import AccessDenied from "@/components/common/AccessDenied";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { UserPen, Search, Plus, Edit, Trash2, Mail, Shield, BrickWallShield } from "lucide-react";
import { Label } from "@/components/ui/label";
import { X } from "lucide-react";

const Usuarios = () => {
  const { usuario } = useAuth();
  const esMedico = usuario?.rol === "MEDICO"; // valido por rol

  if (esMedico) {
    return (
      <Layout>
        <AccessDenied />
      </Layout>
    );
  }

  const [usuarios, setUsuarios] = useState([]);
  const [roles, setRoles] = useState([]);
  const [formData, setFormData] = useState({
    correo: "",
    nombre: "",
    contrasena: "",
    rolId: "",
  });
  const [editandoUsuario, setEditandoUsuario] = useState(null);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    cargarUsuarios();
    cargarRoles();
  }, []);

  const cargarUsuarios = async () => {
    try {
      const data = await obtenerUsuarios();
      setUsuarios(data || []);
    } catch (err) {
      console.error("Error al cargar usuarios:", err);
    }
  };

  const cargarRoles = async () => {
    try {
      const data = await obtenerRoles();
      setRoles(data || []);
    } catch (err) {
      console.error("Error al cargar roles:", err);
    }
  };

  const abrirModal = (usuario = null) => {
    setEditandoUsuario(usuario);
    setFormData({
      correo: usuario?.correo || "",
      nombre: usuario?.nombre || "",
      contrasena: usuario?.contrasena || "",
      rolId: usuario?.rolId?.toString() || "",
    });
    setIsFormOpen(true);
  };

  const cerrarModal = () => {
    setIsFormOpen(false);
    setEditandoUsuario(null);
    setFormData({
      correo: "",
      nombre: "",
      contrasena: "",
      rolId: "",
    });
  };

  const guardarUsuario = async (e) => {
    e.preventDefault();

    const payload = {
      correo: formData.correo,
      nombre: formData.nombre,
      contrasena: formData.contrasena, 
      rolId: formData.rolId,
      estadoId: 1, 
    };

    try {
      if (editandoUsuario) {
        await editarUsuario(editandoUsuario.id, payload);
      } else {
        await crearUsuario(payload);
      }
      cerrarModal();
      cargarUsuarios();
    } catch (err) {
      console.error("Error al guardar usuario:", err);
      alert("Hubo un error al guardar");
    }
  };

  const eliminar = async (id) => {
    if (!window.confirm("¿Eliminar este usuario?")) return;
    try {
      await eliminarUsuario(id);
      cargarUsuarios();
    } catch (err) {
      console.error("Error al eliminar:", err);
      alert("Hubo un error al eliminar");
    }
  };

  const filteredUsuarios = usuarios.filter(
    (u) =>
      u.nombre.toLowerCase().includes(searchTerm.toLowerCase()) ||
      u.correo.toLowerCase().includes(searchTerm.toLowerCase()) ||
      roles.find((r) => r.id === u.rolId)?.nombre.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const totalUsuarios = usuarios.length;
  const usuariosActivos = usuarios.filter((u) => u.estadoId === 1).length;
  const usuariosInactivos = usuarios.filter((u) => u.estadoId !== 1).length;

  return (
    <Layout>
      <div className="container mx-auto p-6 space-y-6">
        {/* HEADER */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-foreground flex items-center gap-2">
              <UserPen className="h-8 w-8 text-primary" />
              Usuarios del Sistema
            </h1>
            <p className="text-muted-foreground mt-1">Gestiona los usuarios y sus accesos</p>
          </div>
          <Button
            className="gap-2"
            onClick={() => abrirModal()}
          >
            <Plus className="h-4 w-4" />
            Agregar Usuario
          </Button>
        </div>

        {/* CARDS DE MÉTRICAS */}
        <div className="grid gap-4 md:grid-cols-3">
          <div className="bg-card rounded-lg border border-border p-6">
            <p className="text-sm font-medium text-muted-foreground">Total de Usuarios</p>
            <p className="text-2xl font-bold text-foreground">{totalUsuarios}</p>
          </div>
        </div>

        {/* BUSCADOR */}
        <div className="bg-card rounded-lg border border-border p-6">
          <div className="relative mb-4">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Buscar usuario por nombre, correo o rol..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>

          {/* GRID DE USUARIOS */}
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {filteredUsuarios.map((u) => (
              <div
                key={u.id}
                className="bg-background border border-border rounded-lg p-4 hover:shadow-md transition-shadow"
              >
                <div className="flex items-start justify-between mb-3">
                  {/* Avatar */}
                  <div className="flex items-center gap-3">
                    <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center">
                      <span className="text-lg font-semibold text-primary">
                        {u.nombre[0]}
                      </span>
                    </div>

                    <div>
                      <h3 className="font-semibold text-foreground">{u.nombre}</h3>
                      <div className="flex items-center gap-1 mt-1">
                        <Shield className="h-3 w-3 text-muted-foreground" />
                        <span className="text-xs text-muted-foreground">
                          {roles.find((r) => r.id === u.rolId)?.nombre || "-"}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Estado */}
                  <span
                    className={`px-2 py-1 rounded-full text-xs font-medium ${
                      u.estadoId === 1
                        ? "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400"
                        : "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400"
                    }`}
                  >
                    {u.estadoId === 1 ? "Activo" : "Inactivo"}
                  </span>
                </div>

                {/* Contacto */}
                <div className="space-y-2 mb-4">
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Mail className="h-4 w-4" />
                    {u.correo}
                  </div>
                </div>

                {/* Fechas */}
                <div className="text-xs text-muted-foreground mb-3">
                  <div>Creado: {u.fechaCreacion || "-"}</div>
                  <div>Actualizado: {u.fechaActualizacion || "-"}</div>
                </div>

                {/* Botones */}
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    className="flex-1"
                    onClick={() => abrirModal(u)}
                  >
                    <Edit className="h-4 w-4 mr-1" /> Editar
                  </Button>

                  <Button
                    variant="outline"
                    size="sm"
                    className="text-red-500"
                    onClick={() => eliminar(u.id)}
                  >
                    <Trash2 className="h-4 w-4" /> Eliminar
                  </Button>
                </div>
              </div>
            ))}
          </div>

          {filteredUsuarios.length === 0 && (
            <div className="py-8 text-center text-muted-foreground">
              No se encontraron usuarios que coincidan con la búsqueda
            </div>
          )}
        </div>
      </div>

      {/* FORM MODAL */}
      {isFormOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-background/80 backdrop-blur-sm">
          <div className="bg-card border border-border rounded-lg shadow-lg w-full max-w-md p-6 max-h-[90vh] overflow-y-auto">
            {/* HEADER */}
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-semibold text-foreground">
                {editandoUsuario ? "Editar Usuario" : "Agregar Usuario"}
              </h2>
              <Button variant="ghost" size="icon" onClick={cerrarModal}>
                <X className="h-4 w-4" />
              </Button>
            </div>

            {/* FORM */}
            <form onSubmit={guardarUsuario} className="space-y-4">
              {/* Correo */}
              <div>
                <Label htmlFor="correo">Correo Electrónico</Label>
                <Input
                  id="correo"
                  type="email"
                  value={formData.correo}
                  onChange={(e) => setFormData({ ...formData, correo: e.target.value })}
                  placeholder="usuario@apecare.com"
                  required
                />
              </div>

              {/* Nombre */}
              <div>
                <Label htmlFor="nombre">Nombre</Label>
                <Input
                  id="nombre"
                  type="text"
                  value={formData.nombre}
                  onChange={(e) => setFormData({ ...formData, nombre: e.target.value })}
                  placeholder="Ej: Juan Pérez"
                  required
                />
              </div>

              {/* Contraseña */}
              <div>
                <Label htmlFor="contrasena">Contraseña</Label>
                <Input
                  id="contrasena"
                  type="password"
                  value={formData.contrasena}
                  onChange={(e) => setFormData({ ...formData, contrasena: e.target.value })}
                  placeholder="Contraseña"
                  required
                />
              </div>

              {/* Rol */}
              <div>
                <Label htmlFor="rolId">Rol</Label>
                <select
                  id="rolId"
                  value={formData.rolId}
                  onChange={(e) => setFormData({ ...formData, rolId: e.target.value })}
                  className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm focus-visible:ring-2 focus-visible:ring-ring"
                  required
                >
                  <option value="">Seleccionar rol...</option>
                  {roles.map((rol) => (
                    <option key={rol.id} value={rol.id}>
                      {rol.nombre}
                    </option>
                  ))}
                </select>
              </div>

              {/* Botones */}
              <div className="flex gap-2 pt-4">
                <Button type="button" variant="outline" className="flex-1" onClick={cerrarModal}>
                  Cancelar
                </Button>
                <Button type="submit" className="flex-1">
                  {editandoUsuario ? "Actualizar" : "Guardar"}
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </Layout>
  );
};

export default Usuarios;