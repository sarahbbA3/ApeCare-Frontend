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
  Boxes,
  Plus,
  Search,
  Edit,
  Trash2,
} from "lucide-react";

import Layout from "../../components/common/Layout";
import {
  obtenerTramos,
  crearTramo,
  editarTramo,
  eliminarTramo,
} from "../../services/TramosServices";
import { obtenerEstantes } from "../../services/EstantesServices";
import { obtenerCeldas } from "../../services/CeldasServices";

const Tramos = () => {
  const [listTramos, setListTramos] = useState([]);
  const [listEstantes, setListEstantes] = useState([]);
  const [listCeldas, setListCeldas] = useState([]);
  const [formData, setFormData] = useState({
    nombre: "",
    estanteId: "",
    estadoId: 1, // se asigna automáticamente
  });
  const [editandoTramo, setEditandoTramo] = useState(null);
  const [formOpen, setFormOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    cargarTramos();
    cargarEstantes();
    cargarCeldas();
  }, []);

  const cargarTramos = async () => {
    const data = await obtenerTramos();
    setListTramos(data || []);
  };

  const cargarEstantes = async () => {
    const data = await obtenerEstantes();
    setListEstantes(data || []);
  };

  const cargarCeldas = async () => {
    const data = await obtenerCeldas();
    setListCeldas(data || []);
  };

  const abrirModal = (tramo = null) => {
    setEditandoTramo(tramo);
    setFormData({
      nombre: tramo?.nombre || "",
      estanteId: tramo?.estanteId?.toString() || "",
      estadoId: tramo?.estadoId || 1,
    });
    setFormOpen(true);
  };

  const cerrarModal = () => {
    setFormOpen(false);
    setEditandoTramo(null);
    setFormData({ nombre: "", estanteId: "", estadoId: 1 });
  };

  const guardarTramo = async (e) => {
    e.preventDefault();
    try {
      if (editandoTramo) {
        await editarTramo(editandoTramo.id, formData);
      } else {
        await crearTramo(formData);
      }
      cerrarModal();
      cargarTramos();
    } catch {
      alert("Error al guardar el tramo");
    }
  };

  const eliminar = async (id) => {
    if (!window.confirm("¿Eliminar este tramo?")) return;
    try {
      await eliminarTramo(id, 3);
      cargarTramos();
    } catch {
      alert("Error al eliminar");
    }
  };

  const formatearFecha = (d) => (d ? d.split("T")[0] : "-");

  const filteredTramos = listTramos.filter(
    (tramo) =>
      tramo.nombre.toLowerCase().includes(searchTerm.toLowerCase()) ||
      listEstantes.find((e) => e.id === tramo.estanteId)?.nombre
        ?.toLowerCase()
        .includes(searchTerm.toLowerCase())
  );

  const totalTramos = listTramos.length;

  return (
    <Layout>
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8 flex items-center gap-3">
          <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10">
            <Boxes className="h-6 w-6 text-primary" />
          </div>
          <div>
            <h1 className="text-3xl font-bold text-foreground">Tramos</h1>
            <p className="text-muted-foreground">
              Gestiona las divisiones principales de almacenamiento
            </p>
          </div>
        </div>

        {/* Actions Bar */}
        <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder="Buscar tramo..."
              className="pl-10"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

          <Button className="gap-2" onClick={() => abrirModal()}>
            <Plus className="h-4 w-4" />
            Nuevo Tramo
          </Button>
        </div>

        {/* Stats Overview */}
        <div className="grid gap-4 md:grid-cols-2 mb-8">
          <Card>
            <CardHeader className="pb-3">
              <CardDescription>Total Tramos</CardDescription>
              <CardTitle className="text-3xl">{totalTramos}</CardTitle>
            </CardHeader>
          </Card>
        </div>

        {/* Content Grid */}
        {filteredTramos.length === 0 ? (
          <div className="text-center py-12">
            <Boxes className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-semibold mb-2">
              No se encontraron tramos
            </h3>
            <p className="text-muted-foreground">
              Intenta con otros términos de búsqueda
            </p>
          </div>
        ) : (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {filteredTramos.map((t) => {
              const estante = listEstantes.find((e) => e.id === t.estanteId);
              const celdasCount = listCeldas.filter((c) => c.tramoId === t.id).length;

              return (
                <Card key={t.id} className="hover:shadow-md transition-shadow">
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <div>
                        <CardTitle className="text-lg">{t.nombre}</CardTitle>
                        <CardDescription>
                          Estante: {estante?.nombre || "-"}
                        </CardDescription>
                      </div>
                      <Badge>{t.estadoId === 1 ? "Activo" : "Inactivo"}</Badge>
                    </div>
                  </CardHeader>

                  <CardContent>
                    <div className="space-y-3 text-sm">
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Celdas creadas:</span>
                        <span className="font-medium">{celdasCount}</span>
                      </div>

                      <div className="flex justify-between text-xs text-muted-foreground pt-2 border-t">
                        <span>Creación: {formatearFecha(t.fechaCreacion)}</span>
                        <span>Actualización: {formatearFecha(t.fechaActualizacion)}</span>
                      </div>

                      <div className="flex gap-2 pt-2">
                        <Button
                          variant="outline"
                          size="sm"
                          className="flex-1 gap-2 bg-transparent"
                          onClick={() => abrirModal(t)}
                        >
                          <Edit className="h-3 w-3" />
                          Editar
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          className="flex-1 gap-2 text-destructive hover:text-destructive bg-transparent"
                          onClick={() => eliminar(t.id)}
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

        {/* Modal Form */}
        <Dialog open={formOpen} onOpenChange={setFormOpen}>
          <DialogContent className="sm:max-w-[500px]">
                      <DialogHeader>
            <DialogTitle>
              {editandoTramo ? "Editar Tramo" : "Nuevo Tramo"}
            </DialogTitle>
            <DialogDescription>
              {editandoTramo
                ? "Modifica la información del tramo"
                : "Agrega un nuevo tramo al sistema de almacenamiento"}
            </DialogDescription>
          </DialogHeader>

          <form onSubmit={guardarTramo}>
            <div className="grid gap-4 py-4">
              <div className="grid gap-2">
                <Label htmlFor="nombre">Nombre</Label>
                <Input
                  id="nombre"
                  placeholder="Tramo Norte"
                  value={formData.nombre}
                  onChange={(e) =>
                    setFormData({ ...formData, nombre: e.target.value })
                  }
                  required
                />
              </div>

              <div className="grid gap-2">
                <Label htmlFor="estanteId">Estante</Label>
                <Select
                  value={formData.estanteId}
                  onValueChange={(value) =>
                    setFormData({ ...formData, estanteId: value })
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Seleccionar estante" />
                  </SelectTrigger>
                  <SelectContent>
                    {listEstantes.map((e) => (
                      <SelectItem key={e.id} value={String(e.id)}>
                        {e.nombre}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <DialogFooter>
              <Button type="button" variant="outline" onClick={cerrarModal}>
                Cancelar
              </Button>
              <Button type="submit">
                {editandoTramo ? "Actualizar" : "Guardar"}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
      </div>
    </Layout>
  );
};

export default Tramos;