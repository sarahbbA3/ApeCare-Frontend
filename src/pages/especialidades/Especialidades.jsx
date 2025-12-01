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
import { GraduationCap, Plus, Search, Edit, Trash2 } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

import Layout from "../../components/common/Layout";
import {
  obtenerEspecialidades,
  crearEspecialidad,
  editarEspecialidad,
  eliminarEspecialidad,
} from "../../services/EspecialidadesServices";

const Especialidades = () => {
  const [especialidades, setEspecialidades] = useState([]);
  const [formOpen, setFormOpen] = useState(false);
  const [formMode, setFormMode] = useState("create");
  const [selectedItem, setSelectedItem] = useState(null);
  const [formData, setFormData] = useState({ nombre: "", descripcion: "" });
  const [error, setError] = useState(null);
  const [cargando, setCargando] = useState(false);
  const [searchTerm, setSearchTerm] = useState(""); // 👈 nuevo

  useEffect(() => {
    cargarEspecialidades();
  }, []);

  const cargarEspecialidades = async () => {
    setCargando(true);
    setError(null);
    try {
      const data = await obtenerEspecialidades();
      setEspecialidades(data || []);
    } catch (err) {
      console.error("Error al cargar especialidades:", err);
      setError("No se pudieron cargar las especialidades");
    } finally {
      setCargando(false);
    }
  };

  const handleCreate = () => {
    setFormMode("create");
    setSelectedItem(null);
    setFormData({ nombre: "", descripcion: "" });
    setFormOpen(true);
  };

  const handleEdit = (item) => {
    setFormMode("edit");
    setSelectedItem(item);
    setFormData({
      nombre: item?.nombre || "",
      descripcion: item?.descripcion || "",
    });
    setFormOpen(true);
  };

  const handleDelete = async (id) => {
    if (!window.confirm("¿Eliminar esta especialidad?")) return;
    try {
      await eliminarEspecialidad(id);
      cargarEspecialidades();
    } catch (err) {
      console.error("Error al eliminar especialidad:", err);
      alert("Hubo un error al eliminar");
    }
  };

  const guardarEspecialidad = async (e) => {
    e.preventDefault();
    const payload = { ...formData };
    try {
      if (formMode === "edit" && selectedItem) {
        await editarEspecialidad(selectedItem.id, payload);
      } else {
        await crearEspecialidad(payload);
      }
      setFormOpen(false);
      setSelectedItem(null);
      setFormData({ nombre: "", descripcion: "" });
      cargarEspecialidades();
    } catch (err) {
      console.error("Error al guardar especialidad:", err);
      alert("Hubo un error al guardar");
    }
  };

  const formatearFecha = (d) => (d ? d.split("T")[0] : "-");

  // 👈 Filtrado dinámico
  const filteredEspecialidades = especialidades.filter(
    (e) =>
      e.nombre.toLowerCase().includes(searchTerm.toLowerCase()) ||
      e.descripcion.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <Layout>
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8 flex items-center gap-3">
          <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10">
            <GraduationCap className="h-6 w-6 text-primary" />
          </div>
          <div>
            <h1 className="text-3xl font-bold text-foreground">Especialidades</h1>
            <p className="text-muted-foreground">
              Gestiona las especialidades médicas disponibles
            </p>
          </div>
        </div>

        {/* Actions Bar */}
        <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder="Buscar especialidad..."
              className="pl-10"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

          <Button className="gap-2" onClick={handleCreate}>
            <Plus className="h-4 w-4" />
            Nueva Especialidad
          </Button>
        </div>

        {/* Error or Loading */}
        {cargando ? (
          <p className="text-muted-foreground">Cargando especialidades...</p>
        ) : error ? (
          <p className="text-destructive">{error}</p>
        ) : filteredEspecialidades.length === 0 ? (
          <div className="text-center py-12">
            <GraduationCap className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-semibold mb-2">
              No se encontraron especialidades
            </h3>
            <p className="text-muted-foreground">
              Intenta con otros términos de búsqueda
            </p>
          </div>
        ) : (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {filteredEspecialidades.map((e) => (
              <Card key={e.id} className="hover:shadow-md transition-shadow">
                <CardHeader>
                  <CardTitle className="text-lg">{e.nombre}</CardTitle>
                  <CardDescription>{e.descripcion}</CardDescription>
                </CardHeader>

                <CardContent>
                  <div className="space-y-3 text-sm">
                    <div className="flex justify-between text-xs text-muted-foreground">
                      <span>Creación: {formatearFecha(e.fechaCreacion)}</span>
                      <span>Actualización: {formatearFecha(e.fechaActualizacion)}</span>
                    </div>

                    {/* Botones */}
                    <div className="flex gap-2 pt-2">
                      <Button
                        variant="outline"
                        size="sm"
                        className="flex-1 gap-2 bg-transparent"
                        onClick={() => handleEdit(e)}
                      >
                        <Edit className="h-3 w-3" />
                        Editar
                      </Button>

                      <Button
                        variant="outline"
                        size="sm"
                        className="flex-1 gap-2 text-destructive hover:text-destructive bg-transparent"
                        onClick={() => handleDelete(e.id)}
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

        {/* Form Modal */}
        <Dialog open={formOpen} onOpenChange={setFormOpen}>
          <DialogContent className="sm:max-w-[500px]">
            <DialogHeader>
              <DialogTitle>
                {formMode === "create" ? "Nueva Especialidad" : "Editar Especialidad"}
              </DialogTitle>
              <DialogDescription>
                {formMode === "create"
                  ? "Agrega una nueva especialidad médica"
                  : "Modifica la información de la especialidad"}
              </DialogDescription>
            </DialogHeader>

            <form onSubmit={guardarEspecialidad}>
              <div className="grid gap-4 py-4">
                <div className="grid gap-2">
                  <Label htmlFor="nombre">Nombre de la Especialidad</Label>
                                    <Input
                    id="nombre"
                    value={formData.nombre}
                    onChange={(e) =>
                      setFormData({ ...formData, nombre: e.target.value })
                    }
                    placeholder="Ej: Cardiología"
                    required
                  />
                </div>

                <div className="grid gap-2">
                  <Label htmlFor="descripcion">Descripción</Label>
                  <Textarea
                    id="descripcion"
                    value={formData.descripcion}
                    onChange={(e) =>
                      setFormData({ ...formData, descripcion: e.target.value })
                    }
                    placeholder="Describe la especialidad médica..."
                    rows={4}
                    required
                  />
                </div>
              </div>

              <DialogFooter>
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setFormOpen(false)}
                >
                  Cancelar
                </Button>
                <Button type="submit">
                  {formMode === "create" ? "Crear Especialidad" : "Guardar Cambios"}
                </Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      </div>
    </Layout>
  );
};

export default Especialidades;