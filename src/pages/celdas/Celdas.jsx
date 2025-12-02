import { useEffect, useState } from "react";
import { obtenerCeldas, crearCelda, editarCelda, eliminarCelda } from "../../services/CeldasServices";
import { obtenerTramos } from "../../services/TramosServices";
import { obtenerUbicaciones } from "../../services/UbicacionesServices";
import Layout from "../../components/common/Layout";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Search, Plus, Edit, Trash2, Box } from "lucide-react";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useAuth } from "@/hooks/useAuth";
import AccessDenied from "@/components/common/AccessDenied";

const Celdas = () => {
  const { usuario } = useAuth();
  const esMedico = usuario?.rol === "MEDICO"; // valido por rol

  if (esMedico) {
    return (
      <Layout>
        <AccessDenied />
      </Layout>
    );
  }
  const [listCeldas, setListCeldas] = useState([]);
  const [listTramos, setListTramos] = useState([]);
  const [listUbicaciones, setListUbicaciones] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [formOpen, setFormOpen] = useState(false);
  const [formMode, setFormMode] = useState("create");
  const [formData, setFormData] = useState({ nombre: "", tramoId: "", estadoId: 1 });
  const [editandoCelda, setEditandoCelda] = useState(null);

  useEffect(() => {
    cargarCeldas();
    cargarTramos();
    cargarUbicaciones();
  }, []);

  const cargarCeldas = async () => {
    const data = await obtenerCeldas();
    setListCeldas(data || []);
  };

  const cargarTramos = async () => {
    const data = await obtenerTramos();
    setListTramos(data || []);
  };

  const cargarUbicaciones = async () => {
    const data = await obtenerUbicaciones();
    setListUbicaciones(data || []);
  };

  const handleCreate = () => {
    setFormMode("create");
    setEditandoCelda(null);
    setFormData({ nombre: "", tramoId: "", estadoId: 1 });
    setFormOpen(true);
  };

  const handleEdit = (item) => {
    setFormMode("edit");
    setEditandoCelda(item);
    setFormData({
      nombre: item?.nombre || "",
      tramoId: item?.tramoId?.toString() || "",
      estadoId: item?.estadoId || 1,
    });
    setFormOpen(true);
  };

  const handleDelete = async (id) => {
    if (!window.confirm("¿Eliminar esta celda?")) return;
    try {
      await eliminarCelda(id, 3);
      cargarCeldas();
    } catch {
      alert("Error al eliminar");
    }
  };

  const guardarCelda = async (e) => {
    e.preventDefault();

    // se valida máximo 4 celdas por tramo
    const celdasEnTramo = listCeldas.filter((c) => String(c.tramoId) === String(formData.tramoId));

    const tramoOriginal = editandoCelda?.tramoId?.toString();
    const tramoNuevo = formData.tramoId;
    const tramoCambiado = editandoCelda && tramoOriginal !== tramoNuevo;

    if ((!editandoCelda || tramoCambiado) && celdasEnTramo.length >= 4) {
      alert("Este tramo ya tiene 4 celdas. No se pueden asignar más.");
      return;
    }

    try {
      if (formMode === "edit" && editandoCelda) {
        await editarCelda(editandoCelda.id, formData);
      } else {
        await crearCelda(formData);
      }
      setFormOpen(false);
      cargarCeldas();
    } catch {
      alert("Error al guardar la celda");
    }
  };

  const filteredCeldas = listCeldas.filter(
    (c) =>
      c.nombre.toLowerCase().includes(searchTerm.toLowerCase()) ||
      c.tramoNombre?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      c.estanteNombre?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const totalCeldas = listCeldas.length;

  const getEstadoBadge = (estado) => {
    const variants = {
      Disponible: "secondary",
      Ocupada: "default",
      Llena: "outline",
      "Bajo Stock": "destructive",
    };
    return <Badge variant={variants[estado] || "default"}>{estado}</Badge>;
  };

  const formatearFecha = (d) => (d ? d.split("T")[0] : "-");

  return (
    <Layout>
      <div className="container mx-auto px-4 py-8">
        {/* HEADER */}
        <div className="mb-8 flex items-center gap-3">
          <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10">
            <Box className="h-6 w-6 text-primary" />
          </div>
          <div>
            <h1 className="text-3xl font-bold">Celdas</h1>
            <p className="text-muted-foreground">Controla las unidades individuales de almacenamiento</p>
          </div>
        </div>

        {/* SEARCH + NEW */}
        <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder="Buscar celda..."
              className="pl-10"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

          <Button className="gap-2" onClick={handleCreate}>
            <Plus className="h-4 w-4" />
            Nueva Celda
          </Button>
        </div>

        {/* STATS */}
        <div className="grid gap-4 md:grid-cols-1 mb-8">
          <Card>
            <CardHeader>
              <CardDescription>Total Celdas</CardDescription>
              <CardTitle className="text-3xl">{totalCeldas}</CardTitle>
            </CardHeader>
          </Card>
        </div>

        {/* CELDAS GRID */}
        {filteredCeldas.length === 0 ? (
          <div className="text-center py-12">
            <Box className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-semibold mb-2">No se encontraron celdas</h3>
            <p className="text-muted-foreground">Intenta con otros términos de búsqueda</p>
          </div>
        ) : (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {filteredCeldas.map((c) => {
              const ubicacionActual = listUbicaciones.find((u) => u.celdaId === c.id);

              return (
                <Card key={c.id} className="hover:shadow-md transition-shadow">
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <div>
                        <CardTitle className="text-base">{c.nombre}</CardTitle>
                        <CardDescription className="text-sm">
                          {c.estanteNombre} — {c.tramoNombre}
                        </CardDescription>
                      </div>
                      {getEstadoBadge(c.estado)}
                    </div>
                  </CardHeader>

                  <CardContent>
                    <div className="space-y-3 text-sm">
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Ubicación:</span>
                        <span className="font-medium">
                          {ubicacionActual ? ubicacionActual.nombre : "No asignada"}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Creación:</span>
                        <span className="font-medium">{formatearFecha(c.fechaCreacion)}</span>
                      </div>
                                            <div className="flex justify-between">
                        <span className="text-muted-foreground">Actualización:</span>
                        <span className="font-medium">{formatearFecha(c.fechaActualizacion)}</span>
                      </div>

                      <div className="flex gap-2 pt-2">
                        <Button
                          variant="outline"
                          size="sm"
                          className="flex-1 gap-2 bg-transparent"
                          onClick={() => handleEdit(c)}
                        >
                          <Edit className="h-3 w-3" />
                          Editar
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          className="flex-1 gap-2 text-destructive hover:text-destructive bg-transparent"
                          onClick={() => handleDelete(c.id)}
                        >
                          <Trash2 className="h-3 w-3" />
                          Eliminar
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        )}

        {/* MODAL FORM */}
        <Dialog open={formOpen} onOpenChange={setFormOpen}>
          <DialogContent className="sm:max-w-[500px]">
            <DialogHeader>
              <DialogTitle>
                {formMode === "create" ? "Nueva Celda" : "Editar Celda"}
              </DialogTitle>
              <DialogDescription>
                {formMode === "create"
                  ? "Agrega una nueva celda al sistema de almacenamiento"
                  : "Modifica la información de la celda"}
              </DialogDescription>
            </DialogHeader>

            <form onSubmit={guardarCelda}>
              <div className="grid gap-4 py-4">
                <div className="grid gap-2">
                  <Label htmlFor="nombre">Nombre</Label>
                  <Input
                    id="nombre"
                    placeholder="Celda 01"
                    value={formData.nombre}
                    onChange={(e) =>
                      setFormData({ ...formData, nombre: e.target.value })
                    }
                    required
                  />
                </div>

                <div className="grid gap-2">
                  <Label htmlFor="tramoId">Tramo</Label>
                  <Select
                    value={formData.tramoId}
                    onValueChange={(value) =>
                      setFormData({ ...formData, tramoId: value })
                    }
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Seleccionar tramo" />
                    </SelectTrigger>
                    <SelectContent>
                      {listTramos.map((t) => (
                        <SelectItem key={t.id} value={String(t.id)}>
                          {`${t.estanteNombre || "-"} → ${t.nombre}`}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
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
                  {formMode === "create" ? "Crear Celda" : "Guardar Cambios"}
                </Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      </div>
    </Layout>
  );
};

export default Celdas;