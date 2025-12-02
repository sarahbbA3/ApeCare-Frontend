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
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

import { Pill, Plus, Search, Edit, Trash2 } from "lucide-react";

import Layout from "../../components/common/Layout";
import {
  obtenerTiposFarmaco,
  crearTipoFarmaco,
  editarTipoFarmaco,
  eliminarTipoFarmaco,
} from "../../services/TipoFarmacosServices";
import { useAuth } from "@/hooks/useAuth";
import AccessDenied from "@/components/common/AccessDenied";

const TipoFarmacos = () => {
  const { usuario } = useAuth();
  const esMedico = usuario?.rol === "MEDICO"; // valido por rol

  if (esMedico) {
    return (
      <Layout>
        <AccessDenied />
      </Layout>
    );
  }
  const [tipos, setTipos] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const [formOpen, setFormOpen] = useState(false);
  const [formMode, setFormMode] = useState("create");
  const [selectedItem, setSelectedItem] = useState(null);

  const [formData, setFormData] = useState({
    nombre: "",
    descripcion: "",
  });

  const [searchTerm, setSearchTerm] = useState(""); 

  useEffect(() => {
    cargarTipos();
  }, []);

  const cargarTipos = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await obtenerTiposFarmaco();
      setTipos(data || []);
    } catch (err) {
      console.error("Error cargando tipos:", err);
      setError("Hubo un error cargando los tipos de fármaco.");
    } finally {
      setLoading(false);
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
      nombre: item.nombre,
      descripcion: item.descripcion,
    });
    setFormOpen(true);
  };

  const handleDelete = async (id) => {
    if (!window.confirm("¿Seguro que deseas eliminar este tipo de fármaco?")) return;
    try {
      await eliminarTipoFarmaco(id);
      cargarTipos();
    } catch (err) {
      console.error("Error eliminando tipo:", err);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const payload = {
      nombre: formData.nombre,
      descripcion: formData.descripcion,
      estadoId: 1,
    };
    try {
      if (formMode === "edit" && selectedItem) {
        await editarTipoFarmaco(selectedItem.id, payload);
      } else {
        await crearTipoFarmaco(payload);
      }
      setFormOpen(false);
      cargarTipos();
    } catch (err) {
      console.error("Error guardando tipo:", err);
    }
  };

  const formatearFecha = (d) => (d ? d.split("T")[0] : "-");

  const filteredTipos = tipos.filter(
    (tipo) =>
      tipo.nombre.toLowerCase().includes(searchTerm.toLowerCase()) ||
      tipo.descripcion.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <Layout>
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8 flex items-center gap-3">
          <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10">
            <Pill className="h-6 w-6 text-primary" />
          </div>
          <div>
            <h1 className="text-3xl font-bold text-foreground">Tipos de Fármaco</h1>
            <p className="text-muted-foreground">
              Gestiona los tipos de medicamentos
            </p>
          </div>
        </div>

        {/* Actions Bar */}
        <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder="Buscar tipo de fármaco por nombre o descripción..."
              className="pl-10"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

          <Button className="gap-2" onClick={handleCreate}>
            <Plus className="h-4 w-4" />
            Nuevo Tipo
          </Button>
        </div>

        {/* Error or Loading */}
        {loading ? (
          <p className="text-muted-foreground">Cargando tipos de fármaco...</p>
        ) : error ? (
          <p className="text-destructive">{error}</p>
        ) : filteredTipos.length === 0 ? (
          <div className="text-center py-12">
            <Pill className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-semibold mb-2">
              No se encontraron tipos de fármaco
            </h3>
            <p className="text-muted-foreground">
              Intenta con otros términos de búsqueda
            </p>
          </div>
        ) : (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {filteredTipos.map((tipo) => (
              <Card key={tipo.id} className="hover:shadow-md transition-shadow">
                <CardHeader>
                  <CardTitle>{tipo.nombre}</CardTitle>
                  <CardDescription>{tipo.descripcion}</CardDescription>
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
                {formMode === "create"
                  ? "Nuevo Tipo de Fármaco"
                  : "Editar Tipo de Fármaco"}
              </DialogTitle>
              <DialogDescription>
                {formMode === "create"
                  ? "Agrega un nuevo tipo de fármaco al sistema"
                  : "Modifica la información del tipo de fármaco"}
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
                    placeholder="Ej: Analgésicos"
                    required
                  />
                </div>

                <div className="grid gap-2">
                  <Label htmlFor="descripcion">Descripción</Label>
                  <Textarea
                    id="descripcion"
                    rows={4}
                    value={formData.descripcion}
                    onChange={(e) =>
                      setFormData({ ...formData, descripcion: e.target.value })
                    }
                    placeholder="Describe el tipo de fármaco..."
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

export default TipoFarmacos;