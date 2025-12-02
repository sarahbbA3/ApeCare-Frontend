import { useEffect, useMemo, useState } from "react"
import {
  obtenerVisitas,
  crearVisita,
  editarVisita,
  eliminarVisita,
} from "../../services/RegistroVisitasServices"
import { obtenerPacientes } from "../../services/PacientesServices"
import { obtenerMedicos } from "../../services/MedicosServices"
import { obtenerSintomas } from "../../services/SintomasServices"
import { obtenerMedicamentos } from "../../services/MedicamentosServices"

import Layout from "../../components/common/Layout"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Textarea } from "@/components/ui/textarea"
import { ClipboardList, Plus, Search, Edit, Trash2, Calendar, Filter, X } from "lucide-react"

const RegistroVisitas = () => {
  const [visitas, setVisitas] = useState([])
  const [pacientes, setPacientes] = useState([])
  const [medicos, setMedicos] = useState([])
  const [sintomas, setSintomas] = useState([])
  const [medicamentos, setMedicamentos] = useState([])

  const [isModalOpen, setIsModalOpen] = useState(false)
  const [editando, setEditando] = useState(null)
  const [formData, setFormData] = useState({
    fechaVisita: "",
    horaVisita: "",
    recomendaciones: "",
    pacienteId: "",
    medicoId: "",
    sintomasIds: [],
    medicamentos: [],
  })

  const [searchTerm, setSearchTerm] = useState("")
  const [searchSintoma, setSearchSintoma] = useState("");
  const [filterPaciente, setFilterPaciente] = useState("all")
  const [filterMedico, setFilterMedico] = useState("all")
  const [filterSintoma, setFilterSintoma] = useState("all")
  const [filterFecha, setFilterFecha] = useState("")
  const [showFilters, setShowFilters] = useState(false)

  useEffect(() => {
    cargarDatos()
  }, [])

  const cargarDatos = async () => {
    const [v, p, m, s, meds] = await Promise.all([
      obtenerVisitas(),
      obtenerPacientes(),
      obtenerMedicos(),
      obtenerSintomas(),
      obtenerMedicamentos(),
    ])
    setVisitas(v || [])
    setPacientes(p || [])
    setMedicos(m || [])
    setSintomas(s || [])
    setMedicamentos(meds || [])
  }

  const abrirModal = (visita = null) => {
    setEditando(visita)
    setFormData(
      visita
        ? {
            fechaVisita: visita.fechaVisita || "",
            horaVisita: visita.horaVisita || "",
            recomendaciones: visita.recomendaciones || "",
            pacienteId: visita.pacienteId?.toString() || "",
            medicoId: visita.medicoId?.toString() || "",
            sintomasIds: visita.sintomasIds?.map(String) || [],
            medicamentos:
              visita.medicamentos?.map((m) => ({
                medicamentoId: m.medicamentoId,
                cantidadSuministrada: m.cantidadSuministrada,
              })) || [],
          }
        : {
            fechaVisita: "",
            horaVisita: "",
            recomendaciones: "",
            pacienteId: "",
            medicoId: "",
            sintomasIds: [],
            medicamentos: [],
          }
    )
    setIsModalOpen(true)
  }

  const cerrarModal = () => {
    setIsModalOpen(false)
    setEditando(null)
    setFormData({
      fechaVisita: "",
      horaVisita: "",
      recomendaciones: "",
      pacienteId: "",
      medicoId: "",
      sintomasIds: [],
      medicamentos: [],
    })
  }

  const guardarVisita = async (payload) => {
    const data = {
      ...payload,
      sintomasIds: payload.sintomasIds.map(Number),
      medicamentos: payload.medicamentos.map((m) => ({
        medicamentoId: Number(m.medicamentoId),
        cantidadSuministrada: Number(m.cantidadSuministrada),
      })),
    }
    try {
      if (editando) {
        await editarVisita(editando.id, data)
      } else {
        await crearVisita(data)
      }
      cerrarModal()
      cargarDatos()
    } catch (err) {
      console.error("Error al guardar visita:", err)
      alert("Hubo un error al guardar")
    }
  }

  const eliminar = async (id) => {
    if (!window.confirm("¿Eliminar esta visita?")) return
    try {
      await eliminarVisita(id)
      cargarDatos()
    } catch (err) {
      console.error("Error al eliminar:", err)
      alert("Hubo un error al eliminar")
    }
  }

  const formatearFecha = (d) => d || "-"

  const obtenerNombrePaciente = (id) => {
    const paciente = pacientes.find((p) => p.id === parseInt(id))
    return paciente ? paciente.nombre : `Paciente ${id}`
  }

  const obtenerNombreMedico = (id) => {
    const medico = medicos.find((m) => m.id === parseInt(id))
    return medico ? medico.nombre : `Médico ${id}`
  }

  const obtenerNombresSintomas = (ids) => {
    return ids
      .map((id) => {
        const s = sintomas.find((sintoma) => sintoma.id === parseInt(id))
        return s ? s.nombre : `Síntoma ${id}`
      })
      .join(", ")
  }

  const obtenerNombresMedicamentos = (medsVisita) => {
    if (!medsVisita || medsVisita.length === 0) return ""
    return medsVisita
      .map((mv) => {
        const med = medicamentos.find((mm) => mm.id === mv.medicamentoId)
        return med
          ? `${med.descripcion} (${mv.cantidadSuministrada})`
          : `Medicamento (${mv.cantidadSuministrada})`
      })
      .join(", ")
  }

  const horaMaxima = useMemo(() => {
    const hoy = new Date().toISOString().split("T")[0]
    if (formData.fechaVisita === hoy) {
      return new Date().toTimeString().slice(0, 5)
    }
    return undefined
  }, [formData.fechaVisita])

  const visitasFiltradas = useMemo(() => {
    return visitas.filter((v) => {
      const term = searchTerm.toLowerCase()
      const matchesSearch =
        term === "" ||
        obtenerNombrePaciente(v.pacienteId).toLowerCase().includes(term) ||
        obtenerNombreMedico(v.medicoId).toLowerCase().includes(term) ||
        obtenerNombresSintomas(v.sintomasIds).toLowerCase().includes(term) ||
        obtenerNombresMedicamentos(v.medicamentos).toLowerCase().includes(term) ||
        v.recomendaciones?.toLowerCase().includes(term)

      const matchesPaciente = filterPaciente === "all" || v.pacienteId.toString() === filterPaciente
      const matchesMedico = filterMedico === "all" || v.medicoId.toString() === filterMedico
      const matchesSintoma = filterSintoma === "all" || v.sintomasIds.map(String).includes(filterSintoma)
      const matchesFecha = filterFecha === "" || v.fechaVisita === filterFecha

      return matchesSearch && matchesPaciente && matchesMedico && matchesSintoma && matchesFecha
    })
  }, [visitas, searchTerm, filterPaciente, filterMedico, filterSintoma, filterFecha])

  const activeFiltersCount = [filterPaciente !== "all", filterMedico !== "all", filterSintoma !== "all", filterFecha !== ""].filter(Boolean).length

  return (
    <Layout>
      <div className="container mx-auto px-4 py-8">

        {/* HEADER */}
        <div className="flex items-center gap-3 mb-8">
          <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10">
            <ClipboardList className="h-6 w-6 text-primary" />
          </div>
          <div>
            <h1 className="text-3xl font-bold text-foreground">Registro de Visitas</h1>
            <p className="text-muted-foreground">Gestiona las visitas médicas de los pacientes</p>
          </div>
        </div>

          {/* SEARCH + ACTIONS */}
        <div className="mb-6 space-y-4">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                placeholder="Buscar por paciente, médico, síntomas..."
                className="pl-10"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>

            <div className="flex gap-2">
              <Button
                variant="outline"
                className="gap-2 bg-transparent"
                onClick={() => setShowFilters(!showFilters)}
              >
                <Filter className="h-4 w-4" />
                Filtros
                {activeFiltersCount > 0 && (
                  <Badge
                    variant="secondary"
                    className="ml-1 h-5 w-5 rounded-full p-0 flex items-center justify-center"
                  >
                    {activeFiltersCount}
                  </Badge>
                )}
              </Button>

              <Button className="gap-2" onClick={() => abrirModal()}>
                <Plus className="h-4 w-4" />
                Nueva Visita
              </Button>
            </div>
          </div>

          {/* FILTERS */}
          {showFilters && (
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="text-lg">Filtros Avanzados</CardTitle>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => {
                      setSearchTerm("")
                      setFilterPaciente("all")
                      setFilterMedico("all")
                      setFilterSintoma("all")
                      setFilterFecha("")
                    }}
                    className="gap-2"
                  >
                    <X className="h-4 w-4" />
                    Limpiar
                  </Button>
                </div>
              </CardHeader>

              <CardContent>
                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                  {/* Paciente */}
                  <div className="space-y-2">
                    <Label>Paciente</Label>
                    <Select value={filterPaciente} onValueChange={setFilterPaciente}>
                      <SelectTrigger>
                        <SelectValue placeholder="Todos los pacientes" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">Todos</SelectItem>
                        {pacientes.map((p) => (
                          <SelectItem key={p.id} value={p.id.toString()}>
                            {p.nombre}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  {/* Médico */}
                  <div className="space-y-2">
                    <Label>Médico</Label>
                    <Select value={filterMedico} onValueChange={setFilterMedico}>
                      <SelectTrigger>
                        <SelectValue placeholder="Todos los médicos" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">Todos</SelectItem>
                        {medicos.map((m) => (
                          <SelectItem key={m.id} value={m.id.toString()}>
                            {m.nombre}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  {/* Síntoma */}
                  <div className="space-y-2">
                    <Label>Síntoma</Label>
                    <Select value={filterSintoma} onValueChange={setFilterSintoma}>
                      <SelectTrigger>
                        <SelectValue placeholder="Todos los síntomas" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">Todos</SelectItem>
                        {sintomas.map((s) => (
                          <SelectItem key={s.id} value={s.id.toString()}>
                            {s.nombre}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  {/* Fecha */}
                  <div className="space-y-2">
                    <Label>Fecha</Label>
                    <Input
                      type="date"
                      value={filterFecha}
                      onChange={(e) => setFilterFecha(e.target.value)}
                    />
                  </div>
                </div>
              </CardContent>
            </Card>
          )}
        </div>

        {/* SIN RESULTADOS */}
        {visitasFiltradas.length === 0 ? (
          <Card className="p-12">
            <div className="text-center">
              <Search className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-semibold mb-2">No se encontraron visitas</h3>
              <p className="text-muted-foreground mb-4">
                Intenta ajustar los filtros o la búsqueda
              </p>
              <Button
                variant="outline"
                onClick={() => {
                  setSearchTerm("")
                  setFilterPaciente("all")
                  setFilterMedico("all")
                  setFilterSintoma("all")
                  setFilterFecha("")
                }}
              >
                Limpiar filtros
              </Button>
            </div>
          </Card>
        ) : (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {visitasFiltradas.map((v) => (
              <Card key={v.id} className="hover:shadow-md transition-shadow">
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <CardTitle className="text-lg">
                        {obtenerNombrePaciente(v.pacienteId)}
                      </CardTitle>
                      <CardDescription>{obtenerNombreMedico(v.medicoId)}</CardDescription>
                    </div>
                    <Badge variant="secondary">Visita</Badge>
                  </div>
                </CardHeader>

                <CardContent>
                  <div className="space-y-3">
                    <div className="flex items-center gap-2 text-muted-foreground text-sm">
                      <Calendar className="h-3 w-3" />
                      <span>
                        {formatearFecha(v.fechaVisita)} — {v.horaVisita}
                      </span>
                    </div>

                    <div className="text-sm space-y-1">
                      <div className="flex justify-between border-t pt-2">
                        <span className="text-muted-foreground">Síntomas:</span>
                        <span className="font-medium text-right">
                          {obtenerNombresSintomas(v.sintomasIds)}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Medicamentos:</span>
                        <span className="font-medium text-right">
                          {obtenerNombresMedicamentos(v.medicamentos) || "—"}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Recomendaciones:</span>
                        <span className="font-medium text-right">{v.recomendaciones}</span>
                      </div>
                      <div className="flex justify-between text-xs text-muted-foreground pt-1">
                        <span>Creación: {formatearFecha(v.fechaCreacion)}</span>
                        <span>Actualización: {formatearFecha(v.fechaActualizacion)}</span>
                      </div>
                    </div>

                    <div className="flex gap-2 pt-2">
                      <Button
                        variant="outline"
                        size="sm"
                        className="flex-1 gap-2 bg-transparent"
                        onClick={() => abrirModal(v)}
                      >
                        <Edit className="h-3 w-3" /> Editar
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        className="flex-1 gap-2 text-destructive hover:text-destructive bg-transparent"
                        onClick={() => eliminar(v.id)}
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

        {/* MODAL */}
        <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
          <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>{editando ? "Editar Visita" : "Nueva Visita"}</DialogTitle>
              <DialogDescription>
                {editando
                  ? "Modifica la información de la visita"
                  : "Registra una nueva visita médica"}
              </DialogDescription>
            </DialogHeader>

            <form
              onSubmit={(e) => {
                e.preventDefault()
                guardarVisita(formData)
              }}
            >
              <div className="grid gap-4 py-4">
                {/* Fecha y Hora */}
                <div className="grid grid-cols-2 gap-4">
                  <div className="grid gap-2">
                    <Label>Fecha</Label>
                    <Input
                      type="date"
                      value={formData.fechaVisita}
                      onChange={(e) =>
                        setFormData({ ...formData, fechaVisita: e.target.value })
                      }
                      max={new Date().toISOString().split("T")[0]}
                      required
                    />
                  </div>

                  <div className="grid gap-2">
                    <Label>Hora</Label>
                    <Input
                      type="time"
                      value={formData.horaVisita}
                      onChange={(e) =>
                        setFormData({ ...formData, horaVisita: e.target.value })
                      }
                      max={horaMaxima}
                      required
                    />
                  </div>
                </div>

                {/* Recomendaciones */}
                <div className="grid gap-2">
                  <Label>Recomendaciones</Label>
                  <Textarea
                    value={formData.recomendaciones}
                    onChange={(e) =>
                      setFormData({ ...formData, recomendaciones: e.target.value })
                    }
                    placeholder="Recomendaciones médicas"
                    rows={3}
                  />
                </div>

                {/* Paciente */}
                <div className="grid gap-2">
                  <Label>Paciente</Label>
                  <Select
                    value={formData.pacienteId}
                    onValueChange={(value) =>
                      setFormData({ ...formData, pacienteId: value })
                    }
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Seleccionar paciente" />
                    </SelectTrigger>
                    <SelectContent>
                      {pacientes.map((p) => (
                        <SelectItem key={p.id} value={p.id.toString()}>
                          {p.nombre}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {/* Médico */}
                <div className="grid gap-2">
                  <Label>Médico</Label>
                  <Select
                    value={formData.medicoId}
                    onValueChange={(value) =>
                      setFormData({ ...formData, medicoId: value })
                    }
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Seleccionar médico" />
                    </SelectTrigger>
                    <SelectContent>
                      {medicos.map((m) => (
                        <SelectItem key={m.id} value={m.id.toString()}>
                          {m.nombre}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {/* Síntomas */}
                  <div className="grid gap-2">
                    <Label>Síntomas</Label>
                    <Input
                      placeholder="Buscar síntoma..."
                      value={searchSintoma}
                      onChange={(e) => setSearchSintoma(e.target.value)}
                    />

                    <div className="max-h-40 overflow-y-auto border rounded-md p-2 space-y-1">
                      {sintomas
                        .filter((s) =>
                          s.nombre.toLowerCase().includes(searchSintoma.toLowerCase())
                        )
                        .map((s) => (
                          <label
                            key={s.id}
                            className="flex items-center gap-2 text-sm cursor-pointer"
                          >
                            <input
                              type="checkbox"
                              checked={formData.sintomasIds.includes(s.id)}
                              onChange={() => {
                                if (formData.sintomasIds.includes(s.id)) {
                                  setFormData({
                                    ...formData,
                                    sintomasIds: formData.sintomasIds.filter((x) => x !== s.id),
                                  });
                                } else {
                                  setFormData({
                                    ...formData,
                                    sintomasIds: [...formData.sintomasIds, s.id],
                                  });
                                }
                              }}
                            />
                            {s.nombre}
                          </label>
                        ))}

                      {sintomas.filter((s) =>
                        s.nombre.toLowerCase().includes(searchSintoma.toLowerCase())
                      ).length === 0 && (
                        <p className="text-xs text-muted-foreground">
                          No se encontraron síntomas
                        </p>
                      )}
                    </div>
                  </div>
                {/* Medicamentos */}
                <div className="grid gap-2">
                  <Label>Medicamentos</Label>
                  <div className="space-y-2">
                    {formData.medicamentos.map((item, index) => {
                      const med = medicamentos.find(
                        (m) => m.id === item.medicamentoId
                      )
                      return (
                        <div
                          key={item.medicamentoId}
                          className="flex items-center justify-between border px-3 py-2 rounded-lg"
                        >
                          <div>
                            <p className="font-medium">
                              {med?.descripcion || "Medicamento"}
                            </p>
                            <p className="text-xs text-slate-500">
                              Stock: {med?.cantidadDisponible ?? "—"}
                            </p>
                          </div>
                          <div className="flex items-center gap-2">
                            <Input
                              type="number"
                              min="1"
                              max={!editando ? med?.cantidadDisponible : undefined}
                              value={item.cantidadSuministrada}
                              onChange={(e) => {
                                const nuevaCantidad = Number(e.target.value)
                                if (!med) return
                                if (!editando && nuevaCantidad > med.cantidadDisponible) {
                                  alert(`Stock insuficiente. Solo hay ${med.cantidadDisponible} unidades disponibles.`)
                                  return
                                }
                                if (nuevaCantidad < 1) return
                                setFormData({
                                  ...formData,
                                  medicamentos: formData.medicamentos.map((m, i) =>
                                    i === index ? { ...m, cantidadSuministrada: nuevaCantidad } : m
                                  ),
                                })
                              }}
                              className="w-20"
                            />
                            <Button
                              type="button"
                              variant="destructive"
                              size="sm"
                              onClick={() =>
                                setFormData({
                                  ...formData,
                                  medicamentos: formData.medicamentos.filter(
                                    (m) => m.medicamentoId !== item.medicamentoId
                                  ),
                                })
                              }
                            >
                              X
                            </Button>
                          </div>
                        </div>
                      )
                    })}

                    <Select
                      onValueChange={(value) => {
                        const id = Number(value)
                        if (!id) return
                        const med = medicamentos.find((m) => m.id === id)
                        if (!med) return
                        if (!editando && med.cantidadDisponible <= 0) {
                          alert(`El medicamento "${med.descripcion}" no tiene stock disponible.`)
                          return
                        }
                        if (
                          formData.medicamentos.some(
                            (m) => m.medicamentoId === id
                          )
                        ) {
                          alert("Este medicamento ya fue añadido.")
                          return
                        }
                        setFormData({
                          ...formData,
                          medicamentos: [
                            ...formData.medicamentos,
                            { medicamentoId: id, cantidadSuministrada: 1 },
                          ],
                        })
                      }}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Agregar medicamento..." />
                      </SelectTrigger>
                      <SelectContent>
                        {medicamentos.map((m) => (
                          <SelectItem key={m.id} value={m.id.toString()}>
                            {m.descripcion} (Stock: {m.cantidadDisponible})
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </div>

              <DialogFooter>
                <Button type="button" variant="outline" onClick={cerrarModal}>
                  Cancelar
                </Button>
                <Button type="submit">
                  {editando ? "Actualizar" : "Guardar"}
                </Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      </div>
    </Layout>
  )
}

export default RegistroVisitas