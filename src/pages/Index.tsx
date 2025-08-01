import { useState } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Navigation } from "@/components/ui/navigation";
import { AuthModal } from "@/components/auth/auth-modal";
import { 
  Calendar, 
  Clock, 
  MapPin, 
  Phone, 
  Users, 
  Trophy, 
  Star,
  CheckCircle,
  ArrowRight,
  PlayCircle
} from "lucide-react";
import heroImage from "@/assets/hero-field.jpg";

const Index = () => {
  const [user, setUser] = useState(null);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);

  const features = [
    {
      icon: Calendar,
      title: "Reservas Online",
      description: "Reserva tu cancha favorita 24/7 desde tu móvil",
      color: "text-primary"
    },
    {
      icon: Users,
      title: "Encuentra Jugadores",
      description: "Conecta con otros jugadores y forma tu equipo ideal",
      color: "text-blue-500"
    },
    {
      icon: Trophy,
      title: "Torneos",
      description: "Participa en torneos emocionantes y gana premios",
      color: "text-yellow-500"
    },
    {
      icon: CheckCircle,
      title: "Fácil y Rápido",
      description: "Proceso de reserva simplificado en pocos clics",
      color: "text-green-500"
    }
  ];

  const stats = [
    { number: "500+", label: "Partidos por mes" },
    { number: "1200+", label: "Jugadores activos" },
    { number: "3", label: "Canchas disponibles" },
    { number: "4.9", label: "Calificación promedio" }
  ];

  return (
    <div className="min-h-screen bg-background">
      <Navigation 
        user={user} 
        onLoginClick={() => setIsAuthModalOpen(true)}
        onProfileClick={() => {}}
      />

      {/* Hero Section */}
      <section className="relative h-[80vh] flex items-center justify-center overflow-hidden">
        <div 
          className="absolute inset-0 bg-cover bg-center bg-no-repeat"
          style={{ backgroundImage: `url(${heroImage})` }}
        />
        <div className="absolute inset-0 bg-black/40" />
        
        <div className="relative z-10 text-center text-white max-w-4xl mx-auto px-4">
          <h1 className="text-4xl md:text-6xl font-bold mb-6 leading-tight">
            Tu Cancha Perfecta
            <span className="block text-primary-glow">Te Está Esperando</span>
          </h1>
          <p className="text-xl md:text-2xl mb-8 text-white/90 max-w-2xl mx-auto">
            Reserva canchas de fútbol, encuentra jugadores y únete a torneos. 
            Todo en una sola plataforma.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/reservas">
              <Button size="lg" className="bg-gradient-primary hover:opacity-90 text-lg px-8 py-4">
                <Calendar className="mr-2 h-5 w-5" />
                Ver Disponibilidad
              </Button>
            </Link>
            <Link to="/comunidad">
              <Button 
                size="lg" 
                variant="outline" 
                className="text-lg px-8 py-4 border-white/30 text-white hover:bg-white/10"
              >
                <Users className="mr-2 h-5 w-5" />
                Buscar Jugadores
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 bg-gradient-card">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <div key={index} className="text-center">
                <div className="text-3xl md:text-4xl font-bold text-primary mb-2">
                  {stat.number}
                </div>
                <div className="text-muted-foreground">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              ¿Por Qué Elegir JuegaFácil?
            </h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              La plataforma más completa para gestionar tu experiencia futbolística
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => {
              const Icon = feature.icon;
              return (
                <Card key={index} className="text-center shadow-card hover:shadow-sport transition-all duration-300 hover:scale-105">
                  <CardHeader>
                    <div className={`w-16 h-16 mx-auto mb-4 rounded-full bg-gradient-primary flex items-center justify-center`}>
                      <Icon className="h-8 w-8 text-white" />
                    </div>
                    <CardTitle className="text-xl">{feature.title}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <CardDescription className="text-base">{feature.description}</CardDescription>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>
      </section>

      {/* Contact Info Section */}
      <section className="py-16 bg-gradient-card">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl font-bold mb-6">Información de Contacto</h2>
              
              <div className="space-y-6">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-gradient-primary rounded-full flex items-center justify-center">
                    <Clock className="h-6 w-6 text-white" />
                  </div>
                  <div>
                    <h3 className="font-semibold">Horarios de Atención</h3>
                    <p className="text-muted-foreground">Lunes a Domingo: 7:00 AM - 11:00 PM</p>
                  </div>
                </div>
                
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-gradient-primary rounded-full flex items-center justify-center">
                    <Phone className="h-6 w-6 text-white" />
                  </div>
                  <div>
                    <h3 className="font-semibold">Teléfono de Contacto</h3>
                    <a href="tel:+56912345678" className="text-primary hover:underline text-lg font-medium">
                      +56 9 1234 5678
                    </a>
                  </div>
                </div>
                
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-gradient-primary rounded-full flex items-center justify-center">
                    <MapPin className="h-6 w-6 text-white" />
                  </div>
                  <div>
                    <h3 className="font-semibold">Ubicación</h3>
                    <p className="text-muted-foreground">Av. Libertador 1234, Santiago, Chile</p>
                  </div>
                </div>
              </div>
            </div>
            
            <Card className="shadow-sport">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Star className="h-5 w-5 text-yellow-500" />
                  Instalaciones Premium
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center gap-2">
                  <CheckCircle className="h-5 w-5 text-success" />
                  <span>Césped sintético de última generación</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle className="h-5 w-5 text-success" />
                  <span>Vestuarios y duchas incluidas</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle className="h-5 w-5 text-success" />
                  <span>Estacionamiento gratuito</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle className="h-5 w-5 text-success" />
                  <span>Árbitro disponible (opcional)</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle className="h-5 w-5 text-success" />
                  <span>Balones y petos incluidos</span>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-hero text-white">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-6">
            ¿Listo para Jugar?
          </h2>
          <p className="text-xl mb-8 text-white/90 max-w-2xl mx-auto">
            Únete a nuestra comunidad de jugadores y disfruta del mejor fútbol en Santiago
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/reservas">
              <Button size="lg" variant="secondary" className="text-lg px-8 py-4">
                <Calendar className="mr-2 h-5 w-5" />
                Reservar Ahora
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </Link>
            <Button 
              size="lg" 
              variant="outline" 
              className="text-lg px-8 py-4 border-white/30 text-white hover:bg-white/10"
              onClick={() => setIsAuthModalOpen(true)}
            >
              <PlayCircle className="mr-2 h-5 w-5" />
              Comenzar Gratis
            </Button>
          </div>
        </div>
      </section>

      <AuthModal 
        isOpen={isAuthModalOpen}
        onClose={() => setIsAuthModalOpen(false)}
        onAuthSuccess={(user) => setUser(user)}
      />
    </div>
  );
};

export default Index;
