import React, { useEffect, useState } from "react";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import {
  UserCog,
  Plus,
  Search,
  Edit,
  Trash2,
  IdCard,
} from "lucide-react";

import Layout from "../../components/common/Layout";
import {
  obtenerMedicos,
  crearMedico,
  editarMedico,
  eliminarMedico,
} from "../../services/MedicosServices";
import { obtenerEspecialidades } from "../../services/EspecialidadesServices";
import { obtenerTandas } from "../../services/TandaLaboresServices";
import { obtenerUsuarios } from "../../services/UsuariosServices";

const Medicos = () => {
  const [medicos, setMedicos] = useState([]);
  const [especialidades, setEspecialidades] = useState([]);
  const [tandas, setTandas] = useState([]);
  const [usuarios, setUsuarios] = useState([]);
  const [usuariosDisponibles, setUsuariosDisponibles] = useState([]);

  const [formData, setFormData] = useState({
    nombre: "",
    cedula: "",
    especialidadId: "",
    tandaLaborId: "",
    usuarioId: "",
  });

  const [editando, setEditando] = useState(null);
  const [formOpen, setFormOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState(""); // 👈 nuevo

  useEffect(() => {
    cargarDatos();
  }, []);

  const cargarDatos = async (medicoEnEdicion = null) => {
    const [m, e, t, u] = await Promise.all([
      obtenerMedicos(),
      obtenerEspecialidades(),
      obtenerTandas(),
      obtenerUsuarios(),
    ]);
    setMedicos(m || []);
    setEspecialidades(e || []);
    setTandas(t || []);
    setUsuarios(u || []);

    const usados = m.map((medico) => medico.usuarioId);
    let disponibles = u.filter((usuario) => !usados.includes(usuario.id));

    if (medicoEnEdicion?.usuarioId) {
      const usuarioActual = u.find((u) => u.id === medicoEnEdicion.usuarioId);
      if (usuarioActual && !disponibles.some((d) => d.id === usuarioActual.id)) {
        disponibles = [usuarioActual, ...disponibles];
      }
    }

    setUsuariosDisponibles(disponibles || []);
  };

  const abrirModal = (medico = null) => {
    setEditando(medico);
    setFormData({
      nombre: medico?.nombre || "",
      cedula: medico?.cedula || "",
      especialidadId: medico?.especialidadId || "",
      tandaLaborId: medico?.tandaLaborId || "",
      usuarioId: medico?.usuarioId || "",
    });
    setFormOpen(true);
    cargarDatos(medico);
  };

  const cerrarModal = () => {
    setFormOpen(false);
    setEditando(null);
    setFormData({
      nombre: "",
      cedula: "",
      especialidadId: "",
      tandaLaborId: "",
      usuarioId: "",
    });
  };

  const guardarMedico = async (e) => {
    e.preventDefault();
    try {
      if (editando) {
        await editarMedico(editando.id, formData);
      } else {
        await crearMedico(formData);
      }
      cerrarModal();
      cargarDatos();
    } catch (err) {
      console.error("Error al guardar médico:", err);
      alert("Hubo un error al guardar");
    }
  };

  const eliminar = async (id) => {
    if (!window.confirm("¿Eliminar este médico?")) return;
    try {
      await eliminarMedico(id);
      cargarDatos();
    } catch (err) {
      console.error("Error al eliminar:", err);
      alert("Hubo un error al eliminar");
    }
  };

  const formatearFecha = (d) => (d ? d.split("T")[0] : "-");

  const obtenerNombreEspecialidad = (id) =>
    especialidades.find((e) => e.id === id)?.nombre || "-";

  const obtenerNombreTanda = (id) =>
    tandas.find((t) => t.id === id)?.nombre || "-";

  // 👈 Filtrado dinámico extendido
  const filteredMedicos = medicos.filter((m) => {
    const nombreEspecialidad = obtenerNombreEspecialidad(m.especialidadId).toLowerCase();
    const nombreTanda = obtenerNombreTanda(m.tandaLaborId).toLowerCase();

    return (
      m.nombre.toLowerCase().includes(searchTerm.toLowerCase()) ||
      m.cedula.toLowerCase().includes(searchTerm.toLowerCase()) ||
      nombreEspecialidad.includes(searchTerm.toLowerCase()) ||
      nombreTanda.includes(searchTerm.toLowerCase())
    );
  });

  return (
    <Layout>
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8 flex items-center gap-3">
          <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10">
            <UserCog className="h-6 w-6 text-primary" />
          </div>
          <div>
            <h1 className="text-3xl font-bold text-foreground">Médicos</h1>
            <p className="text-muted-foreground">
              Gestiona el personal médico del dispensario
            </p>
          </div>
        </div>

        {/* Actions Bar */}
        <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder="Buscar médico por nombre, cédula, especialidad o tanda..."
              className="pl-10"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

          <Button className="gap-2" onClick={() => abrirModal()}>
            <Plus className="h-4 w-4" />
            Nuevo Médico
          </Button>
        </div>

        {/* Lista de Médicos */}
        {filteredMedicos.length === 0 ? (
          <div className="text-center py-12">
            <UserCog className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-semibold mb-2">
              No se encontraron médicos
            </h3>
            <p className="text-muted-foreground">
              Intenta con otros términos de búsqueda
            </p>
          </div>
        ) : (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {filteredMedicos.map((m) => (
              <Card key={m.id} className="hover:shadow-md transition-shadow">
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div>
                      <CardTitle className="text-lg">{m.nombre}</CardTitle>
                      <CardDescription>
                        {obtenerNombreEspecialidad(m.especialidadId)}
                      </CardDescription>
                    </div>
                    <Badge variant="secondary">Activo</Badge>
                  </div>
                </CardHeader>

                <CardContent>
                  <div className="space-y-3 text-sm">
                    <div className="flex items-center gap-2 text-muted-foreground">
                      <IdCard className="h-3 w-3" />
                                            <span className="text-xs">{m.cedula}</span>
                    </div>

                    <div className="flex justify-between pt-2 border-t text-xs text-muted-foreground">
                      <span>Tanda:</span>
                      <span className="font-medium">
                        {obtenerNombreTanda(m.tandaLaborId)}
                      </span>
                    </div>

                    <div className="flex justify-between text-xs text-muted-foreground">
                      <span>Creación: {formatearFecha(m.fechaCreacion)}</span>
                      <span>Actualización: {formatearFecha(m.fechaActualizacion)}</span>
                    </div>

                    {/* Botones */}
                    <div className="flex gap-2 pt-2">
                      <Button
                        variant="outline"
                        size="sm"
                        className="flex-1 gap-2 bg-transparent"
                        onClick={() => abrirModal(m)}
                      >
                        <Edit className="h-3 w-3" />
                        Editar
                      </Button>

                      <Button
                        variant="outline"
                        size="sm"
                        className="flex-1 gap-2 text-destructive hover:text-destructive bg-transparent"
                        onClick={() => eliminar(m.id)}
                      >
                        <Trash2 className="h-3 w-3" />
                        Eliminar
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}

        {/* Modal Form */}
        <Dialog open={formOpen} onOpenChange={setFormOpen}>
          <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>
                {editando ? "Editar Médico" : "Nuevo Médico"}
              </DialogTitle>
              <DialogDescription>
                {editando
                  ? "Modifica la información del médico"
                  : "Agrega un nuevo médico al sistema"}
              </DialogDescription>
            </DialogHeader>

            <form onSubmit={guardarMedico}>
              <div className="grid gap-4 py-4">
                {/* Nombre */}
                <div className="grid gap-2">
                  <Label htmlFor="nombre">Nombre Completo</Label>
                  <Input
                    id="nombre"
                    value={formData.nombre}
                    onChange={(e) =>
                      setFormData({ ...formData, nombre: e.target.value })
                    }
                    placeholder="Dr. Roberto Fernández"
                    required
                  />
                </div>

                {/* Especialidad + Cédula */}
                <div className="grid grid-cols-2 gap-4">
                  <div className="grid gap-2">
                    <Label htmlFor="especialidadId">Especialidad</Label>
                    <Select
                      value={String(formData.especialidadId)}
                      onValueChange={(value) =>
                        setFormData({ ...formData, especialidadId: Number(value) })
                      }
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Seleccionar especialidad" />
                      </SelectTrigger>
                      <SelectContent>
                        {especialidades.map((e) => (
                          <SelectItem key={e.id} value={String(e.id)}>
                            {e.nombre}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="grid gap-2">
                    <Label htmlFor="cedula">Cédula</Label>
                    <Input
                      id="cedula"
                      value={formData.cedula}
                      onChange={(e) =>
                        setFormData({ ...formData, cedula: e.target.value })
                      }
                      placeholder="001-1234567-8"
                      required
                    />
                  </div>
                </div>

                {/* Tanda + Usuario */}
                <div className="grid grid-cols-2 gap-4">
                  <div className="grid gap-2">
                    <Label htmlFor="tandaLaborId">Tanda Laboral</Label>
                    <Select
                      value={String(formData.tandaLaborId)}
                      onValueChange={(value) =>
                        setFormData({ ...formData, tandaLaborId: Number(value) })
                      }
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Seleccionar tanda" />
                      </SelectTrigger>
                      <SelectContent>
                        {tandas.map((t) => (
                          <SelectItem key={t.id} value={String(t.id)}>
                            {t.nombre}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="grid gap-2">
                    <Label htmlFor="usuarioId">Usuario vinculado</Label>
                    <Select
                      value={String(formData.usuarioId)}
                      onValueChange={(value) =>
                        setFormData({ ...formData, usuarioId: Number(value) })
                      }
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Seleccionar usuario" />
                      </SelectTrigger>
                      <SelectContent>
                        {usuariosDisponibles.map((u) => (
                          <SelectItem key={u.id} value={String(u.id)}>
                            {u.nombre} ({u.correo})
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </div>

              <DialogFooter>
                <Button type="button" variant="outline" onClick={cerrarModal}>
                  Cancelar
                </Button>
                <Button type="submit">
                  {editando ? "Actualizar" : "Guardar"}
                </Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      </div>
    </Layout>
  );
};

export default Medicos;