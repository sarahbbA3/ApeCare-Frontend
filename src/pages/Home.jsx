import { Link } from "react-router-dom";
import {
  Card,
  CardContent,
  CardHeader,
  CardActions,
  Typography,
  Button,
  Box,
} from "@mui/material";
import {
  Pill,
  Tag,
  MapPin,
  Activity,
  Shield,
  TrendingUp,
  ArrowRight,
  HeartPulse,
} from "lucide-react";
import Layout from "../components/common/Layout";

const Home = () => {
  return (
    <Layout>
    <div className="flex flex-col">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-b from-accent/30 to-background">
        <div className="container mx-auto px-4 py-20 md:py-32">
          <div className="mx-auto max-w-4xl text-center">
            <div className="mb-6 inline-flex items-center gap-2 rounded-full bg-primary/10 px-4 py-2 text-sm font-medium text-primary">
              <Activity className="h-4 w-4" />
              Sistema de Gestión Médica
            </div>

            <h1 className="mb-6 text-balance text-4xl font-bold tracking-tight text-foreground md:text-6xl lg:text-7xl">
              Bienvenido a <span className="text-primary">ApeCare</span>
            </h1>

            <p className="mb-10 text-pretty text-lg text-muted-foreground md:text-xl lg:text-2xl">
              Sistema profesional para la gestión integral de inventario médico y
              farmacéutico. Controla, organiza y optimiza tu dispensario con
              eficiencia.
            </p>

            <div className="flex flex-col items-center justify-center gap-4 sm:flex-row">
              <Link to="/tipo-farmaco">
                <Button size="lg" className="gap-2 text-base">
                  Comenzar
                  <ArrowRight className="h-5 w-5" />
                </Button>
              </Link>
              {/*<Button size="lg" variant="outline" className="text-base bg-transparent">
                Ver Demo
              </Button>*/}
            </div>
          </div>
        </div>

        {/* Decorative Elements */}
        <div className="absolute -top-24 right-0 h-96 w-96 rounded-full bg-primary/5 blur-3xl" />
        <div className="absolute -bottom-24 left-0 h-96 w-96 rounded-full bg-accent/20 blur-3xl" />
      </section>

      {/* Features Section */}
      <section className="container mx-auto px-4 py-16 md:py-24">
        <div className="mb-12 text-center">
          <h2 className="mb-4 text-balance text-3xl font-bold text-foreground md:text-4xl">
            Módulos del Sistema
          </h2>
          <p className="text-pretty text-lg text-muted-foreground">
            Accede rápidamente a las diferentes secciones de gestión
          </p>
        </div>

        <div className="grid gap-6 md:grid-cols-3">
          {/* 🔄 CAMBIO: Registro de Visitas */}
<Link to="/registro-visita" className="group">
  <Card className="h-full transition-all hover:shadow-lg hover:border-primary/50">
    <CardHeader
      title={
        <Typography className="text-xl" component="div">
          Registro de Visitas
        </Typography>
      }
      avatar={
        <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-lg bg-primary/10 text-primary transition-colors group-hover:bg-primary group-hover:text-primary-foreground">
          <Activity className="h-7 w-7" />
        </div>
      }
      subheader={null}
    />
    <CardContent>
      <Typography variant="body2" color="text.secondary" className="text-base">
        Registra síntomas, medicamentos y recomendaciones por visita médica
      </Typography>
    </CardContent>
    <CardActions>
      <div className="flex items-center gap-2 text-sm font-medium text-primary">
        Acceder al módulo
        <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
      </div>
    </CardActions>
  </Card>
</Link>
          <Link to="/tipo-farmaco" className="group">
            <Card className="h-full transition-all hover:shadow-lg hover:border-primary/50">
              <CardHeader
                title={
                  <Typography className="text-xl" component="div">
                    Tipo de Fármaco
                  </Typography>
                }
                avatar={
                  <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-lg bg-primary/10 text-primary transition-colors group-hover:bg-primary group-hover:text-primary-foreground">
                    <Pill className="h-7 w-7" />
                  </div>
                }
                subheader={null}
              />
              <CardContent>
                <Typography variant="body2" color="text.secondary" className="text-base">
                  Gestiona y clasifica los diferentes tipos de medicamentos en tu inventario
                </Typography>
              </CardContent>
              <CardActions>
                <div className="flex items-center gap-2 text-sm font-medium text-primary">
                  Acceder al módulo
                  <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                </div>
              </CardActions>
            </Card>
          </Link>

          <Link to="/marca" className="group">
            <Card className="h-full transition-all hover:shadow-lg hover:border-primary/50">
              <CardHeader
                title={
                  <Typography className="text-xl" component="div">
                    Marca
                  </Typography>
                }
                avatar={
                  <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-lg bg-primary/10 text-primary transition-colors group-hover:bg-primary group-hover:text-primary-foreground">
                    <Tag className="h-7 w-7" />
                  </div>
                }
                subheader={null}
              />
              <CardContent>
                <Typography variant="body2" color="text.secondary" className="text-base">
                  Administra las marcas y fabricantes de productos farmacéuticos
                </Typography>
              </CardContent>
              <CardActions>
                <div className="flex items-center gap-2 text-sm font-medium text-primary">
                  Acceder al módulo
                  <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                </div>
              </CardActions>
            </Card>
          </Link>

          <Link to="/sintoma" className="group">
  <Card className="h-full transition-all hover:shadow-lg hover:border-primary/50">
    <CardHeader
      title={
        <Typography className="text-xl" component="div">
          Síntomas
        </Typography>
      }
      avatar={
        <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-lg bg-primary/10 text-primary transition-colors group-hover:bg-primary group-hover:text-primary-foreground">
          <HeartPulse className="h-7 w-7" />
        </div>
      }
      subheader={null}
    />
    <CardContent>
      <Typography variant="body2" color="text.secondary" className="text-base">
        Registra y gestiona los síntomas clínicos observados en los pacientes
      </Typography>
    </CardContent>
    <CardActions>
      <div className="flex items-center gap-2 text-sm font-medium text-primary">
        Acceder al módulo
        <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
      </div>
    </CardActions>
  </Card>
</Link>

          <Link to="/ubicacion" className="group">
            <Card className="h-full transition-all hover:shadow-lg hover:border-primary/50">
              <CardHeader
                title={
                  <Typography className="text-xl" component="div">
                    Ubicación
                  </Typography>
                }
                avatar={
                  <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-lg bg-primary/10 text-primary transition-colors group-hover:bg-primary group-hover:text-primary-foreground">
                    <MapPin className="h-7 w-7" />
                  </div>
                }
                subheader={null}
              />
              <CardContent>
                <Typography variant="body2" color="text.secondary" className="text-base">
                  Controla la ubicación física de los medicamentos en el dispensario
                </Typography>
              </CardContent>
              <CardActions>
                <div className="flex items-center gap-2 text-sm font-medium text-primary">
                  Acceder al módulo
                  <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                </div>
              </CardActions>
            </Card>
          </Link>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="bg-muted/50 py-16 md:py-24">
        <div className="container mx-auto px-4">
          <div className="mb-12 text-center">
            <h2 className="mb-4 text-balance text-3xl font-bold text-foreground md:text-4xl">¿Por qué ApeCare?</h2>
            <p className="text-pretty text-lg text-muted-foreground">Optimiza la gestión de tu dispensario médico</p>
          </div>

          <div className="grid gap-8 md:grid-cols-3">
            <div className="flex flex-col items-center text-center">
              <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-primary/10">
                <Shield className="h-8 w-8 text-primary" />
              </div>
              <h3 className="mb-2 text-xl font-semibold text-foreground">Seguro y Confiable</h3>
              <p className="text-muted-foreground">
                Sistema robusto diseñado específicamente para entornos médicos con altos estándares de seguridad
              </p>
            </div>

            <div className="flex flex-col items-center text-center">
              <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-primary/10">
                <TrendingUp className="h-8 w-8 text-primary" />
              </div>
              <h3 className="mb-2 text-xl font-semibold text-foreground">Eficiencia Mejorada</h3>
              <p className="text-muted-foreground">
                Reduce tiempos de búsqueda y mejora el control de inventario con nuestra interfaz intuitiva
              </p>
            </div>

            <div className="flex flex-col items-center text-center">
              <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-primary/10">
                <Activity className="h-8 w-8 text-primary" />
              </div>
              <h3 className="mb-2 text-xl font-semibold text-foreground">Monitoreo en Tiempo Real</h3>
              <p className="text-muted-foreground">
                Mantén un control actualizado de tu inventario y ubicaciones en todo momento
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="container mx-auto px-4 py-16 md:py-24">
        <Card className="overflow-hidden border-primary/20 bg-gradient-to-br from-primary/5 to-accent/10">
          <CardContent className="p-8 md:p-12">
            <div className="mx-auto max-w-2xl text-center">
              <h2 className="mb-4 text-balance text-3xl font-bold text-foreground md:text-4xl">
                Comienza a gestionar tu inventario hoy
              </h2>
              <p className="mb-8 text-pretty text-lg text-muted-foreground">
                Accede a todas las funcionalidades del sistema y optimiza la gestión de tu dispensario médico
              </p>
              <Link to="/tipo-farmaco">
                <Button size="lg" className="gap-2 text-base">
                  Ir al Sistema
                  <ArrowRight className="h-5 w-5" />
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>
      </section>
    </div>
    </Layout>
  );
};
export default Home;