import { useState } from "react";
import { X, Calendar, Clock, MapPin, CreditCard, CheckCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { cn } from "@/lib/utils";
import { format, parseISO } from "date-fns";
import { es } from "date-fns/locale";

interface TimeSlot {
  id: string;
  time: string;
  courtId: string;
  date: string;
  price: number;
  available: boolean;
  processing?: boolean;
}

interface Court {
  id: string;
  name: string;
  type: string;
  pricePerHour: number;
}

interface BookingPanelProps {
  isOpen: boolean;
  onClose: () => void;
  slot: TimeSlot | null;
  court: Court | null;
  onConfirm: (slot: TimeSlot) => Promise<void>;
  isProcessing: boolean;
}

export function BookingPanel({ isOpen, onClose, slot, court, onConfirm, isProcessing }: BookingPanelProps) {
  const [isConfirming, setIsConfirming] = useState(false);

  if (!slot || !court) return null;

  const handleConfirm = async () => {
    setIsConfirming(true);
    try {
      await onConfirm(slot);
      onClose();
    } catch (error) {
      console.error("Error confirming booking:", error);
    } finally {
      setIsConfirming(false);
    }
  };

  const formatDate = (dateStr: string) => {
    const date = parseISO(dateStr + 'T00:00:00');
    return format(date, "EEEE, d 'de' MMMM", { locale: es });
  };

  return (
    <>
      {/* Backdrop */}
      <div 
        className={cn(
          "fixed inset-0 bg-black/50 z-40 transition-opacity duration-300",
          isOpen ? "opacity-100" : "opacity-0 pointer-events-none"
        )}
        onClick={onClose}
      />
      
      {/* Panel */}
      <div 
        className={cn(
          "fixed right-0 top-0 h-full w-full max-w-md bg-background shadow-2xl z-50 transition-transform duration-300 ease-out",
          isOpen ? "translate-x-0" : "translate-x-full"
        )}
      >
        <div className="flex flex-col h-full">
          {/* Header */}
          <div className="flex items-center justify-between p-6 border-b bg-gradient-card">
            <div>
              <h2 className="text-xl font-semibold">Confirmar Reserva</h2>
              <p className="text-sm text-muted-foreground">Revisa los detalles antes de confirmar</p>
            </div>
            <Button variant="ghost" size="sm" onClick={onClose}>
              <X className="h-5 w-5" />
            </Button>
          </div>

          {/* Content */}
          <div className="flex-1 p-6 space-y-6 overflow-auto">
            {/* Booking Summary */}
            <Card className="shadow-card">
              <CardHeader className="pb-4">
                <CardTitle className="text-lg flex items-center gap-2">
                  <CheckCircle className="h-5 w-5 text-primary" />
                  Detalles de la Reserva
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-3">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-gradient-primary flex items-center justify-center">
                      <MapPin className="h-5 w-5 text-white" />
                    </div>
                    <div>
                      <p className="font-medium">{court.name}</p>
                      <Badge variant="secondary" className="text-xs">{court.type}</Badge>
                    </div>
                  </div>
                  
                  <Separator />
                  
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-gradient-primary flex items-center justify-center">
                      <Calendar className="h-5 w-5 text-white" />
                    </div>
                    <div>
                      <p className="font-medium">{formatDate(slot.date)}</p>
                      <p className="text-sm text-muted-foreground">Fecha del partido</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-gradient-primary flex items-center justify-center">
                      <Clock className="h-5 w-5 text-white" />
                    </div>
                    <div>
                      <p className="font-medium">{slot.time} - {slot.time.split(':')[0].padStart(2, '0')}:{(parseInt(slot.time.split(':')[0]) + 1).toString().padStart(2, '0')}:00</p>
                      <p className="text-sm text-muted-foreground">1 hora de juego</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Price Breakdown */}
            <Card className="shadow-card">
              <CardHeader className="pb-4">
                <CardTitle className="text-lg flex items-center gap-2">
                  <CreditCard className="h-5 w-5 text-primary" />
                  Resumen de Pago
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span>Alquiler de cancha (1h)</span>
                    <span>${slot.price.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between text-sm text-muted-foreground">
                    <span>Incluye: balón, petos, vestuarios</span>
                    <span>Incluido</span>
                  </div>
                  <Separator />
                  <div className="flex justify-between font-semibold text-lg">
                    <span>Total</span>
                    <span className="text-primary">${slot.price.toLocaleString()}</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Additional Info */}
            <Card className="bg-gradient-card border-primary/20">
              <CardContent className="pt-6">
                <div className="space-y-2 text-sm">
                  <h4 className="font-medium flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-success" />
                    Incluido en tu reserva:
                  </h4>
                  <ul className="space-y-1 text-muted-foreground ml-6">
                    <li>• Balón oficial de fútbol</li>
                    <li>• Petos para equipos</li>
                    <li>• Acceso a vestuarios y duchas</li>
                    <li>• Estacionamiento gratuito</li>
                  </ul>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Actions */}
          <div className="p-6 border-t bg-background space-y-3">
            <Button 
              onClick={handleConfirm}
              className="w-full bg-gradient-primary hover:opacity-90 text-lg py-3"
              disabled={isConfirming || isProcessing}
            >
              {isConfirming ? (
                <div className="flex items-center gap-2">
                  <div className="animate-spin w-4 h-4 border-2 border-white border-t-transparent rounded-full" />
                  Procesando...
                </div>
              ) : (
                <>
                  <CheckCircle className="h-5 w-5 mr-2" />
                  Confirmar Reserva
                </>
              )}
            </Button>
            <Button 
              variant="outline" 
              onClick={onClose} 
              className="w-full"
              disabled={isConfirming}
            >
              Cancelar
            </Button>
            
            <p className="text-xs text-center text-muted-foreground">
              Al confirmar aceptas nuestros términos y condiciones
            </p>
          </div>
        </div>
      </div>
    </>
  );
}