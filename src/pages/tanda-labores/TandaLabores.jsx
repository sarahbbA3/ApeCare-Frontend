import { useEffect, useState } from "react";
import {
  obtenerTandas,
  crearTanda,
  editarTanda,
  eliminarTanda,
} from "../../services/TandaLaboresServices";

import Layout from "../../components/common/Layout";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

import { Clock, Plus, Search, Edit, Trash2 } from "lucide-react";

const TandaLabor = () => {
  const [tandas, setTandas] = useState([]);
  const [formOpen, setFormOpen] = useState(false);
  const [formMode, setFormMode] = useState("create");
  const [selectedItem, setSelectedItem] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");

  const [formData, setFormData] = useState({
    nombre: "",
    descripcion: "",
  });

  useEffect(() => {
    cargarTandas();
  }, []);

  const cargarTandas = async () => {
    const data = await obtenerTandas();
    setTandas(data || []);
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
    if (!window.confirm("¿Eliminar esta tanda?")) return;
    try {
      await eliminarTanda(id);
      cargarTandas();
    } catch {
      alert("Error al eliminar tanda");
    }
  };

  const guardarTanda = async (e) => {
    e.preventDefault();
    try {
      if (formMode === "edit" && selectedItem) {
        await editarTanda(selectedItem.id, formData);
      } else {
        await crearTanda(formData);
      }
      setFormOpen(false);
      cargarTandas();
    } catch {
      alert("Error al guardar tanda");
    }
  };

  const filteredTandas = tandas.filter((t) =>
    t.nombre.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const totalTandas = tandas.length;
  const totalMedicos = tandas.reduce((acc, t) => acc + (t.medicosAsignados || 0), 0);

  return (
    <Layout>
      <div className="container mx-auto px-4 py-8">
        {/* HEADER */}
        <div className="mb-8 flex items-center gap-3">
          <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10">
            <Clock className="h-6 w-6 text-primary" />
          </div>
          <div>
            <h1 className="text-3xl font-bold text-foreground">Tanda Labor</h1>
            <p className="text-muted-foreground">Gestiona los turnos de trabajo del personal médico</p>
          </div>
        </div>

        {/* BUSCADOR + BOTÓN */}
        <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder="Buscar tanda..."
              className="pl-10"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

          <Button className="gap-2" onClick={handleCreate}>
            <Plus className="h-4 w-4" />
            Nueva Tanda
          </Button>
        </div>

        {/* ESTADÍSTICAS */}
        <div className="grid gap-4 md:grid-cols-2 mb-8">
          <Card>
            <CardHeader className="pb-3">
              <CardDescription>Total Tandas</CardDescription>
              <CardTitle className="text-3xl">{totalTandas}</CardTitle>
            </CardHeader>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <CardDescription>Médicos Asignados</CardDescription>
              <CardTitle className="text-3xl">{totalMedicos}</CardTitle>
            </CardHeader>
          </Card>
        </div>

        {/* LISTA DE TANDAS */}
        {filteredTandas.length === 0 ? (
          <div className="text-center py-12">
            <Clock className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-semibold mb-2">
              No se encontraron tandas
            </h3>
            <p className="text-muted-foreground">
              Intenta con otros términos de búsqueda
            </p>
          </div>
        ) : (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {filteredTandas.map((tanda) => (
              <Card key={tanda.id} className="hover:shadow-md transition-shadow">
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div>
                      <CardTitle className="text-lg">{tanda.nombre}</CardTitle>
                      <CardDescription>{tanda.descripcion}</CardDescription>
                    </div>
                    <Badge variant="secondary">{tanda.estado?.nombre || "Activa"}</Badge>
                  </div>
                </CardHeader>

                <CardContent>
                  <div className="space-y-3">
                    {/* Médicos asignados */}
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Médicos asignados:</span>
                      <span className="font-medium">{tanda.medicosAsignados || 0}</span>
                    </div>

                    {/* Acciones */}
                    <div className="flex gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        className="flex-1 gap-2 bg-transparent"
                        onClick={() => handleEdit(tanda)}
                      >
                        <Edit className="h-3 w-3" /> Editar
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        className="flex-1 gap-2 text-destructive hover:text-destructive bg-transparent"
                        onClick={() => handleDelete(tanda.id)}
                      >
                        <Trash2 className="h-3 w-3" /> Eliminar
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}

        {/* MODAL FORM */}
        <Dialog open={formOpen} onOpenChange={setFormOpen}>
          <DialogContent className="sm:max-w-[500px]">
            <DialogHeader>
              <DialogTitle>
                {formMode === "create" ? "Nueva Tanda Labor" : "Editar Tanda Labor"}
              </DialogTitle>
              <DialogDescription>
                {formMode === "create"
                  ? "Agrega una nueva tanda de trabajo"
                  : "Modifica la información de la tanda"}
              </DialogDescription>
            </DialogHeader>

            <form onSubmit={guardarTanda}>
              <div className="grid gap-4 py-4">
                {/* Nombre */}
                <div className="grid gap-2">
                  <Label htmlFor="nombre">Nombre de la Tanda</Label>
                  <Input
                    id="nombre"
                    value={formData.nombre}
                    onChange={(e) =>
                      setFormData({ ...formData, nombre: e.target.value })
                    }
                    placeholder="Ej: Turno Mañana"
                    required
                  />
                </div>

                {/* Descripción */}
                <div className="grid gap-2">
                  <Label htmlFor="descripcion">Descripción</Label>
                  <Textarea
                    id="descripcion"
                    value={formData.descripcion}
                    onChange={(e) =>
                      setFormData({ ...formData, descripcion: e.target.value })
                    }
                    placeholder="Información adicional sobre la tanda..."
                    rows={3}
                  />
                </div>
              </div>

              {/* FOOTER */}
              <DialogFooter>
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setFormOpen(false)}
                >
                  Cancelar
                </Button>
                <Button type="submit">
                  {formMode === "create" ? "Crear Tanda" : "Guardar Cambios"}
                </Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      </div>
    </Layout>
  );
};

export default TandaLabor;