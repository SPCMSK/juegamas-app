import { useState } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Navigation } from "@/components/ui/navigation";
import { Footer } from "@/components/ui/footer";
import { AuthModal } from "@/components/auth/auth-modal";
import { 
  Calendar, 
  Clock, 
  Users, 
  Trophy, 
  Star,
  Shield,
  CheckCircle,
  Phone,
  MapPin,
  ArrowRight,
  Calendar as CalendarIcon,
  Play,
  Sparkles
} from "lucide-react";
import heroImage from "@/assets/hero-field.jpg";

export default function Index() {
  const [user, setUser] = useState(null);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);

  const features = [
    {
      icon: Calendar,
      title: "Reserva Online",
      description: "Sistema de reservas 24/7 fácil y rápido"
    },
    {
      icon: Users,
      title: "Equipos y Torneos",
      description: "Únete a equipos, participa en torneos"
    },
    {
      icon: Shield,
      title: "Canchas de Calidad",
      description: "Césped sintético profesional, iluminación LED"
    },
    {
      icon: Trophy,
      title: "Competencias",
      description: "Torneos regulares con premios atractivos"
    }
  ];

  const services = [
    {
      title: "Fútbol 6",
      description: "Canchas profesionales para 6 jugadores por equipo",
      price: "Desde $24.000/hora",
      features: ["Césped sintético", "Iluminación LED", "Vestuarios"]
    },
    {
      title: "Torneos",
      description: "Competencias regulares para todos los niveles",
      price: "Inscripción desde $35.000",
      features: ["Trofeos y medallas", "Arbitraje profesional", "Premiación"]
    },
    {
      title: "Equipos",
      description: "Encuentra jugadores o únete a un equipo",
      price: "Gratis",
      features: ["Sistema de rankings", "Chat de equipo", "Estadísticas"]
    }
  ];

  const stats = [
    { number: "7", label: "Años de experiencia" },
    { number: "300+", label: "Partidos por mes" },
    { number: "2", label: "Canchas disponibles" },
    { number: "4.8", label: "Calificación promedio" }
  ];

  return (
    <div className="min-h-screen bg-background">
      <Navigation />

      {/* Hero Section */}
      <section className="relative h-[80vh] flex items-center justify-center overflow-hidden">
        <div 
          className="absolute inset-0 bg-cover bg-center bg-no-repeat"
          style={{ backgroundImage: `url(${heroImage})` }}
        />
        <div className="absolute inset-0 bg-black/40" />
        
        <div className="relative z-10 text-center text-white px-4 max-w-4xl mx-auto">
          <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm rounded-full px-4 py-2 mb-6">
            <Sparkles className="h-4 w-4 text-yellow-400" />
            <span className="text-sm font-medium">¡Nuevas canchas renovadas!</span>
          </div>
          
          <h1 className="text-4xl md:text-6xl font-bold mb-6 leading-tight">
            El Mejor Centro Deportivo 
            <span className="block text-primary">de La Calera</span>
          </h1>
          
          <p className="text-xl md:text-2xl mb-8 text-white/90 max-w-2xl mx-auto">
            Canchas de fútbol 6 profesionales, torneos emocionantes y una comunidad apasionada por el deporte.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button asChild size="lg" className="bg-primary hover:bg-primary/90 text-white px-8 py-3">
              <Link to="/reservas">
                <Calendar className="mr-2 h-5 w-5" />
                Reservar Ahora
              </Link>
            </Button>
            <Button variant="outline" size="lg" className="border-white text-white hover:bg-white hover:text-black px-8 py-3">
              <Play className="mr-2 h-5 w-5" />
              Ver Video
            </Button>
          </div>
          
          {/* Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mt-12">
            {stats.map((stat, index) => (
              <div key={index} className="text-center">
                <div className="text-2xl md:text-3xl font-bold text-primary mb-1">{stat.number}</div>
                <div className="text-sm text-white/80">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <Badge variant="outline" className="mb-4">¿Por qué elegirnos?</Badge>
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Experiencia Premium</h2>
            <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
              Ofrecemos la mejor experiencia deportiva con instalaciones de primera clase y servicios profesionales.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {features.map((feature, index) => (
              <Card key={index} className="text-center border-0 shadow-lg hover:shadow-xl transition-shadow bg-gradient-card">
                <CardContent className="pt-8">
                  <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-gradient-primary flex items-center justify-center">
                    <feature.icon className="h-8 w-8 text-white" />
                  </div>
                  <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
                  <p className="text-muted-foreground">{feature.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Services Section */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <Badge variant="outline" className="mb-4">Nuestros Servicios</Badge>
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Todo lo que Necesitas</h2>
            <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
              Desde canchas profesionales hasta competencias organizadas, tenemos todo para tu pasión por el fútbol.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {services.map((service, index) => (
              <Card key={index} className="border-0 shadow-lg hover:shadow-xl transition-all group hover:-translate-y-1 bg-gradient-card">
                <CardHeader>
                  <CardTitle className="text-2xl">{service.title}</CardTitle>
                  <CardDescription className="text-base">{service.description}</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-primary mb-4">{service.price}</div>
                  <ul className="space-y-2 mb-6">
                    {service.features.map((feature, featureIndex) => (
                      <li key={featureIndex} className="flex items-center gap-2">
                        <CheckCircle className="h-4 w-4 text-success" />
                        <span className="text-sm">{feature}</span>
                      </li>
                    ))}
                  </ul>
                  <Button className="w-full group-hover:bg-primary group-hover:text-white transition-colors">
                    Más Información
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-primary text-white">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">¿Listo para Jugar?</h2>
          <p className="text-xl mb-8 text-white/90 max-w-2xl mx-auto">
            Únete a la comunidad más activa de fútbol en La Calera. Reserva tu cancha y comienza a disfrutar.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
            <Button asChild size="lg" variant="secondary" className="px-8 py-3">
              <Link to="/reservas">
                <Calendar className="mr-2 h-5 w-5" />
                Reservar Cancha
              </Link>
            </Button>
            <Button asChild size="lg" variant="outline" className="border-white text-white hover:bg-white hover:text-primary px-8 py-3">
              <Link to="/torneos">
                <Trophy className="mr-2 h-5 w-5" />
                Ver Torneos
              </Link>
            </Button>
          </div>
          
          {/* Contact Info */}
          <div className="flex flex-col md:flex-row gap-6 justify-center text-white/90">
            <div className="flex items-center gap-2">
              <MapPin className="h-5 w-5" />
              <span>Av. Principal 123, La Calera</span>
            </div>
            <div className="flex items-center gap-2">
              <Phone className="h-5 w-5" />
              <span>+56 9 1234 5678</span>
            </div>
            <div className="flex items-center gap-2">
              <Clock className="h-5 w-5" />
              <span>Lun-Dom: 19:00-23:00</span>
            </div>
          </div>
        </div>
      </section>

      <Footer />

      <AuthModal 
        isOpen={isAuthModalOpen}
        onClose={() => setIsAuthModalOpen(false)}
      />
    </div>
  );
}
