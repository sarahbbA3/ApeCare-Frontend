import { useEffect, useState } from "react";
import { obtenerEstantes, crearEstante, editarEstante, eliminarEstante } from "../../services/EstantesServices";
import { obtenerTramos } from "../../services/TramosServices";
import { obtenerCeldas } from "../../services/CeldasServices";
import Layout from "../../components/common/Layout";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Search, Plus, Edit, Trash2, Grid3x3, Box } from "lucide-react";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";

const Estantes = () => {
  const [listEstantes, setListEstantes] = useState([]);
  const [listTramos, setListTramos] = useState([]);
  const [listCeldas, setListCeldas] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [formOpen, setFormOpen] = useState(false);
  const [formMode, setFormMode] = useState("create");
  const [formData, setFormData] = useState({ nombre: "", estadoId: 1 });
  const [editandoEstante, setEditandoEstante] = useState(null);

  useEffect(() => {
    cargarEstantes();
    cargarTramos();
    cargarCeldas();
  }, []);

  const cargarEstantes = async () => {
    const data = await obtenerEstantes();
    setListEstantes(data || []);
  };

  const cargarTramos = async () => {
    const data = await obtenerTramos();
    setListTramos(data || []);
  };

  const cargarCeldas = async () => {
    const data = await obtenerCeldas();
    setListCeldas(data || []);
  };

  const handleCreate = () => {
    setFormMode("create");
    setEditandoEstante(null);
    setFormData({ nombre: "", estadoId: 1 });
    setFormOpen(true);
  };

  const handleEdit = (item) => {
    setFormMode("edit");
    setEditandoEstante(item);
    setFormData({
      nombre: item?.nombre || "",
      estadoId: item?.estadoId || 1,
    });
    setFormOpen(true);
  };

  const handleDelete = async (id) => {
    if (!window.confirm("¿Eliminar este estante?")) return;
    try {
      await eliminarEstante(id, 3);
      cargarEstantes();
    } catch {
      alert("Error al eliminar");
    }
  };

  const guardarEstante = async (e) => {
    e.preventDefault();
    try {
      if (formMode === "edit" && editandoEstante) {
        await editarEstante(editandoEstante.id, formData);
      } else {
        await crearEstante(formData);
      }
      setFormOpen(false);
      cargarEstantes();
    } catch {
      alert("Error al guardar el estante");
    }
  };

  const filteredEstantes = listEstantes.filter((e) =>
    e.nombre.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const totalEstantes = listEstantes.length;
  const totalTramos = listTramos.length;
  const totalCeldas = listCeldas.length;

  const formatearFecha = (d) => (d ? d.split("T")[0] : "-");

  return (
    <Layout>
      <div className="container mx-auto px-4 py-8">
        {/* HEADER */}
        <div className="mb-8 flex items-center gap-3">
          <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10">
            <Grid3x3 className="h-6 w-6 text-primary" />
          </div>
          <div>
            <h1 className="text-3xl font-bold">Estantes</h1>
            <p className="text-muted-foreground">Gestiona los estantes del sistema</p>
          </div>
        </div>

        {/* SEARCH + NEW */}
        <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder="Buscar estante..."
              className="pl-10"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

          <Button className="gap-2" onClick={handleCreate}>
            <Plus className="h-4 w-4" />
            Nuevo Estante
          </Button>
        </div>

        {/* STATS */}
        <div className="grid gap-4 md:grid-cols-3 mb-8">
          <Card>
            <CardHeader>
              <CardDescription>Total Estantes</CardDescription>
              <CardTitle className="text-3xl">{totalEstantes}</CardTitle>
            </CardHeader>
          </Card>

          <Card>
            <CardHeader>
              <CardDescription>Total Tramos</CardDescription>
              <CardTitle className="text-3xl">{totalTramos}</CardTitle>
            </CardHeader>
          </Card>

          <Card>
            <CardHeader>
              <CardDescription>Total Celdas</CardDescription>
              <CardTitle className="text-3xl">{totalCeldas}</CardTitle>
            </CardHeader>
          </Card>
        </div>

        {/* TABLE */}
        <Card>
          <CardHeader>
            <CardTitle>Lista de Estantes</CardTitle>
            <CardDescription>Gestiona todos los estantes del sistema</CardDescription>
          </CardHeader>

          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-border">
                    <th className="py-3 px-4 text-left text-sm font-medium">Nombre</th>
                    <th className="py-3 px-4 text-left text-sm font-medium">Tramos</th>
                    <th className="py-3 px-4 text-left text-sm font-medium">Celdas</th>
                    <th className="py-3 px-4 text-left text-sm font-medium">Creación</th>
                    <th className="py-3 px-4 text-left text-sm font-medium">Actualización</th>
                    <th className="py-3 px-4 text-left text-sm font-medium">Estado</th>
                    <th className="py-3 px-4 text-right text-sm font-medium">Acciones</th>
                  </tr>
                </thead>

                <tbody>
                  {filteredEstantes.length === 0 ? (
                    <tr>
                      <td colSpan="7" className="text-center py-6 text-muted-foreground">
                        No se encontraron estantes
                      </td>
                    </tr>
                  ) : (
                    filteredEstantes.map((e) => {
                      const tramosEstante = listTramos.filter((t) => t.estanteId === e.id);
                      const tramoIds = tramosEstante.map((t) => t.id);
                      const celdasEstante = listCeldas.filter((c) => tramoIds.includes(c.tramoId));

                      return (
                        <tr key={e.id} className="border-b hover:bg-muted/40">
                          <td className="py-2 px-4">{e.nombre}</td>
                          <td className="py-2 px-4 text-sm text-muted-foreground">
                            {tramosEstante.length > 0
                              ? tramosEstante.map((t) => t.nombre).join(", ")
                              : "—"}
                          </td>
                          <td className="py-2 px-4 flex items-center gap-1 text-sm">
                            <Box className="h-4 w-4 text-muted-foreground" />
                            {celdasEstante.length}
                          </td>
                          <td className="py-2 px-4">{formatearFecha(e.fechaCreacion)}</td>
                          <td className="py-2 px-4">{formatearFecha(e.fechaActualizacion)}</td>
                          <td className="py-2 px-4">
                            <Badge>{e.estadoNombre || "Activo"}</Badge>
                                                    </td>
                          <td className="py-2 px-4 text-right">
                            <div className="flex items-center justify-end gap-2">
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => handleEdit(e)}
                              >
                                <Edit className="h-4 w-4" /> Editar
                              </Button>
                              <Button
                                variant="ghost"
                                size="sm"
                                className="text-destructive hover:text-destructive"
                                onClick={() => handleDelete(e.id)}
                              >
                                <Trash2 className="h-4 w-4" /> Eliminar
                              </Button>
                            </div>
                          </td>
                        </tr>
                      );
                    })
                  )}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>

        {/* MODAL FORM */}
        <Dialog open={formOpen} onOpenChange={setFormOpen}>
          <DialogContent className="sm:max-w-[500px]">
            <DialogHeader>
              <DialogTitle>
                {formMode === "create" ? "Nuevo Estante" : "Editar Estante"}
              </DialogTitle>
              <DialogDescription>
                {formMode === "create"
                  ? "Agrega un nuevo estante al sistema"
                  : "Modifica la información del estante"}
              </DialogDescription>
            </DialogHeader>

            <form onSubmit={guardarEstante}>
              <div className="grid gap-4 py-4">
                <div className="grid gap-2">
                  <Label htmlFor="nombre">Nombre</Label>
                  <Input
                    id="nombre"
                    placeholder="Nombre del estante"
                    value={formData.nombre}
                    onChange={(e) =>
                      setFormData({ ...formData, nombre: e.target.value })
                    }
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
                  {formMode === "create" ? "Crear Estante" : "Guardar Cambios"}
                </Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      </div>
    </Layout>
  );
};

export default Estantes;