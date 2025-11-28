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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import { MapPin, Plus, Search, Package, Edit, Trash2 } from "lucide-react";

import Layout from "../../components/common/Layout";
import {
  obtenerUbicaciones,
  crearUbicacion,
  editarUbicacion,
  eliminarUbicacion,
} from "../../services/UbicacionesServices";
import { obtenerCeldas } from "../../services/CeldasServices";
import { obtenerTiposFarmaco } from "../../services/TipoFarmacosServices";
import { obtenerMedicamentos } from "../../services/MedicamentosServices";

const Ubicaciones = () => {
  const [ubicaciones, setUbicaciones] = useState([]);
  const [celdas, setCeldas] = useState([]);
  const [tiposFarmaco, setTiposFarmaco] = useState([]);

  const [medicamentos, setMedicamentos] = useState([]);
  const [productosPorUbicacion, setProductosPorUbicacion] = useState({}); // { ubicacionId: count }

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const [formOpen, setFormOpen] = useState(false);
  const [formMode, setFormMode] = useState("create");
  const [selectedItem, setSelectedItem] = useState(null);

  const [formData, setFormData] = useState({
    nombre: "",
    descripcion: "",
    tipoFarmacoId: "",
    celdaId: "",
  });

  useEffect(() => {
    // Carga inicial
    cargarTodo();
  }, []);

  useEffect(() => {
    // Recalcular conteo de productos por ubicación cuando cambien los medicamentos
    actualizarConteoProductos(medicamentos);
  }, [medicamentos]);

  const cargarTodo = async () => {
    setLoading(true);
    setError(null);
    try {
      const [ubics, celdasData, tiposData, meds] = await Promise.all([
        obtenerUbicaciones(),
        obtenerCeldas(),
        obtenerTiposFarmaco(),
        obtenerMedicamentos(),
      ]);
      setUbicaciones(ubics || []);
      setCeldas(celdasData || []);
      setTiposFarmaco(tiposData || []);
      setMedicamentos(meds || []);
    } catch (err) {
      console.error("Error cargando datos:", err);
      setError("Error cargando ubicaciones y dependencias");
    } finally {
      setLoading(false);
    }
  };

  const actualizarConteoProductos = (meds) => {
    const conteo = {};
    (meds || []).forEach((m) => {
      const uId = m.ubicacionId;
      if (!uId) return;
      conteo[uId] = (conteo[uId] || 0) + 1;
    });
    setProductosPorUbicacion(conteo);
  };

  const handleCreate = () => {
    setFormMode("create");
    setSelectedItem(null);
    setFormData({
      nombre: "",
      descripcion: "",
      tipoFarmacoId: "",
      celdaId: "",
    });
    setFormOpen(true);
  };

  const handleEdit = (item) => {
    setFormMode("edit");
    setSelectedItem(item);
    setFormData({
      nombre: item.nombre,
      descripcion: item.descripcion || "",
      tipoFarmacoId: String(item.tipoFarmacoId),
      celdaId: String(item.celdaId),
    });
    setFormOpen(true);
  };

  const handleDelete = async (id) => {
    if (!window.confirm("¿Eliminar esta ubicación?")) return;
    try {
      await eliminarUbicacion(id, 3);
      await cargarTodo();
    } catch (err) {
      console.error("Error eliminando ubicación:", err);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const payload = {
      nombre: formData.nombre,
      descripcion: formData.descripcion,
      tipoFarmacoId: parseInt(formData.tipoFarmacoId),
      celdaId: parseInt(formData.celdaId),
      estadoId: 1,
    };
    try {
      if (formMode === "edit" && selectedItem) {
        await editarUbicacion(selectedItem.id, payload);
      } else {
        await crearUbicacion(payload);
      }
      setFormOpen(false);
      await cargarTodo();
    } catch (err) {
      console.error("Error guardando ubicación:", err);
    }
  };

  const formatearFecha = (d) => (d ? d.split("T")[0] : "-");

  return (
    <Layout>
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8 flex items-center gap-3">
          <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10">
            <MapPin className="h-6 w-6 text-primary" />
          </div>
          <div>
            <h1 className="text-3xl font-bold text-foreground">Ubicaciones</h1>
            <p className="text-muted-foreground">
              Controla la ubicación física de los medicamentos
            </p>
          </div>
        </div>

        {/* Actions Bar */}
        <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input placeholder="Buscar ubicación..." className="pl-10" />
          </div>

          <Button className="gap-2" onClick={handleCreate}>
            <Plus className="h-4 w-4" />
            Nueva Ubicación
          </Button>
        </div>

        {/* Error or Loading */}
        {loading ? (
          <p className="text-muted-foreground">Cargando ubicaciones...</p>
        ) : error ? (
          <p className="text-destructive">{error}</p>
        ) : ubicaciones.length === 0 ? (
          <p className="text-muted-foreground">No hay ubicaciones registradas.</p>
        ) : (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {ubicaciones.map((u) => (
              <Card key={u.id} className="hover:shadow-md transition-shadow">
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div>
                      <CardTitle>{u.nombre}</CardTitle>
                      <CardDescription>{u.descripcion}</CardDescription>
                    </div>
                    <Badge>Activa</Badge>
                  </div>
                </CardHeader>

                <CardContent>
                  <div className="space-y-3 text-sm">
                    {/* Tipo de fármaco */}
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Tipo de fármaco:</span>
                      <span className="font-medium">{u.tipoFarmacoNombre}</span>
                    </div>

                    {/* Jerarquía: Estante → Tramo → Celda */}
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Ubicación:</span>
                      <span className="font-medium text-xs">
                        {`${u.estanteNombre} → ${u.tramoNombre} → ${u.celdaNombre}`}
                      </span>
                    </div>

                    {/* Productos (conteo dinámico) */}
                    <div className="flex items-center gap-2">
                      <Package className="h-4 w-4 text-muted-foreground" />
                      <span className="text-sm text-muted-foreground">
                        {productosPorUbicacion[u.id] || 0} productos
                      </span>
                    </div>

                    {/* Fechas */}
                    <div className="flex justify-between text-xs text-muted-foreground">
                      <span>Creación: {formatearFecha(u.fechaCreacion)}</span>
                      <span>Actualización: {formatearFecha(u.fechaActualizacion)}</span>
                    </div>

                    {/* Botones */}
                    <div className="flex gap-2 pt-2">
                      <Button
                        variant="outline"
                        size="sm"
                        className="flex-1 gap-2 bg-transparent"
                        onClick={() => handleEdit(u)}
                      >
                        <Edit className="h-3 w-3" />
                        Editar
                      </Button>

                      <Button
                        variant="outline"
                        size="sm"
                        className="flex-1 gap-2 text-destructive bg-transparent hover:text-destructive"
                        onClick={() => handleDelete(u.id)}
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
                {formMode === "create" ? "Nueva Ubicación" : "Editar Ubicación"}
              </DialogTitle>
              <DialogDescription>
                {formMode === "create"
                  ? "Agrega una nueva ubicación al sistema"
                  : "Modifica la información de la ubicación"}
              </DialogDescription>
            </DialogHeader>

            <form onSubmit={handleSubmit}>
              <div className="grid gap-4 py-4">
                {/* Nombre */}
                <div className="grid gap-2">
                  <Label htmlFor="nombre">Nombre de la Ubicación</Label>
                  <Input
                    id="nombre"
                    value={formData.nombre}
                    onChange={(e) =>
                      setFormData({ ...formData, nombre: e.target.value })
                    }
                    placeholder="Ej: Sala A - Estante 1"
                    required
                  />
                </div>

                {/* Tipo de Fármaco */}
                <div className="grid gap-2">
                  <Label htmlFor="tipoFarmaco">Tipo de Fármaco</Label>
                  <Select
                    value={formData.tipoFarmacoId}
                    onValueChange={(value) =>
                      setFormData({ ...formData, tipoFarmacoId: value })
                    }
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Seleccionar tipo" />
                    </SelectTrigger>
                    <SelectContent>
                      {tiposFarmaco.map((t) => (
                        <SelectItem key={t.id} value={String(t.id)}>
                          {t.nombre}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {/* Celda */}
                <div className="grid gap-2">
                  <Label htmlFor="celda">Celda</Label>
                  <Select
                    value={formData.celdaId}
                    onValueChange={(value) =>
                      setFormData({ ...formData, celdaId: value })
                    }
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Seleccionar celda" />
                    </SelectTrigger>
                    <SelectContent>
                      {celdas.map((c) => (
                        <SelectItem key={c.id} value={String(c.id)}>
                          {`${c.estanteNombre || "-"} → ${c.tramoNombre || "-"} → ${c.nombre}`}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {/* Descripción */}
                <div className="grid gap-2">
                  <Label htmlFor="descripcion">Descripción</Label>
                  <Textarea
                    id="descripcion"
                    rows={3}
                    value={formData.descripcion}
                    onChange={(e) =>
                      setFormData({ ...formData, descripcion: e.target.value })
                    }
                    placeholder="Describe la ubicación..."
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

export default Ubicaciones;