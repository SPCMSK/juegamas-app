import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import type { Database } from '../lib/supabase';

type Court = Database['public']['Tables']['courts']['Row'];

export const useCourts = () => {
  const [courts, setCourts] = useState<Court[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Obtener todas las canchas activas
  const fetchCourts = async () => {
    setLoading(true);
    setError(null);
    
    try {
      const { data, error } = await supabase
        .from('courts')
        .select('*')
        .eq('active', true)
        .order('name');

      if (error) throw error;
      setCourts(data || []);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al cargar canchas');
    } finally {
      setLoading(false);
    }
  };

  // Obtener una cancha específica por ID
  const getCourtById = async (courtId: string): Promise<Court | null> => {
    try {
      const { data, error } = await supabase
        .from('courts')
        .select('*')
        .eq('id', courtId)
        .single();

      if (error) throw error;
      return data;
    } catch (err) {
      console.error('Error fetching court:', err);
      return null;
    }
  };

  // Calcular precio según el día y horario
  const calculatePrice = (court: Court, date: string, time: string): number => {
    const bookingDate = new Date(date);
    const dayOfWeek = bookingDate.getDay(); // 0 = domingo, 6 = sábado
    const hour = parseInt(time.split(':')[0]);
    
    // Fin de semana (sábado y domingo)
    if (dayOfWeek === 0 || dayOfWeek === 6) {
      return court.price_weekend;
    }
    
    // Horario nocturno (después de las 18:00)
    if (hour >= 18) {
      return court.price_night;
    }
    
    // Horario diurno en días de semana
    return court.price_day;
  };

  // Obtener disponibilidad de canchas para una fecha
  const getCourtsAvailability = async (date: string) => {
    try {
      const { data, error } = await supabase
        .from('court_availability')
        .select('*');

      if (error) throw error;
      return data || [];
    } catch (err) {
      console.error('Error fetching courts availability:', err);
      return [];
    }
  };

  // Obtener horarios disponibles para una cancha en una fecha específica
  const getAvailableSlots = async (courtId: string, date: string): Promise<string[]> => {
    const allSlots = [
      '19:00', '20:00', '21:00', '22:00', '23:00'
    ];

    try {
      const { data, error } = await supabase
        .from('bookings')
        .select('start_time')
        .eq('court_id', courtId)
        .eq('booking_date', date)
        .in('status', ['pending', 'confirmed']);

      if (error) throw error;

      const bookedSlots = data?.map(booking => booking.start_time) || [];
      return allSlots.filter(slot => !bookedSlots.includes(slot));
    } catch (err) {
      console.error('Error fetching available slots:', err);
      return allSlots;
    }
  };

  useEffect(() => {
    fetchCourts();
  }, []);

  return {
    courts,
    loading,
    error,
    getCourtById,
    calculatePrice,
    getCourtsAvailability,
    getAvailableSlots,
    refetch: fetchCourts
  };
};
