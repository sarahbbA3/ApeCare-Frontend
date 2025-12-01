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

import { Users, Plus, Search, Edit, Trash2 } from "lucide-react";

import Layout from "../../components/common/Layout";
import {
  obtenerPacientes,
  crearPaciente,
  editarPaciente,
  eliminarPaciente,
} from "../../services/PacientesServices";
import { obtenerTipoPacientes } from "../../services/TipoPacientesServices";

const Pacientes = () => {
  const [pacientes, setPacientes] = useState([]);
  const [tiposPaciente, setTiposPaciente] = useState([]);
  const [formData, setFormData] = useState({
    nombre: "",
    cedula: "",
    numeroCarnet: "",
    tipoPacienteId: "",
    edad: 0,
  });
  const [editandoPaciente, setEditandoPaciente] = useState(null);
  const [formOpen, setFormOpen] = useState(false);
  const [error, setError] = useState(null);
  const [cargando, setCargando] = useState(false);

  const [searchTerm, setSearchTerm] = useState(""); // 👈 nuevo

  useEffect(() => {
    cargarPacientes();
    cargarTiposPaciente();
  }, []);

  const cargarPacientes = async () => {
    setCargando(true);
    setError(null);
    try {
      const data = await obtenerPacientes();
      setPacientes(data || []);
    } catch (err) {
      console.error("Error al cargar pacientes:", err);
      setError("No se pudieron cargar los pacientes");
    } finally {
      setCargando(false);
    }
  };

  const cargarTiposPaciente = async () => {
    try {
      const data = await obtenerTipoPacientes();
      setTiposPaciente(data || []);
    } catch (err) {
      console.error("Error al cargar tipos de paciente:", err);
    }
  };

  const abrirModal = (paciente = null) => {
    setEditandoPaciente(paciente);
    setFormData({
      nombre: paciente?.nombre || "",
      cedula: paciente?.cedula || "",
      numeroCarnet: paciente?.numeroCarnet || "",
      tipoPacienteId: paciente?.tipoPacienteId?.toString() || "",
      edad: paciente?.edad || 0,
    });
    setFormOpen(true);
  };

  const cerrarModal = () => {
    setFormOpen(false);
    setEditandoPaciente(null);
    setFormData({
      nombre: "",
      cedula: "",
      numeroCarnet: "",
      tipoPacienteId: "",
      edad: 0,
    });
  };

  const tipoSeleccionado = tiposPaciente.find(
    (t) => t.id === parseInt(formData.tipoPacienteId)
  );

  const guardarPaciente = async (e) => {
    e.preventDefault();
    if (formData.edad < 0) {
      alert("La edad no puede ser negativa");
      return;
    }

    const payload = {
      nombre: formData.nombre,
      cedula: formData.cedula,
      numeroCarnet:
        tipoSeleccionado?.nombre?.toLowerCase() === "estudiante"
          ? formData.numeroCarnet
          : null,
      tipoPacienteId: formData.tipoPacienteId,
      edad: formData.edad,
    };

    try {
      if (editandoPaciente) {
        await editarPaciente(editandoPaciente.id, payload);
      } else {
        await crearPaciente(payload);
      }
      cerrarModal();
      cargarPacientes();
    } catch (err) {
      console.error("Error al guardar paciente:", err);
      alert("Hubo un error al guardar");
    }
  };

  const eliminar = async (id) => {
    if (!window.confirm("¿Eliminar este paciente?")) return;
    try {
      await eliminarPaciente(id);
      cargarPacientes();
    } catch (err) {
      console.error("Error al eliminar:", err);
      alert("Hubo un error al eliminar");
    }
  };

  const formatearFecha = (d) => (d ? d.split("T")[0] : "-");

  // 👈 Filtrado dinámico extendido (nombre, tipo, identificación, edad)
  const filteredPacientes = pacientes.filter((p) => {
    const nombre = p.nombre?.toLowerCase() || "";
    const tipo = tiposPaciente.find((t) => t.id === p.tipoPacienteId)?.nombre?.toLowerCase() || "";
    const identificacion = `${p.cedula} ${p.numeroCarnet || ""}`.toLowerCase();
    const edad = String(p.edad);

    return (
      nombre.includes(searchTerm.toLowerCase()) ||
      tipo.includes(searchTerm.toLowerCase()) ||
      identificacion.includes(searchTerm.toLowerCase()) ||
      edad.includes(searchTerm.toLowerCase())
    );
  });

  return (
    <Layout>
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8 flex items-center gap-3">
          <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10">
            <Users className="h-6 w-6 text-primary" />
          </div>
          <div>
            <h1 className="text-3xl font-bold text-foreground">Pacientes</h1>
            <p className="text-muted-foreground">
              Gestiona la información de los pacientes
            </p>
          </div>
        </div>

        {/* Actions Bar */}
        <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder="Buscar por nombre, tipo, identificación o edad..."
              className="pl-10"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

          <Button className="gap-2" onClick={() => abrirModal()}>
            <Plus className="h-4 w-4" />
            Nuevo Paciente
          </Button>
        </div>

        {/* Error or Loading */}
        {cargando ? (
          <p className="text-muted-foreground">Cargando pacientes...</p>
        ) : error ? (
          <p className="text-destructive">{error}</p>
        ) : filteredPacientes.length === 0 ? (
          <div className="text-center py-12">
            <Users className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-semibold mb-2">
              No se encontraron pacientes
            </h3>
            <p className="text-muted-foreground">
              Intenta con otros términos de búsqueda
            </p>
          </div>
        ) : (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {filteredPacientes.map((p) => (
              <Card key={p.id} className="hover:shadow-md transition-shadow">
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div>
                      <CardTitle className="text-lg">{p.nombre}</CardTitle>
                      <CardDescription>{p.cedula}</CardDescription>
                    </div>
                    <Badge variant="secondary">
                      {tiposPaciente.find((t) => t.id === p.tipoPacienteId)?.nombre || "-"}
                    </Badge>
                  </div>
                </CardHeader>

                <CardContent>
                  <div className="space-y-3 text-sm">
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Edad:</span>
                      <span className="font-medium">{p.edad} años</span>
                    </div>

                    <div className="flex justify-between text-xs text-muted-foreground">
                      <span>Registro: {formatearFecha(p.fechaRegistro)}</span>
                      <span>Actualización: {formatearFecha(p.fechaActualizacion)}</span>
                    </div>

                    {/* Botones */}
                    <div className="flex gap-2 pt-2">
                      <Button
                        variant="outline"
                        size="sm"
                        className="flex-1 gap-2 bg-transparent"
                        onClick={() => abrirModal(p)}
                      >
                        <Edit className="h-3 w-3" />
                        Editar
                      </Button>

                      <Button
                                                variant="outline"
                        size="sm"
                        className="flex-1 gap-2 text-destructive bg-transparent hover:text-destructive"
                        onClick={() => eliminar(p.id)}
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
                {editandoPaciente ? "Editar Paciente" : "Nuevo Paciente"}
              </DialogTitle>
              <DialogDescription>
                {editandoPaciente
                  ? "Modifica la información del paciente"
                  : "Agrega un nuevo paciente al sistema"}
              </DialogDescription>
            </DialogHeader>

            <form onSubmit={guardarPaciente}>
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
                    placeholder="Ej: María González"
                    required
                  />
                </div>

                {/* Cédula + Edad */}
                <div className="grid grid-cols-2 gap-4">
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

                  <div className="grid gap-2">
                    <Label htmlFor="edad">Edad</Label>
                    <Input
                      id="edad"
                      type="number"
                      min={0}
                      value={formData.edad}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          edad: Math.max(0, Number(e.target.value)),
                        })
                      }
                      placeholder="0"
                      required
                    />
                  </div>
                </div>

                {/* Tipo de Paciente */}
                <div className="grid gap-2">
                  <Label htmlFor="tipoPaciente">Tipo de Paciente</Label>
                  <select
                    id="tipoPaciente"
                    value={formData.tipoPacienteId}
                    onChange={(e) =>
                      setFormData({ ...formData, tipoPacienteId: e.target.value })
                    }
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg"
                    required
                  >
                    <option value="">Seleccionar tipo</option>
                    {tiposPaciente.map((tipo) => (
                      <option key={tipo.id} value={tipo.id}>
                        {tipo.nombre}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Número de Carnet (solo estudiantes) */}
                {tipoSeleccionado?.nombre?.toLowerCase() === "estudiante" && (
                  <div className="grid gap-2">
                    <Label htmlFor="numeroCarnet">Número de Carnet</Label>
                    <Input
                      id="numeroCarnet"
                      value={formData.numeroCarnet}
                      onChange={(e) =>
                        setFormData({ ...formData, numeroCarnet: e.target.value })
                      }
                      placeholder="Carnet estudiantil"
                      required
                    />
                  </div>
                )}
              </div>

              <DialogFooter>
                <Button
                  type="button"
                  variant="outline"
                  onClick={cerrarModal}
                >
                  Cancelar
                </Button>
                <Button type="submit">
                  {editandoPaciente ? "Actualizar" : "Guardar"}
                </Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      </div>
    </Layout>
  );
};

export default Pacientes;