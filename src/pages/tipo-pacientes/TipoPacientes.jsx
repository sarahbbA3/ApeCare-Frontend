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
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

import { UserCircle, Plus, Search, Edit, Trash2 } from "lucide-react";

import Layout from "../../components/common/Layout";
import {
  obtenerTipoPacientes,
  crearTipoPaciente,
  editarTipoPaciente,
  eliminarTipoPaciente,
} from "../../services/TipoPacientesServices";
import { obtenerPacientes } from "../../services/PacientesServices"; // 👈 nuevo

const TipoPacientes = () => {
  const [tipos, setTipos] = useState([]);
  const [pacientes, setPacientes] = useState([]);
  const [conteoPorTipo, setConteoPorTipo] = useState({});

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const [formOpen, setFormOpen] = useState(false);
  const [formMode, setFormMode] = useState("create");
  const [selectedItem, setSelectedItem] = useState(null);

  const [formData, setFormData] = useState({
    nombre: "",
    descripcion: "",
  });

  useEffect(() => {
    cargarDatos();
  }, []);

  useEffect(() => {
    actualizarConteo(pacientes);
  }, [pacientes]);

  const cargarDatos = async () => {
    setLoading(true);
    setError(null);
    try {
      const [tiposData, pacientesData] = await Promise.all([
        obtenerTipoPacientes(),
        obtenerPacientes(),
      ]);
      setTipos(tiposData || []);
      setPacientes(pacientesData || []);
      actualizarConteo(pacientesData);
    } catch (err) {
      console.error("Error cargando datos:", err);
      setError("No se pudieron cargar los tipos de paciente");
    } finally {
      setLoading(false);
    }
  };

  const actualizarConteo = (pacientesData) => {
    const conteo = {};
    (pacientesData || []).forEach((p) => {
      const tipoId = p.tipoPacienteId;
      if (!tipoId) return;
      conteo[tipoId] = (conteo[tipoId] || 0) + 1;
    });
    setConteoPorTipo(conteo);
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
      nombre: item.nombre,
      descripcion: item.descripcion,
    });
    setFormOpen(true);
  };

  const handleDelete = async (id) => {
    if (!window.confirm("¿Eliminar este tipo de paciente?")) return;
    try {
      await eliminarTipoPaciente(id);
      cargarDatos();
    } catch (err) {
      console.error("Error al eliminar tipo de paciente:", err);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const payload = {
      nombre: formData.nombre,
      descripcion: formData.descripcion,
    };
    try {
      if (formMode === "edit" && selectedItem) {
        await editarTipoPaciente(selectedItem.id, payload);
      } else {
        await crearTipoPaciente(payload);
      }
      setFormOpen(false);
      cargarDatos();
    } catch (err) {
      console.error("Error guardando tipo de paciente:", err);
    }
  };

  const formatearFecha = (d) => (d ? d.split("T")[0] : "-");

  return (
    <Layout>
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8 flex items-center gap-3">
          <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10">
            <UserCircle className="h-6 w-6 text-primary" />
          </div>
          <div>
            <h1 className="text-3xl font-bold text-foreground">Tipos de Paciente</h1>
            <p className="text-muted-foreground">
              Gestiona las categorías de pacientes
            </p>
          </div>
        </div>

        {/* Actions Bar */}
        <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input placeholder="Buscar tipo de paciente..." className="pl-10" />
          </div>

          <Button className="gap-2" onClick={handleCreate}>
            <Plus className="h-4 w-4" />
            Nuevo Tipo
          </Button>
        </div>

        {/* Error or Loading */}
        {loading ? (
          <p className="text-muted-foreground">Cargando tipos de paciente...</p>
        ) : error ? (
          <p className="text-destructive">{error}</p>
        ) : tipos.length === 0 ? (
          <p className="text-muted-foreground">No hay tipos registrados.</p>
        ) : (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {tipos.map((tipo) => (
              <Card key={tipo.id} className="hover:shadow-md transition-shadow">
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div>
                      <CardTitle>{tipo.nombre}</CardTitle>
                      <CardDescription>{tipo.descripcion}</CardDescription>
                    </div>
                    <Badge variant="secondary">
                      {conteoPorTipo[tipo.id] || 0} {/* 👈 número dinámico */}
                    </Badge>
                  </div>
                </CardHeader>

                <CardContent>
                  <div className="space-y-3 text-sm">
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Creación:</span>
                      <span className="font-medium text-xs">
                        {formatearFecha(tipo.fechaCreacion)}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Actualización:</span>
                      <span className="font-medium text-xs">
                        {formatearFecha(tipo.fechaActualizacion)}
                      </span>
                    </div>

                    {/* Botones */}
                    <div className="flex gap-2 pt-2">
                      <Button
                        variant="outline"
                        size="sm"
                        className="flex-1 gap-2 bg-transparent"
                        onClick={() => handleEdit(tipo)}
                      >
                        <Edit className="h-3 w-3" />
                        Editar
                      </Button>

                      <Button
                        variant="outline"
                        size="sm"
                        className="flex-1 gap-2 text-destructive bg-transparent hover:text-destructive"
                        onClick={() => handleDelete(tipo.id)}
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
          <DialogContent className="sm:max-w-[500px]">
            <DialogHeader>
              <DialogTitle>
                {formMode === "create" ? "Nuevo Tipo de Paciente" : "Editar Tipo de Paciente"}
              </DialogTitle>
              <DialogDescription>
                {formMode === "create"
                  ? "Agrega un nuevo tipo de paciente al sistema"
                  : "Modifica la información del tipo de paciente"}
              </DialogDescription>
            </DialogHeader>

            <form onSubmit={handleSubmit}>
              <div className="grid gap-4 py-4">
                <div className="grid gap-2">
                  <Label htmlFor="nombre">Nombre</Label>
                  <Input
                    id="nombre"
                    value={formData.nombre}
                    onChange={(e) =>
                      setFormData({ ...formData, nombre: e.target.value })
                    }
                    placeholder="Ej: Paciente Regular"
                    required
                  />
                </div>

                <div className="grid gap-2">
                  <Label htmlFor="descripcion">Descripción</Label>
                                    <Textarea
                    id="descripcion"
                    rows={3}
                    value={formData.descripcion}
                    onChange={(e) =>
                      setFormData({ ...formData, descripcion: e.target.value })
                    }
                    placeholder="Describe el tipo de paciente..."
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
                  {formMode === "create" ? "Crear" : "Guardar Cambios"}
                </Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      </div>
    </Layout>
  );
};

export default TipoPacientes;