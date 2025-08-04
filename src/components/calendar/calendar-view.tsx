import { useState, useEffect } from "react";
import { addDays, format, startOfWeek, endOfWeek, eachDayOfInterval, isSameDay, isPast } from "date-fns";
import { es } from "date-fns/locale";
import { ChevronLeft, ChevronRight, Calendar as CalendarIcon, MapPin } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { cn } from "@/lib/utils";
import { useCourts } from "@/hooks/useCourts";
import { useBookings } from "@/hooks/useBookings";
import { useAuth } from "@/contexts/AuthContext";
import type { Database } from "@/lib/supabase";

type Court = Database['public']['Tables']['courts']['Row'];

interface TimeSlot {
  id: string;
  time: string;
  courtId: string;
  date: string;
  price: number;
  available: boolean;
  processing?: boolean;
}

interface CalendarViewProps {
  onSlotSelect: (slot: TimeSlot) => void;
  selectedSlot: TimeSlot | null;
}

export function CalendarView({ onSlotSelect, selectedSlot }: CalendarViewProps) {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedCourt, setSelectedCourt] = useState<string>("all");
  const [viewMode, setViewMode] = useState<"week" | "day">("week");
  const [dateBookings, setDateBookings] = useState<any[]>([]);
  
  const { user } = useAuth();
  const { courts, loading: courtsLoading, calculatePrice } = useCourts();
  const { getBookingsByDate } = useBookings();
  
  // Generate time slots from 7 PM to 11 PM (19:00 - 23:00) with 1-hour intervals
  const timeSlots = Array.from({ length: 5 }, (_, i) => {
    const hour = 19 + i;
    return `${hour.toString().padStart(2, '0')}:00`;
  });

  // Load bookings when date changes
  useEffect(() => {
    const loadBookings = async () => {
      const dateStr = format(currentDate, 'yyyy-MM-dd');
      const bookings = await getBookingsByDate(dateStr);
      setDateBookings(bookings);
    };
    
    loadBookings();
  }, [currentDate, getBookingsByDate]);

  // Check if a slot is booked
  const isSlotBooked = (courtId: string, date: Date, time: string): boolean => {
    const dateStr = format(date, 'yyyy-MM-dd');
    return dateBookings.some(booking => 
      booking.court_id === courtId && 
      booking.booking_date === dateStr && 
      booking.start_time === time
    );
  };

  const weekStart = startOfWeek(currentDate, { weekStartsOn: 1 });
  const weekEnd = endOfWeek(currentDate, { weekStartsOn: 1 });
  const daysToShow = viewMode === "week"
    ? eachDayOfInterval({ start: weekStart, end: weekEnd })
    : [currentDate];

  // Generate slots for the view
  const slots: TimeSlot[] = [];
  if (courts.length > 0) {
    courts.forEach(court => {
      if (selectedCourt !== "all" && court.id !== selectedCourt) return;
      
      daysToShow.forEach(date => {
        timeSlots.forEach(time => {
          const slotId = `${court.id}-${format(date, 'yyyy-MM-dd')}-${time}`;
          const isBooked = isSlotBooked(court.id, date, time);
          const isPastSlot = isPast(new Date(`${format(date, 'yyyy-MM-dd')}T${time}`));
          
          const slotPrice = calculatePrice(court, format(date, 'yyyy-MM-dd'), time);
          
          slots.push({
            id: slotId,
            time,
            courtId: court.id,
            date: format(date, 'yyyy-MM-dd'),
            price: slotPrice,
            available: !isBooked && !isPastSlot,
            processing: false
          });
        });
      });
    });
  }

  const navigateWeek = (direction: "prev" | "next") => {
    const days = viewMode === "week" ? 7 : 1;
    setCurrentDate(prev => addDays(prev, direction === "next" ? days : -days));
  };

  const goToToday = () => {
    setCurrentDate(new Date());
  };

  const filteredCourts = courts.filter(court => 
    selectedCourt === "all" || court.id === selectedCourt
  );

  if (courtsLoading) {
    return (
      <Card>
        <CardContent className="p-6">
          <div className="flex items-center justify-center h-40">
            <div className="text-muted-foreground">Cargando canchas...</div>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header Controls */}
      <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="icon"
            onClick={() => navigateWeek("prev")}
          >
            <ChevronLeft className="h-4 w-4" />
          </Button>
          
          <div className="flex items-center gap-2">
            <CalendarIcon className="h-4 w-4" />
            <span className="font-medium">
              {viewMode === "week" 
                ? `${format(weekStart, 'dd MMM', { locale: es })} - ${format(weekEnd, 'dd MMM yyyy', { locale: es })}`
                : format(currentDate, 'dd MMMM yyyy', { locale: es })
              }
            </span>
          </div>
          
          <Button
            variant="outline"
            size="icon"
            onClick={() => navigateWeek("next")}
          >
            <ChevronRight className="h-4 w-4" />
          </Button>
          
          <Button variant="outline" onClick={goToToday}>
            Hoy
          </Button>
        </div>

        <div className="flex gap-2">
          <Select value={selectedCourt} onValueChange={setSelectedCourt}>
            <SelectTrigger className="w-48">
              <SelectValue placeholder="Seleccionar cancha" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Todas las canchas</SelectItem>
              {courts.map((court) => (
                <SelectItem key={court.id} value={court.id}>
                  {court.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Select value={viewMode} onValueChange={(value: "week" | "day") => setViewMode(value)}>
            <SelectTrigger className="w-32">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="week">Semana</SelectItem>
              <SelectItem value="day">Día</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Calendar Grid */}
      <div className="grid gap-4">
        {daysToShow.map((date) => (
          <Card key={date.toISOString()}>
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center gap-2 text-lg">
                <CalendarIcon className="h-5 w-5" />
                {format(date, 'EEEE dd MMMM', { locale: es })}
                {isSameDay(date, new Date()) && (
                  <Badge variant="secondary">Hoy</Badge>
                )}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {filteredCourts.map((court) => (
                  <div key={court.id} className="space-y-2">
                    <div className="flex items-center gap-2 font-medium">
                      <MapPin className="h-4 w-4" />
                      <span>{court.name}</span>
                      <Badge variant="outline">{court.type}</Badge>
                    </div>
                    
                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-2">
                      {timeSlots.map((time) => {
                        const slot = slots.find(s => 
                          s.courtId === court.id && 
                          s.date === format(date, 'yyyy-MM-dd') && 
                          s.time === time
                        );
                        
                        if (!slot) return null;
                        
                        const isSelected = selectedSlot?.id === slot.id;
                        
                        return (
                          <Button
                            key={`${court.id}-${time}`}
                            variant={isSelected ? "default" : slot.available ? "outline" : "secondary"}
                            className={cn(
                              "h-16 flex flex-col items-center justify-center text-xs",
                              {
                                "opacity-50 cursor-not-allowed": !slot.available,
                                "ring-2 ring-primary": isSelected,
                              }
                            )}
                            onClick={() => slot.available && onSlotSelect(slot)}
                            disabled={!slot.available || !user}
                          >
                            <span className="font-medium">{time}</span>
                            <span className="text-xs opacity-75">
                              ${slot.price.toLocaleString()}
                            </span>
                            {!slot.available && !isPast(new Date(`${slot.date}T${time}`)) && (
                              <Badge variant="destructive" className="text-xs">
                                Ocupado
                              </Badge>
                            )}
                          </Button>
                        );
                      })}
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {!user && (
        <Card className="border-amber-200 bg-amber-50">
          <CardContent className="p-4">
            <div className="text-center text-amber-800">
              <p className="font-medium">Inicia sesión para reservar</p>
              <p className="text-sm text-amber-700">
                Necesitas una cuenta para hacer reservas de canchas
              </p>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
