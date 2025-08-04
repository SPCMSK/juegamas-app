import { Link } from "react-router-dom";
import { 
  MapPin, 
  Phone, 
  Clock, 
  CheckCircle,
  Instagram,
  MessageCircle
} from "lucide-react";

export function Footer() {
  return (
    <footer className="bg-gradient-to-br from-gray-900 to-black text-white">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          
          {/* Información de Contacto */}
          <div className="space-y-4">
            <h3 className="text-xl font-bold mb-4 text-primary">Sport La Calera</h3>
            <div className="space-y-3">
              <div className="flex items-center gap-3">
                <MapPin className="h-5 w-5 text-primary flex-shrink-0" />
                <span className="text-sm text-gray-300">
                  Calle Amthor sitio 4 y 5<br />
                  La Calera, Valparaíso
                </span>
              </div>
              <div className="flex items-center gap-3">
                <Phone className="h-5 w-5 text-primary flex-shrink-0" />
                <a href="https://wa.me/56926329990" className="text-sm text-gray-300 hover:text-primary transition-colors">
                  +56 9 2632 9990
                </a>
              </div>
              <div className="flex items-center gap-3">
                <Clock className="h-5 w-5 text-primary flex-shrink-0" />
                <span className="text-sm text-gray-300">
                  Lun - Dom: 19:00 - 23:00
                </span>
              </div>
            </div>
          </div>

          {/* Enlaces Rápidos */}
          <div className="space-y-4">
            <h3 className="text-xl font-bold mb-4">Enlaces Rápidos</h3>
            <div className="space-y-2">
              <Link to="/reservas" className="block text-sm text-gray-300 hover:text-primary transition-colors">
                Reservar Cancha
              </Link>
              <Link to="/comunidad" className="block text-sm text-gray-300 hover:text-primary transition-colors">
                Buscar Jugadores
              </Link>
              <Link to="/torneos" className="block text-sm text-gray-300 hover:text-primary transition-colors">
                Torneos y Eventos
              </Link>
              <a href="https://wa.me/56926329990" className="block text-sm text-gray-300 hover:text-primary transition-colors">
                Contacto WhatsApp
              </a>
            </div>
          </div>

          {/* Servicios */}
          <div className="space-y-4">
            <h3 className="text-xl font-bold mb-4">Nuestros Servicios</h3>
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <CheckCircle className="h-4 w-4 text-primary" />
                <span className="text-sm text-gray-300">2 Canchas Fútbol 6</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle className="h-4 w-4 text-primary" />
                <span className="text-sm text-gray-300">Césped Sintético</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle className="h-4 w-4 text-primary" />
                <span className="text-sm text-gray-300">Vestuarios y Duchas</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle className="h-4 w-4 text-primary" />
                <span className="text-sm text-gray-300">Estacionamiento Gratuito</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle className="h-4 w-4 text-primary" />
                <span className="text-sm text-gray-300">Quincho para Eventos</span>
              </div>
            </div>
          </div>

          {/* Redes Sociales */}
          <div className="space-y-4">
            <h3 className="text-xl font-bold mb-4">Síguenos</h3>
            <div className="flex gap-4 mb-4">
              <a 
                href="https://instagram.com/sportplay.cl" 
                className="w-10 h-10 bg-gradient-primary rounded-full flex items-center justify-center hover:opacity-80 transition-opacity"
                target="_blank"
                rel="noopener noreferrer"
              >
                <Instagram className="h-5 w-5 text-white" />
              </a>
              <a 
                href="https://wa.me/56926329990" 
                className="w-10 h-10 bg-green-600 rounded-full flex items-center justify-center hover:opacity-80 transition-opacity"
                target="_blank"
                rel="noopener noreferrer"
              >
                <MessageCircle className="h-5 w-5 text-white" />
              </a>
            </div>
            
            <div className="text-sm text-gray-300">
              <p>Contáctanos por WhatsApp para más información sobre promociones especiales y descuentos disponibles.</p>
            </div>
          </div>
        </div>

        {/* Copyright */}
        <div className="border-t border-gray-800 mt-8 pt-8 text-center">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-sm text-gray-400">
              © 2025 Sport La Calera. Todos los derechos reservados.
            </p>
            <div className="flex gap-6 text-sm text-gray-400">
              <span>Desde 2018 en La Calera</span>
              <span>7 años de experiencia</span>
              <span>Rating 4.8⭐</span>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
