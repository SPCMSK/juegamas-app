import { useState } from "react";
import { Calendar, Clock, MapPin, Users, CheckCircle, XCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { useToast } from "@/hooks/use-toast";

interface TimeSlot {
  id: string;
  time: string;
  court: string;
  price: number;
  available: boolean;
  duration: number;
}

interface BookingModalProps {
  slot: TimeSlot;
  selectedDate: string;
  onConfirm: (slot: TimeSlot) => void;
}

function BookingModal({ slot, selectedDate, onConfirm }: BookingModalProps) {
  const [isOpen, setIsOpen] = useState(false);

  const handleConfirm = () => {
    onConfirm(slot);
    setIsOpen(false);
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button 
          size="sm" 
          className="w-full bg-gradient-primary hover:opacity-90"
          disabled={!slot.available}
        >
          {slot.available ? "Reservar" : "Ocupado"}
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Confirmar Reserva</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <div className="bg-gradient-card rounded-lg p-4 space-y-3">
            <div className="flex items-center gap-2 text-sm">
              <Calendar className="h-4 w-4 text-primary" />
              <span className="font-medium">{selectedDate}</span>
            </div>
            <div className="flex items-center gap-2 text-sm">
              <Clock className="h-4 w-4 text-primary" />
              <span>{slot.time} ({slot.duration}h)</span>
            </div>
            <div className="flex items-center gap-2 text-sm">
              <MapPin className="h-4 w-4 text-primary" />
              <span>{slot.court}</span>
            </div>
            <div className="flex items-center justify-between pt-2 border-t">
              <span className="font-semibold">Total:</span>
              <span className="text-xl font-bold text-primary">${slot.price.toLocaleString()}</span>
            </div>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" onClick={() => setIsOpen(false)} className="flex-1">
              Cancelar
            </Button>
            <Button onClick={handleConfirm} className="flex-1 bg-gradient-primary hover:opacity-90">
              Confirmar Reserva
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}

export default function Reservas() {
  const [selectedDate, setSelectedDate] = useState(
    new Date().toISOString().split('T')[0]
  );
  const [selectedCourt, setSelectedCourt] = useState("all");
  const { toast } = useToast();

  // Mock data - replace with real data
  const courts = [
    { id: "court1", name: "Cancha 1 - Fútbol 5", type: "5vs5" },
    { id: "court2", name: "Cancha 2 - Fútbol 7", type: "7vs7" },
    { id: "court3", name: "Cancha 3 - Fútbol 5", type: "5vs5" },
  ];

  const timeSlots: TimeSlot[] = [
    { id: "1", time: "08:00", court: "Cancha 1", price: 25000, available: true, duration: 1 },
    { id: "2", time: "09:00", court: "Cancha 1", price: 25000, available: false, duration: 1 },
    { id: "3", time: "10:00", court: "Cancha 1", price: 30000, available: true, duration: 1 },
    { id: "4", time: "11:00", court: "Cancha 1", price: 30000, available: true, duration: 1 },
    { id: "5", time: "08:00", court: "Cancha 2", price: 35000, available: true, duration: 1 },
    { id: "6", time: "09:00", court: "Cancha 2", price: 35000, available: true, duration: 1 },
    { id: "7", time: "10:00", court: "Cancha 2", price: 40000, available: false, duration: 1 },
    { id: "8", time: "11:00", court: "Cancha 2", price: 40000, available: true, duration: 1 },
  ];

  const filteredSlots = selectedCourt === "all" 
    ? timeSlots 
    : timeSlots.filter(slot => {
        const court = courts.find(c => c.name.includes(selectedCourt));
        return slot.court === court?.name;
      });

  const handleBooking = (slot: TimeSlot) => {
    toast({
      title: "¡Reserva Confirmada!",
      description: `Tu cancha está reservada para ${selectedDate} a las ${slot.time}`,
    });
  };

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr + 'T00:00:00');
    return date.toLocaleDateString('es-ES', { 
      weekday: 'long', 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    });
  };

  return (
    <div className="container mx-auto px-4 py-8 max-w-6xl">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Reservar Cancha</h1>
        <p className="text-muted-foreground">Selecciona la fecha, cancha y horario para tu partido</p>
      </div>

      {/* Date and Court Selection */}
      <div className="grid md:grid-cols-2 gap-4 mb-8">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Calendar className="h-5 w-5 text-primary" />
              Seleccionar Fecha
            </CardTitle>
          </CardHeader>
          <CardContent>
            <input
              type="date"
              value={selectedDate}
              onChange={(e) => setSelectedDate(e.target.value)}
              min={new Date().toISOString().split('T')[0]}
              className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
            />
            <p className="text-sm text-muted-foreground mt-2">
              {formatDate(selectedDate)}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <MapPin className="h-5 w-5 text-primary" />
              Filtrar por Cancha
            </CardTitle>
          </CardHeader>
          <CardContent>
            <select
              value={selectedCourt}
              onChange={(e) => setSelectedCourt(e.target.value)}
              className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
            >
              <option value="all">Todas las canchas</option>
              {courts.map(court => (
                <option key={court.id} value={court.id}>
                  {court.name}
                </option>
              ))}
            </select>
          </CardContent>
        </Card>
      </div>

      {/* Available Time Slots */}
      <div className="space-y-6">
        {courts.map(court => {
          const courtSlots = filteredSlots.filter(slot => 
            slot.court === court.name || selectedCourt === "all"
          ).filter(slot => slot.court === court.name);

          if (courtSlots.length === 0 && selectedCourt !== "all") return null;

          return (
            <Card key={court.id} className="shadow-card">
              <CardHeader className="pb-4">
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle className="flex items-center gap-2">
                      <MapPin className="h-5 w-5 text-primary" />
                      {court.name}
                    </CardTitle>
                    <CardDescription className="flex items-center gap-2 mt-1">
                      <Users className="h-4 w-4" />
                      {court.type}
                    </CardDescription>
                  </div>
                  <Badge variant="secondary">{court.type}</Badge>
                </div>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-3">
                  {courtSlots.map(slot => (
                    <div key={slot.id} className="space-y-2">
                      <div className={`p-3 rounded-lg border-2 transition-all ${
                        slot.available 
                          ? 'border-primary/20 bg-gradient-card hover:border-primary/40' 
                          : 'border-border bg-muted/50'
                      }`}>
                        <div className="flex items-center gap-2 mb-2">
                          <Clock className="h-4 w-4 text-primary" />
                          <span className="font-medium">{slot.time}</span>
                          {slot.available ? (
                            <CheckCircle className="h-4 w-4 text-success ml-auto" />
                          ) : (
                            <XCircle className="h-4 w-4 text-destructive ml-auto" />
                          )}
                        </div>
                        <p className="text-sm font-semibold text-primary">
                          ${slot.price.toLocaleString()}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          {slot.duration}h
                        </p>
                      </div>
                      <BookingModal 
                        slot={slot} 
                        selectedDate={formatDate(selectedDate)}
                        onConfirm={handleBooking}
                      />
                    </div>
                  ))}
                </div>
                {courtSlots.length === 0 && (
                  <div className="text-center py-8 text-muted-foreground">
                    <Calendar className="h-12 w-12 mx-auto mb-2 opacity-50" />
                    <p>No hay horarios disponibles para esta fecha</p>
                  </div>
                )}
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Info Card */}
      <Card className="mt-8 bg-gradient-card">
        <CardHeader>
          <CardTitle className="text-lg">Información Importante</CardTitle>
        </CardHeader>
        <CardContent className="space-y-2 text-sm">
          <p>• Las reservas deben confirmarse al menos 1 hora antes del partido</p>
          <p>• Incluye: balón, petos para equipos y árbitro (opcional)</p>
          <p>• Canchas con césped sintético de última generación</p>
          <p>• Estacionamiento gratuito disponible</p>
          <p>• Vestuarios y duchas incluidas</p>
        </CardContent>
      </Card>
    </div>
  );
}