import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import { useAuth } from '../contexts/AuthContext';
import type { Database } from '../lib/supabase';

type Booking = Database['public']['Tables']['bookings']['Row'];
type BookingInsert = Database['public']['Tables']['bookings']['Insert'];
type Court = Database['public']['Tables']['courts']['Row'];

export const useBookings = () => {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { user } = useAuth();

  // Obtener reservas del usuario actual
  const fetchUserBookings = async () => {
    if (!user) return;
    
    setLoading(true);
    setError(null);
    
    try {
      const { data, error } = await supabase
        .from('bookings')
        .select(`
          *,
          courts (
            id,
            name,
            type,
            surface
          )
        `)
        .eq('user_id', user.id)
        .order('booking_date', { ascending: false });

      if (error) throw error;
      setBookings(data || []);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al cargar reservas');
    } finally {
      setLoading(false);
    }
  };

  // Crear nueva reserva
  const createBooking = async (bookingData: Omit<BookingInsert, 'user_id'>) => {
    if (!user) throw new Error('Usuario no autenticado');
    
    setLoading(true);
    setError(null);
    
    try {
      const { data, error } = await supabase
        .from('bookings')
        .insert({
          ...bookingData,
          user_id: user.id
        })
        .select()
        .single();

      if (error) throw error;
      
      // Actualizar la lista de reservas
      await fetchUserBookings();
      
      return data;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Error al crear reserva';
      setError(errorMessage);
      throw new Error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  // Cancelar reserva
  const cancelBooking = async (bookingId: string) => {
    setLoading(true);
    setError(null);
    
    try {
      const { error } = await supabase
        .from('bookings')
        .update({ status: 'cancelled' })
        .eq('id', bookingId)
        .eq('user_id', user?.id);

      if (error) throw error;
      
      await fetchUserBookings();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al cancelar reserva');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // Verificar disponibilidad de horario
  const checkAvailability = async (courtId: string, date: string, startTime: string) => {
    try {
      const { data, error } = await supabase
        .from('bookings')
        .select('id')
        .eq('court_id', courtId)
        .eq('booking_date', date)
        .eq('start_time', startTime)
        .in('status', ['pending', 'confirmed']);

      if (error) throw error;
      
      return data.length === 0; // true si está disponible
    } catch (err) {
      console.error('Error checking availability:', err);
      return false;
    }
  };

  // Obtener reservas de una fecha específica para todas las canchas
  const getBookingsByDate = async (date: string) => {
    try {
      const { data, error } = await supabase
        .from('bookings')
        .select(`
          *,
          courts (
            id,
            name,
            type
          ),
          users (
            id,
            name
          )
        `)
        .eq('booking_date', date)
        .in('status', ['pending', 'confirmed'])
        .order('start_time');

      if (error) throw error;
      return data || [];
    } catch (err) {
      console.error('Error fetching bookings by date:', err);
      return [];
    }
  };

  useEffect(() => {
    if (user) {
      fetchUserBookings();
    }
  }, [user]);

  return {
    bookings,
    loading,
    error,
    createBooking,
    cancelBooking,
    checkAvailability,
    getBookingsByDate,
    refetch: fetchUserBookings
  };
};
