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
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Pill, Plus, Search, Edit, Trash2, AlertCircle } from "lucide-react";

import Layout from "../../components/common/Layout";
import {
  obtenerMedicamentos,
  crearMedicamento,
  editarMedicamento,
  eliminarMedicamento,
} from "../../services/MedicamentosServices";
import { obtenerUbicaciones } from "../../services/UbicacionesServices";
import { obtenerTiposFarmaco } from "../../services/TipoFarmacosServices";
import { obtenerMarcas } from "../../services/MarcasServices";

const Medicamentos = () => {
  const [medicamentos, setMedicamentos] = useState([]);
  const [formOpen, setFormOpen] = useState(false);
  const [formMode, setFormMode] = useState("create");
  const [selectedItem, setSelectedItem] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const [tiposFarmaco, setTiposFarmaco] = useState([]);
  const [marcas, setMarcas] = useState([]);
  const [ubicaciones, setUbicaciones] = useState([]);

  const [formData, setFormData] = useState({
    descripcion: "",
    dosis: "",
    cantidadDisponible: 0,
    fechaVencimiento: "",
    tipoFarmacoId: "",
    marcaId: "",
    ubicacionId: "",
    descripcionExtra: "",
  });

  const fechaMinimaVencimiento = new Date(Date.now() + 60 * 24 * 60 * 60 * 1000)
    .toISOString()
    .split("T")[0];

  useEffect(() => {
    cargarMedicamentos();
    cargarListas();
  }, []);

  const cargarMedicamentos = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await obtenerMedicamentos();
      setMedicamentos(data || []);
    } catch (err) {
      console.error("Error cargando medicamentos:", err);
      setError("Hubo un error al cargar los medicamentos.");
    } finally {
      setLoading(false);
    }
  };

  const cargarListas = async () => {
    try {
      const [ubic, tipos, marcas] = await Promise.all([
        obtenerUbicaciones(),
        obtenerTiposFarmaco(),
        obtenerMarcas(),
      ]);
      setUbicaciones(ubic || []);
      setTiposFarmaco(tipos || []);
      setMarcas(marcas || []);
    } catch (err) {
      console.error("Error cargando listas:", err);
    }
  };

  const handleCreate = () => {
    setFormMode("create");
    setSelectedItem(null);
    setFormData({
      descripcion: "",
      dosis: "",
      cantidadDisponible: 0,
      fechaVencimiento: "",
      tipoFarmacoId: "",
      marcaId: "",
      ubicacionId: "",
      descripcionExtra: "",
    });
    setFormOpen(true);
  };

  const handleEdit = (item) => {
  setFormMode("edit");
  setSelectedItem(item);
  setFormData({
    descripcion: item.descripcion,
    dosis: item.dosis,
    cantidadDisponible: item.cantidadDisponible,
    fechaVencimiento: item.fechaVencimiento,
    tipoFarmacoId: String(item.tipoFarmacoId),   
    marcaId: String(item.marcaId),            
    ubicacionId: String(item.ubicacionId),       
    descripcionExtra: item.descripcionExtra || "",
  });
  setFormOpen(true);
};

  const handleDelete = async (id) => {
    if (!window.confirm("¿Seguro que deseas eliminar este medicamento?")) return;
    try {
      await eliminarMedicamento(id);
      cargarMedicamentos();
    } catch (err) {
      console.error("Error eliminando medicamento:", err);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (formMode === "edit" && selectedItem) {
        await editarMedicamento(selectedItem.id, formData);
      } else {
        await crearMedicamento(formData);
      }
      setFormOpen(false);
      cargarMedicamentos();
    } catch (err) {
      console.error("Error guardando medicamento:", err);
    }
  };

  const vencimientoProximo = (fecha) => {
    return new Date(fecha) <= new Date(fechaMinimaVencimiento);
  };

  const formatearFecha = (d) => (d ? d.split("T")[0] : "-");

  return (
    <Layout>
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8 flex items-center gap-3">
          <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10">
            <Pill className="h-6 w-6 text-primary" />
          </div>
          <div>
            <h1 className="text-3xl font-bold text-foreground">Medicamentos</h1>
            <p className="text-muted-foreground">
              Gestiona el inventario completo de medicamentos
            </p>
          </div>
        </div>

        {/* Actions Bar */}
        <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input placeholder="Buscar medicamento..." className="pl-10" />
          </div>

          <Button className="gap-2" onClick={handleCreate}>
            <Plus className="h-4 w-4" />
            Nuevo Medicamento
          </Button>
        </div>

        {/* Error or Loading */}
        {loading ? (
          <p className="text-muted-foreground">Cargando medicamentos...</p>
        ) : error ? (
          <p className="text-destructive">{error}</p>
        ) : medicamentos.length === 0 ? (
          <p className="text-muted-foreground">No hay medicamentos registrados.</p>
        ) : (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {medicamentos.map((med) => (
              <Card key={med.id} className="hover:shadow-md transition-shadow">
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <CardTitle className="text-lg">{med.descripcion}</CardTitle>
                      <CardDescription>{med.tipoFarmacoNombre}</CardDescription>
                    </div>
                    {med.cantidadDisponible <= 0 ? (
                      <Badge variant="destructive" className="gap-1">
                        <AlertCircle className="h-3 w-3" />
                        Sin stock
                      </Badge>
                    ) : vencimientoProximo(med.fechaVencimiento) ? (
                      <Badge variant="warning" className="gap-1">
                        Próximo a vencer
                      </Badge>
                    ) : null}
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Dosis:</span>
                      <span className="font-medium">{med.dosis}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Cantidad:</span>
                      <span className="font-medium">{med.cantidadDisponible}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Marca:</span>
                      <span className="font-medium">{med.marcaNombre}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Ubicación:</span>
                      <span className="font-medium text-xs">
                        {`${med.estanteNombre} → ${med.tramoNombre} → ${med.celdaNombre}`}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Vencimiento:</span>
                      <span className="font-medium text-xs">
                        {formatearFecha(med.fechaVencimiento)}
                                            </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Creación:</span>
                      <span className="font-medium text-xs">
                        {formatearFecha(med.fechaCreacion)}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Actualización:</span>
                      <span className="font-medium text-xs">
                        {formatearFecha(med.fechaActualizacion)}
                      </span>
                    </div>
                  </div>

                  <div className="flex gap-2 pt-2">
                    <Button
                      variant="outline"
                      size="sm"
                      className="flex-1 gap-2 bg-transparent"
                      onClick={() => handleEdit(med)}
                    >
                      <Edit className="h-3 w-3" />
                      Editar
                    </Button>

                    <Button
                      variant="outline"
                      size="sm"
                      className="flex-1 gap-2 text-destructive hover:text-destructive bg-transparent"
                      onClick={() => handleDelete(med.id)}
                    >
                      <Trash2 className="h-3 w-3" />
                      Eliminar
                    </Button>
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
                {formMode === "create" ? "Nuevo Medicamento" : "Editar Medicamento"}
              </DialogTitle>
              <DialogDescription>
                {formMode === "create"
                  ? "Agrega un nuevo medicamento al inventario"
                  : "Modifica la información del medicamento"}
              </DialogDescription>
            </DialogHeader>

            <form onSubmit={handleSubmit}>
              <div className="grid gap-4 py-4">
                {/* Descripción */}
                <div className="grid gap-2">
                  <Label htmlFor="descripcion">Nombre / Descripción</Label>
                  <Input
                    id="descripcion"
                    value={formData.descripcion}
                    onChange={(e) =>
                      setFormData({ ...formData, descripcion: e.target.value })
                    }
                    placeholder="Ej: Amoxicilina 500mg"
                    required
                  />
                </div>

                {/* Dosis y Cantidad */}
                <div className="grid grid-cols-2 gap-4">
                  <div className="grid gap-2">
                    <Label htmlFor="dosis">Dosis</Label>
                    <Input
                      id="dosis"
                      value={formData.dosis}
                      onChange={(e) =>
                        setFormData({ ...formData, dosis: e.target.value })
                      }
                      placeholder="Ej: 1 cada 8 horas"
                      required
                    />
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="cantidad">Cantidad Disponible</Label>
                    <Input
                      id="cantidad"
                      type="number"
                      value={formData.cantidadDisponible}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          cantidadDisponible: parseInt(e.target.value),
                        })
                      }
                      placeholder="0"
                      required
                    />
                  </div>
                </div>

                {/* Tipo y Marca */}
                <div className="grid grid-cols-2 gap-4">
                  <div className="grid gap-2">
                    <Label htmlFor="tipo">Tipo de Fármaco</Label>
                    <Select
                      value={formData.tipoFarmacoId}
                      onValueChange={(value) =>
                        setFormData({ ...formData, tipoFarmacoId: value, ubicacionId: "" })
                      }
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Seleccionar tipo" />
                      </SelectTrigger>
                      <SelectContent>
                        {tiposFarmaco.map((tipo) => (
                          <SelectItem key={tipo.id} value={String(tipo.id)}>
                            {tipo.nombre}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="grid gap-2">
                    <Label htmlFor="marca">Marca</Label>
                    <Select
                      value={formData.marcaId}
                      onValueChange={(value) =>
                        setFormData({ ...formData, marcaId: value })
                      }
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Seleccionar marca" />
                      </SelectTrigger>
                      <SelectContent>
                        {marcas.map((marca) => (
                          <SelectItem key={marca.id} value={String(marca.id)}>
                            {marca.nombre}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                {/* Ubicación */}
                <div className="grid gap-2">
                  <Label htmlFor="ubicacion">Ubicación</Label>
                  <Select
                    value={formData.ubicacionId}
                    onValueChange={(value) =>
                      setFormData({ ...formData, ubicacionId: value })
                    }
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Seleccionar ubicación" />
                    </SelectTrigger>
                    <SelectContent>
                      {ubicaciones
                        .filter(
                          (u) => u.tipoFarmacoId === parseInt(formData.tipoFarmacoId)
                        )
                        .map((u) => (
                          <SelectItem key={u.id} value={String(u.id)}>
                            {`${u.estanteNombre} → ${u.tramoNombre} → ${u.celdaNombre}`}
                          </SelectItem>
                        ))}
                    </SelectContent>
                  </Select>
                </div>

                {/* Fecha de Vencimiento */}
                <div className="grid gap-2">
                  <Label htmlFor="vencimiento">Fecha de Vencimiento</Label>
                  <Input
                    id="vencimiento"
                    type="date"
                    value={formData.fechaVencimiento}
                    onChange={(e) =>
                      setFormData({ ...formData, fechaVencimiento: e.target.value })
                    }
                    min={fechaMinimaVencimiento}
                    required
                  />
                </div>

                {/* Descripción opcional */}
                <div className="grid gap-2">
                  <Label htmlFor="extra">Descripción (Opcional)</Label>
                  <Textarea
                    id="extra"
                    value={formData.descripcionExtra}
                    onChange={(e) =>
                      setFormData({ ...formData, descripcionExtra: e.target.value })
                    }
                    placeholder="Información adicional sobre el medicamento..."
                    rows={3}
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
                  {formMode === "create" ? "Crear Medicamento" : "Guardar Cambios"}
                </Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      </div>
    </Layout>
  );
};

export default Medicamentos;