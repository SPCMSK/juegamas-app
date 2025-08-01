import { useState, useEffect } from "react";
import { addDays, format, startOfWeek, endOfWeek, eachDayOfInterval, isSameDay, isPast, parseISO } from "date-fns";
import { es } from "date-fns/locale";
import { ChevronLeft, ChevronRight, Calendar as CalendarIcon, MapPin } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { cn } from "@/lib/utils";

interface Court {
  id: string;
  name: string;
  type: string;
  pricePerHour: number;
}

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
  courts: Court[];
  onSlotSelect: (slot: TimeSlot) => void;
  selectedSlot: TimeSlot | null;
  optimisticBookings: Set<string>;
}

export function CalendarView({ courts, onSlotSelect, selectedSlot, optimisticBookings }: CalendarViewProps) {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedCourt, setSelectedCourt] = useState<string>("all");
  const [viewMode, setViewMode] = useState<"week" | "day">("week");
  
  // Generate time slots from 8 AM to 11 PM
  const timeSlots = Array.from({ length: 15 }, (_, i) => {
    const hour = 8 + i;
    return `${hour.toString().padStart(2, '0')}:00`;
  });

  // Get current week or day dates
  const weekStart = startOfWeek(currentDate, { weekStartsOn: 1 });
  const weekEnd = endOfWeek(currentDate, { weekStartsOn: 1 });
  const daysToShow = viewMode === "week" 
    ? eachDayOfInterval({ start: weekStart, end: weekEnd })
    : [currentDate];

  // Mock data generator - replace with real API call
  const generateTimeSlots = (): TimeSlot[] => {
    const slots: TimeSlot[] = [];
    
    courts.forEach(court => {
      if (selectedCourt !== "all" && court.id !== selectedCourt) return;
      
      daysToShow.forEach(date => {
        timeSlots.forEach(time => {
          const slotId = `${court.id}-${format(date, 'yyyy-MM-dd')}-${time}`;
          const isBooked = Math.random() > 0.7; // 30% chance of being booked
          const isPastSlot = isPast(parseISO(`${format(date, 'yyyy-MM-dd')}T${time}:00`));
          const isOptimistic = optimisticBookings.has(slotId);
          
          slots.push({
            id: slotId,
            time,
            courtId: court.id,
            date: format(date, 'yyyy-MM-dd'),
            price: court.pricePerHour,
            available: !isBooked && !isPastSlot && !isOptimistic,
            processing: isOptimistic
          });
        });
      });
    });
    
    return slots;
  };

  const slots = generateTimeSlots();

  const handlePrevious = () => {
    setCurrentDate(prev => addDays(prev, viewMode === "week" ? -7 : -1));
  };

  const handleNext = () => {
    setCurrentDate(prev => addDays(prev, viewMode === "week" ? 7 : 1));
  };

  const getSlotStatus = (slot: TimeSlot) => {
    if (slot.processing) return "processing";
    if (!slot.available) return "unavailable";
    if (selectedSlot?.id === slot.id) return "selected";
    return "available";
  };

  const getSlotStyles = (status: string) => {
    const base = "h-12 rounded-lg border-2 transition-all duration-200 cursor-pointer flex items-center justify-center text-xs font-medium";
    
    switch (status) {
      case "available":
        return cn(base, "border-primary/20 bg-gradient-to-r from-success/10 to-success/5 hover:border-primary/40 hover:from-success/20 hover:to-success/10 text-success-foreground hover:scale-[1.02]");
      case "selected":
        return cn(base, "border-primary bg-primary text-primary-foreground shadow-sport scale-[1.02]");
      case "processing":
        return cn(base, "border-warning/40 bg-warning/10 text-warning-foreground animate-pulse");
      case "unavailable":
        return cn(base, "border-muted bg-muted/30 text-muted-foreground cursor-not-allowed opacity-60");
      default:
        return base;
    }
  };

  return (
    <div className="space-y-6">
      {/* Controls */}
      <Card className="shadow-card">
        <CardHeader className="pb-4">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              <Button
                variant="outline"
                size="sm"
                onClick={handlePrevious}
                className="flex items-center gap-2"
              >
                <ChevronLeft className="h-4 w-4" />
                {viewMode === "week" ? "Sem. Anterior" : "Día Anterior"}
              </Button>
              
              <div className="text-center">
                <h2 className="text-lg font-semibold">
                  {viewMode === "week" 
                    ? `${format(weekStart, 'd MMM', { locale: es })} - ${format(weekEnd, 'd MMM yyyy', { locale: es })}`
                    : format(currentDate, 'EEEE, d MMMM yyyy', { locale: es })
                  }
                </h2>
              </div>
              
              <Button
                variant="outline"
                size="sm"
                onClick={handleNext}
                className="flex items-center gap-2"
              >
                {viewMode === "week" ? "Sem. Siguiente" : "Día Siguiente"}
                <ChevronRight className="h-4 w-4" />
              </Button>
            </div>
            
            <div className="flex items-center gap-2">
              <Select value={viewMode} onValueChange={(value: "week" | "day") => setViewMode(value)}>
                <SelectTrigger className="w-24">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="week">Semana</SelectItem>
                  <SelectItem value="day">Día</SelectItem>
                </SelectContent>
              </Select>
              
              <Select value={selectedCourt} onValueChange={setSelectedCourt}>
                <SelectTrigger className="w-48">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todas las canchas</SelectItem>
                  {courts.map(court => (
                    <SelectItem key={court.id} value={court.id}>
                      {court.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardHeader>
      </Card>

      {/* Calendar Grid */}
      <div className="space-y-6">
        {courts
          .filter(court => selectedCourt === "all" || court.id === selectedCourt)
          .map(court => (
            <Card key={court.id} className="shadow-card">
              <CardHeader className="pb-4">
                <CardTitle className="flex items-center gap-2">
                  <MapPin className="h-5 w-5 text-primary" />
                  {court.name}
                  <Badge variant="secondary">{court.type}</Badge>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="overflow-x-auto">
                  <div className="min-w-[800px]">
                    {/* Header with days */}
                    <div className="grid grid-cols-[100px_1fr] gap-2 mb-4">
                      <div className="h-10 flex items-center justify-center text-sm font-medium text-muted-foreground">
                        Hora
                      </div>
                      <div className={`grid gap-2 ${viewMode === "week" ? "grid-cols-7" : "grid-cols-1"}`}>
                        {daysToShow.map(date => (
                          <div key={date.toISOString()} className="h-10 flex flex-col items-center justify-center text-sm font-medium bg-gradient-card rounded-lg">
                            <span className="text-xs text-muted-foreground">
                              {format(date, 'EEE', { locale: es })}
                            </span>
                            <span className={cn(
                              "font-semibold",
                              isSameDay(date, new Date()) && "text-primary"
                            )}>
                              {format(date, 'd')}
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Time slots grid */}
                    <div className="space-y-2">
                      {timeSlots.map(time => (
                        <div key={time} className="grid grid-cols-[100px_1fr] gap-2">
                          <div className="h-12 flex items-center justify-center text-sm font-medium text-muted-foreground bg-muted/30 rounded-lg">
                            {time}
                          </div>
                          <div className={`grid gap-2 ${viewMode === "week" ? "grid-cols-7" : "grid-cols-1"}`}>
                            {daysToShow.map(date => {
                              const slot = slots.find(s => 
                                s.courtId === court.id && 
                                s.date === format(date, 'yyyy-MM-dd') && 
                                s.time === time
                              );
                              
                              if (!slot) return <div key={date.toISOString()} className="h-12" />;
                              
                              const status = getSlotStatus(slot);
                              
                              return (
                                <div
                                  key={slot.id}
                                  className={getSlotStyles(status)}
                                  onClick={() => {
                                    if (status === "available") {
                                      onSlotSelect(slot);
                                    }
                                  }}
                                >
                                  {status === "processing" ? (
                                    <div className="animate-spin w-4 h-4 border-2 border-warning border-t-transparent rounded-full" />
                                  ) : status === "available" ? (
                                    <span>${slot.price.toLocaleString()}</span>
                                  ) : status === "selected" ? (
                                    <span>Seleccionado</span>
                                  ) : (
                                    <span>Ocupado</span>
                                  )}
                                </div>
                              );
                            })}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
      </div>

      {/* Legend */}
      <Card className="bg-gradient-card">
        <CardContent className="pt-6">
          <div className="flex flex-wrap items-center gap-4 text-sm">
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 rounded bg-gradient-to-r from-success/20 to-success/10 border border-primary/20" />
              <span>Disponible</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 rounded bg-primary border-2 border-primary" />
              <span>Seleccionado</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 rounded bg-warning/10 border border-warning/40" />
              <span>Procesando</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 rounded bg-muted/30 border border-muted" />
              <span>No disponible</span>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}