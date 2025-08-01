import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { CalendarView } from "@/components/calendar/calendar-view";
import { BookingPanel } from "@/components/calendar/booking-panel";
import { Navigation } from "@/components/ui/navigation";
import { AuthModal } from "@/components/auth/auth-modal";
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

interface Court {
  id: string;
  name: string;
  type: string;
  pricePerHour: number;
}

// Mock data - replace with real API calls
const mockCourts: Court[] = [
  { id: "court1", name: "Cancha 1 - Fútbol 5", type: "5vs5", pricePerHour: 25000 },
  { id: "court2", name: "Cancha 2 - Fútbol 7", type: "7vs7", pricePerHour: 35000 },
  { id: "court3", name: "Cancha 3 - Fútbol 5", type: "5vs5", pricePerHour: 25000 },
];

export default function ReservasOptimized() {
  const [user, setUser] = useState(null);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [selectedSlot, setSelectedSlot] = useState<TimeSlot | null>(null);
  const [isBookingPanelOpen, setIsBookingPanelOpen] = useState(false);
  const [optimisticBookings, setOptimisticBookings] = useState<Set<string>>(new Set());
  
  const { toast } = useToast();
  const queryClient = useQueryClient();

  // React Query for courts data
  const { data: courts = mockCourts, isLoading: courtsLoading } = useQuery({
    queryKey: ['courts'],
    queryFn: () => Promise.resolve(mockCourts), // Replace with real API call
  });

  // Optimistic booking mutation
  const bookingMutation = useMutation({
    mutationFn: async (slot: TimeSlot) => {
      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // Simulate occasional booking conflicts (10% chance)
      if (Math.random() < 0.1) {
        throw new Error("BOOKING_CONFLICT");
      }
      
      return { success: true, bookingId: `booking_${Date.now()}` };
    },
    onMutate: async (slot: TimeSlot) => {
      // Optimistic update: immediately show slot as processing
      setOptimisticBookings(prev => new Set([...prev, slot.id]));
    },
    onSuccess: (data, slot) => {
      // Remove from optimistic bookings and show success
      setOptimisticBookings(prev => {
        const newSet = new Set(prev);
        newSet.delete(slot.id);
        return newSet;
      });
      
      toast({
        title: "¡Reserva Confirmada!",
        description: `Tu cancha está reservada para ${slot.date} a las ${slot.time}`,
      });
      
      // Invalidate queries to refresh data
      queryClient.invalidateQueries({ queryKey: ['bookings'] });
    },
    onError: (error: Error, slot) => {
      // Remove optimistic booking and show error
      setOptimisticBookings(prev => {
        const newSet = new Set(prev);
        newSet.delete(slot.id);
        return newSet;
      });
      
      if (error.message === "BOOKING_CONFLICT") {
        toast({
          title: "¡Ups! Horario Ocupado",
          description: "Este horario acaba de ser reservado. Por favor, selecciona otro.",
          variant: "destructive",
        });
      } else {
        toast({
          title: "Error en la Reserva",
          description: "Hubo un problema al procesar tu reserva. Intenta nuevamente.",
          variant: "destructive",
        });
      }
    }
  });

  const handleSlotSelect = (slot: TimeSlot) => {
    if (!user) {
      setIsAuthModalOpen(true);
      return;
    }
    
    setSelectedSlot(slot);
    setIsBookingPanelOpen(true);
  };

  const handleBookingConfirm = async (slot: TimeSlot) => {
    await bookingMutation.mutateAsync(slot);
  };

  const getSelectedCourt = () => {
    if (!selectedSlot) return null;
    return courts.find(court => court.id === selectedSlot.courtId) || null;
  };

  if (courtsLoading) {
    return (
      <div className="min-h-screen bg-background">
        <Navigation 
          user={user} 
          onLoginClick={() => setIsAuthModalOpen(true)}
          onProfileClick={() => {}}
        />
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
      <Navigation 
        user={user} 
        onLoginClick={() => setIsAuthModalOpen(true)}
        onProfileClick={() => {}}
      />
      
      <div className="container mx-auto px-4 py-8 max-w-7xl">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">Reservar Cancha - Ultra Rápido</h1>
          <p className="text-muted-foreground">
            Selecciona tu horario ideal y confirma tu reserva en segundos
          </p>
        </div>

        <CalendarView 
          courts={courts}
          onSlotSelect={handleSlotSelect}
          selectedSlot={selectedSlot}
          optimisticBookings={optimisticBookings}
        />

        <BookingPanel 
          isOpen={isBookingPanelOpen}
          onClose={() => {
            setIsBookingPanelOpen(false);
            setSelectedSlot(null);
          }}
          slot={selectedSlot}
          court={getSelectedCourt()}
          onConfirm={handleBookingConfirm}
          isProcessing={bookingMutation.isPending}
        />

        <AuthModal 
          isOpen={isAuthModalOpen}
          onClose={() => setIsAuthModalOpen(false)}
          onAuthSuccess={(user) => setUser(user)}
        />
      </div>
    </div>
  );
}