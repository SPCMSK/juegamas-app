import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import type { Database } from '../lib/supabase';

type DiscountCode = Database['public']['Tables']['discount_codes']['Row'];

interface DiscountValidation {
  valid: boolean;
  discount: number;
  message: string;
  code?: DiscountCode;
}

export const useDiscountCodes = () => {
  const [discountCodes, setDiscountCodes] = useState<DiscountCode[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Obtener códigos de descuento activos
  const fetchDiscountCodes = async () => {
    setLoading(true);
    setError(null);
    
    try {
      const { data, error } = await supabase
        .from('discount_codes')
        .select('*')
        .eq('active', true)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setDiscountCodes(data || []);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al cargar códigos de descuento');
    } finally {
      setLoading(false);
    }
  };

  // Validar código de descuento
  const validateDiscountCode = async (
    code: string, 
    bookingAmount: number,
    bookingDate: string,
    bookingTime: string
  ): Promise<DiscountValidation> => {
    try {
      const { data: discountCode, error } = await supabase
        .from('discount_codes')
        .select('*')
        .eq('code', code.toUpperCase())
        .eq('active', true)
        .single();

      if (error || !discountCode) {
        return {
          valid: false,
          discount: 0,
          message: 'Código de descuento no válido'
        };
      }

      // Verificar fechas de validez
      const today = new Date().toISOString().split('T')[0];
      
      if (discountCode.valid_from > today) {
        return {
          valid: false,
          discount: 0,
          message: 'Este código aún no está disponible'
        };
      }

      if (discountCode.valid_until && discountCode.valid_until < today) {
        return {
          valid: false,
          discount: 0,
          message: 'Este código ha expirado'
        };
      }

      // Verificar límite de usos
      if (discountCode.max_uses && discountCode.used_count >= discountCode.max_uses) {
        return {
          valid: false,
          discount: 0,
          message: 'Este código ha alcanzado su límite de usos'
        };
      }

      // Verificar monto mínimo
      if (discountCode.min_amount && bookingAmount < discountCode.min_amount) {
        return {
          valid: false,
          discount: 0,
          message: `El monto mínimo para este código es $${discountCode.min_amount.toLocaleString()}`
        };
      }

      // Verificar restricciones de día
      if (discountCode.day_restrictions && discountCode.day_restrictions.length > 0) {
        const dayNames = ['sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday'];
        const dayName = dayNames[new Date(bookingDate).getDay()];
        
        if (!discountCode.day_restrictions.includes(dayName)) {
          const allowedDays = discountCode.day_restrictions.map(day => {
            const dayMap: { [key: string]: string } = {
              'monday': 'Lunes',
              'tuesday': 'Martes',
              'wednesday': 'Miércoles',
              'thursday': 'Jueves',
              'friday': 'Viernes',
              'saturday': 'Sábado',
              'sunday': 'Domingo'
            };
            return dayMap[day] || day;
          }).join(', ');
          
          return {
            valid: false,
            discount: 0,
            message: `Este código solo es válido para: ${allowedDays}`
          };
        }
      }

      // Verificar restricciones de horario
      if (discountCode.time_restrictions) {
        const restrictions = discountCode.time_restrictions as unknown as { start: string; end: string };
        const bookingTimeMinutes = timeToMinutes(bookingTime);
        const startMinutes = timeToMinutes(restrictions.start);
        const endMinutes = timeToMinutes(restrictions.end);
        
        if (bookingTimeMinutes < startMinutes || bookingTimeMinutes > endMinutes) {
          return {
            valid: false,
            discount: 0,
            message: `Este código solo es válido entre ${restrictions.start} y ${restrictions.end}`
          };
        }
      }

      // Calcular descuento
      let discountAmount = 0;
      if (discountCode.discount_type === 'percentage') {
        discountAmount = Math.round((bookingAmount * discountCode.discount_value) / 100);
      } else {
        discountAmount = discountCode.discount_value;
      }

      // Asegurar que el descuento no sea mayor al monto total
      discountAmount = Math.min(discountAmount, bookingAmount);

      return {
        valid: true,
        discount: discountAmount,
        message: `Descuento aplicado: $${discountAmount.toLocaleString()}`,
        code: discountCode
      };

    } catch (err) {
      return {
        valid: false,
        discount: 0,
        message: 'Error al validar el código'
      };
    }
  };

  // Aplicar código de descuento (incrementar contador de uso)
  const applyDiscountCode = async (codeId: string) => {
    try {
      // Primero obtener el contador actual
      const { data: currentCode } = await supabase
        .from('discount_codes')
        .select('used_count')
        .eq('id', codeId)
        .single();

      const { error } = await supabase
        .from('discount_codes')
        .update({ 
          used_count: (currentCode?.used_count || 0) + 1
        })
        .eq('id', codeId);

      if (error) throw error;
    } catch (err) {
      console.error('Error applying discount code:', err);
    }
  };

  // Obtener códigos disponibles para una fecha y horario específicos
  const getAvailableCodesForBooking = (bookingDate: string, bookingTime: string) => {
    const today = new Date().toISOString().split('T')[0];
    const bookingDay = new Date(bookingDate);
    const dayNames = ['sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday'];
    const dayName = dayNames[bookingDay.getDay()];
    
    return discountCodes.filter(code => {
      // Verificar si está activo
      if (!code.active) return false;
      
      // Verificar fechas
      if (code.valid_from > today) return false;
      if (code.valid_until && code.valid_until < today) return false;
      
      // Verificar límite de usos
      if (code.max_uses && code.used_count >= code.max_uses) return false;
      
      // Verificar restricciones de día
      if (code.day_restrictions && code.day_restrictions.length > 0) {
        if (!code.day_restrictions.includes(dayName)) return false;
      }
      
      // Verificar restricciones de horario
      if (code.time_restrictions) {
        const restrictions = code.time_restrictions as unknown as { start: string; end: string };
        const bookingTimeMinutes = timeToMinutes(bookingTime);
        const startMinutes = timeToMinutes(restrictions.start);
        const endMinutes = timeToMinutes(restrictions.end);
        
        if (bookingTimeMinutes < startMinutes || bookingTimeMinutes > endMinutes) return false;
      }
      
      return true;
    });
  };

  // Función auxiliar para convertir tiempo a minutos
  const timeToMinutes = (time: string): number => {
    const [hours, minutes] = time.split(':').map(Number);
    return hours * 60 + minutes;
  };

  useEffect(() => {
    fetchDiscountCodes();
  }, []);

  return {
    discountCodes,
    loading,
    error,
    validateDiscountCode,
    applyDiscountCode,
    getAvailableCodesForBooking,
    refetch: fetchDiscountCodes
  };
};
