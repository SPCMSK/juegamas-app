import { useState, useEffect } from 'react'
import { supabase } from '@/lib/supabase'
import { useAuth } from '@/contexts/AuthContext'

export interface Booking {
  id: string
  user_id: string
  court_id: string
  booking_date: string
  start_time: string
  end_time: string
  status: 'pending' | 'confirmed' | 'cancelled' | 'completed'
  total_price: number
  discount_applied: number
  discount_code?: string
  payment_method?: string
  payment_status: 'pending' | 'paid' | 'refunded'
  notes?: string
  created_at: string
  updated_at: string
  court?: {
    name: string
    type: string
  }
}

export interface Court {
  id: string
  name: string
  type: string
  surface: string
  capacity: number
  price_day: number
  price_night: number
  price_weekend: number
  features: string[]
  equipment_included: string[]
  active: boolean
}

export function useBookings() {
  const [bookings, setBookings] = useState<Booking[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const { user } = useAuth()

  useEffect(() => {
    if (user) {
      fetchBookings()
    }
  }, [user])

  const fetchBookings = async () => {
    try {
      setLoading(true)
      const { data, error } = await supabase
        .from('bookings')
        .select(`
          *,
          court:courts(name, type)
        `)
        .eq('user_id', user?.id)
        .order('booking_date', { ascending: false })

      if (error) throw error
      setBookings(data || [])
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al cargar reservas')
    } finally {
      setLoading(false)
    }
  }

  const createBooking = async (bookingData: Omit<Booking, 'id' | 'created_at' | 'updated_at' | 'user_id'>) => {
    try {
      if (!user) throw new Error('Usuario no autenticado')

      const { data, error } = await supabase
        .from('bookings')
        .insert([{ ...bookingData, user_id: user.id }])
        .select()
        .single()

      if (error) throw error

      // Actualizar estado local
      await fetchBookings()
      return { data, error: null }
    } catch (err) {
      return { data: null, error: err instanceof Error ? err.message : 'Error al crear reserva' }
    }
  }

  const updateBooking = async (id: string, updates: Partial<Booking>) => {
    try {
      const { data, error } = await supabase
        .from('bookings')
        .update(updates)
        .eq('id', id)
        .eq('user_id', user?.id)
        .select()
        .single()

      if (error) throw error

      // Actualizar estado local
      await fetchBookings()
      return { data, error: null }
    } catch (err) {
      return { data: null, error: err instanceof Error ? err.message : 'Error al actualizar reserva' }
    }
  }

  const cancelBooking = async (id: string) => {
    return updateBooking(id, { status: 'cancelled' })
  }

  return {
    bookings,
    loading,
    error,
    createBooking,
    updateBooking,
    cancelBooking,
    refetch: fetchBookings
  }
}

export function useCourts() {
  const [courts, setCourts] = useState<Court[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    fetchCourts()
  }, [])

  const fetchCourts = async () => {
    try {
      setLoading(true)
      const { data, error } = await supabase
        .from('courts')
        .select('*')
        .eq('active', true)
        .order('name')

      if (error) throw error
      setCourts(data || [])
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al cargar canchas')
    } finally {
      setLoading(false)
    }
  }

  return { courts, loading, error, refetch: fetchCourts }
}

export function useAvailableSlots(courtId: string, date: string) {
  const [availableSlots, setAvailableSlots] = useState<string[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const fetchAvailableSlots = async () => {
    try {
      setLoading(true)
      
      // Obtener reservas existentes para la fecha y cancha
      const { data: bookings, error } = await supabase
        .from('bookings')
        .select('start_time')
        .eq('court_id', courtId)
        .eq('booking_date', date)
        .in('status', ['confirmed', 'pending'])

      if (error) throw error

      // Generar todos los slots posibles (19:00 - 23:00)
      const allSlots = ['19:00', '20:00', '21:00', '22:00', '23:00']
      const bookedSlots = bookings?.map(b => b.start_time) || []
      const available = allSlots.filter(slot => !bookedSlots.includes(slot))

      setAvailableSlots(available)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al cargar disponibilidad')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    if (courtId && date) {
      fetchAvailableSlots()
    }
  }, [courtId, date])

  return { availableSlots, loading, error, refetch: fetchAvailableSlots }
}
