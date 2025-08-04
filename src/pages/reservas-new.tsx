import { useState } from "react";
import { Navigation } from "@/components/ui/navigation";
import { Footer } from "@/components/ui/footer";
import { CalendarView } from "@/components/calendar/calendar-view";
import { BookingPanel } from "@/components/calendar/booking-panel";
import { AuthModal } from "@/components/auth/auth-modal";
import { useAuth } from "@/contexts/AuthContext";
import { useBookings } from "@/hooks/useBookings";
import { useCourts } from "@/hooks/useCourts";
import { useToast } from "@/hooks/use-toast";

interface TimeSlot {
  id: string;
  time: string;
  courtId: string;
  date: string;
  price: number;
  available: boolean;
  processing?: boolean;
}

export default function ReservasPage() {
  const [selectedSlot, setSelectedSlot] = useState<TimeSlot | null>(null);
  const [authModalOpen, setAuthModalOpen] = useState(false);
  const [isBookingPanelOpen, setIsBookingPanelOpen] = useState(false);

  const { user } = useAuth();
  const { toast } = useToast();
  const { courts, loading: courtsLoading } = useCourts();
  const { createBooking, loading: bookingLoading } = useBookings();
  const handleSlotSelect = (slot: TimeSlot) => {
    if (!user) {
      setAuthModalOpen(true);
      return;
    }
    setSelectedSlot(slot);
    setIsBookingPanelOpen(true);
  };

  const handleBookingConfirm = async () => {
    if (!selectedSlot || !user) return;

    try {
      await createBooking({
        court_id: selectedSlot.courtId,
        booking_date: selectedSlot.date,
        start_time: selectedSlot.time,
        end_time: `${parseInt(selectedSlot.time.split(':')[0]) + 1}:${selectedSlot.time.split(':')[1]}`,
        total_price: selectedSlot.price,
        payment_method: 'cash',
        payment_status: 'pending'
      });

      toast({
        title: "¡Reserva creada!",
        description: "Tu reserva ha sido creada exitosamente. Recibirás un email de confirmación.",
      });
      
      setIsBookingPanelOpen(false);
      setSelectedSlot(null);
    } catch (error) {
      toast({
        title: "Error",
        description: "Hubo un problema al crear la reserva. Intenta nuevamente.",
        variant: "destructive",
      });
    }
  };

  if (courtsLoading) {
    return (
      <div className="min-h-screen bg-background">
        <Navigation />
        <div className="container mx-auto px-4 py-8">
          <div className="animate-pulse space-y-4">
            <div className="h-8 bg-muted rounded w-1/3"></div>
            <div className="h-64 bg-muted rounded"></div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      
      <div className="container mx-auto px-4 py-8 max-w-7xl">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">Reservar Cancha - Sport La Calera</h1>
          <p className="text-muted-foreground">
            Reserva tu cancha de fútbol 6 desde $24.000/hora - Disponible todos los días de 19:00 a 23:00
          </p>
        </div>

        <CalendarView
          onSlotSelect={handleSlotSelect}
          selectedSlot={selectedSlot}
        />

        <BookingPanel
          isOpen={isBookingPanelOpen}
          onClose={() => {
            setIsBookingPanelOpen(false);
            setSelectedSlot(null);
          }}
          slot={selectedSlot}
          onConfirm={handleBookingConfirm}
        />

        <AuthModal
          isOpen={authModalOpen}
          onClose={() => setAuthModalOpen(false)}
        />
      </div>

      <Footer />
    </div>
  );
}
