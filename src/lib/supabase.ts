import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'https://dadwdliojygiminsoyaw.supabase.co'
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImRhZHdkbGlvanlnaW1pbnNveWF3Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTQwNzEyNjYsImV4cCI6MjA2OTY0NzI2Nn0.jQ3btJEVh7ndzsos_wd8LJft9l2yB7eQ4QH0EvePPeU'

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables')
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

// Database types
export interface Database {
  public: {
    Tables: {
      users: {
        Row: {
          id: string
          email: string
          name: string
          phone: string | null
          membership_type: 'standard' | 'vip' | 'premium'
          points: number
          total_bookings: number
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          email: string
          name: string
          phone?: string | null
          membership_type?: 'standard' | 'vip' | 'premium'
          points?: number
          total_bookings?: number
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          email?: string
          name?: string
          phone?: string | null
          membership_type?: 'standard' | 'vip' | 'premium'
          points?: number
          total_bookings?: number
          created_at?: string
          updated_at?: string
        }
      }
      courts: {
        Row: {
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
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          name: string
          type: string
          surface: string
          capacity: number
          price_day: number
          price_night: number
          price_weekend: number
          features?: string[]
          equipment_included?: string[]
          active?: boolean
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          name?: string
          type?: string
          surface?: string
          capacity?: number
          price_day?: number
          price_night?: number
          price_weekend?: number
          features?: string[]
          equipment_included?: string[]
          active?: boolean
          created_at?: string
          updated_at?: string
        }
      }
      bookings: {
        Row: {
          id: string
          user_id: string
          court_id: string
          booking_date: string
          start_time: string
          end_time: string
          status: 'pending' | 'confirmed' | 'cancelled' | 'completed'
          total_price: number
          discount_applied: number
          discount_code: string | null
          payment_method: string | null
          payment_status: 'pending' | 'paid' | 'refunded'
          notes: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          court_id: string
          booking_date: string
          start_time: string
          end_time: string
          status?: 'pending' | 'confirmed' | 'cancelled' | 'completed'
          total_price: number
          discount_applied?: number
          discount_code?: string | null
          payment_method?: string | null
          payment_status?: 'pending' | 'paid' | 'refunded'
          notes?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          court_id?: string
          booking_date?: string
          start_time?: string
          end_time?: string
          status?: 'pending' | 'confirmed' | 'cancelled' | 'completed'
          total_price?: number
          discount_applied?: number
          discount_code?: string | null
          payment_method?: string | null
          payment_status?: 'pending' | 'paid' | 'refunded'
          notes?: string | null
          created_at?: string
          updated_at?: string
        }
      }
      teams: {
        Row: {
          id: string
          name: string
          captain_id: string
          description: string | null
          logo_url: string | null
          members_count: number
          ranking_points: number
          wins: number
          losses: number
          draws: number
          goals_for: number
          goals_against: number
          active: boolean
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          name: string
          captain_id: string
          description?: string | null
          logo_url?: string | null
          members_count?: number
          ranking_points?: number
          wins?: number
          losses?: number
          draws?: number
          goals_for?: number
          goals_against?: number
          active?: boolean
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          name?: string
          captain_id?: string
          description?: string | null
          logo_url?: string | null
          members_count?: number
          ranking_points?: number
          wins?: number
          losses?: number
          draws?: number
          goals_for?: number
          goals_against?: number
          active?: boolean
          created_at?: string
          updated_at?: string
        }
      }
      team_members: {
        Row: {
          id: string
          team_id: string
          user_id: string
          role: 'captain' | 'member'
          position: string | null
          joined_at: string
        }
        Insert: {
          id?: string
          team_id: string
          user_id: string
          role?: 'captain' | 'member'
          position?: string | null
          joined_at?: string
        }
        Update: {
          id?: string
          team_id?: string
          user_id?: string
          role?: 'captain' | 'member'
          position?: string | null
          joined_at?: string
        }
      }
      tournaments: {
        Row: {
          id: string
          name: string
          description: string
          category: string
          max_teams: number
          registration_fee: number
          prize_pool: string
          start_date: string
          end_date: string
          registration_deadline: string
          status: 'upcoming' | 'registration_open' | 'in_progress' | 'completed' | 'cancelled'
          rules: string[]
          organizer_id: string
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          name: string
          description: string
          category: string
          max_teams: number
          registration_fee: number
          prize_pool: string
          start_date: string
          end_date: string
          registration_deadline: string
          status?: 'upcoming' | 'registration_open' | 'in_progress' | 'completed' | 'cancelled'
          rules?: string[]
          organizer_id: string
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          name?: string
          description?: string
          category?: string
          max_teams?: number
          registration_fee?: number
          prize_pool?: string
          start_date?: string
          end_date?: string
          registration_deadline?: string
          status?: 'upcoming' | 'registration_open' | 'in_progress' | 'completed' | 'cancelled'
          rules?: string[]
          organizer_id?: string
          created_at?: string
          updated_at?: string
        }
      }
      tournament_registrations: {
        Row: {
          id: string
          tournament_id: string
          team_id: string
          registration_date: string
          payment_status: 'pending' | 'paid' | 'refunded'
          status: 'registered' | 'withdrawn'
        }
        Insert: {
          id?: string
          tournament_id: string
          team_id: string
          registration_date?: string
          payment_status?: 'pending' | 'paid' | 'refunded'
          status?: 'registered' | 'withdrawn'
        }
        Update: {
          id?: string
          tournament_id?: string
          team_id?: string
          registration_date?: string
          payment_status?: 'pending' | 'paid' | 'refunded'
          status?: 'registered' | 'withdrawn'
        }
      }
      community_posts: {
        Row: {
          id: string
          author_id: string
          type: 'seeking_team' | 'seeking_players'
          title: string
          description: string
          game_date: string
          game_time: string
          location: string
          players_needed: number | null
          position_seeking: string | null
          contact_info: string
          status: 'active' | 'closed' | 'expired'
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          author_id: string
          type: 'seeking_team' | 'seeking_players'
          title: string
          description: string
          game_date: string
          game_time: string
          location: string
          players_needed?: number | null
          position_seeking?: string | null
          contact_info: string
          status?: 'active' | 'closed' | 'expired'
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          author_id?: string
          type?: 'seeking_team' | 'seeking_players'
          title?: string
          description?: string
          game_date?: string
          game_time?: string
          location?: string
          players_needed?: number | null
          position_seeking?: string | null
          contact_info?: string
          status?: 'active' | 'closed' | 'expired'
          created_at?: string
          updated_at?: string
        }
      }
      discount_codes: {
        Row: {
          id: string
          code: string
          description: string
          discount_type: 'percentage' | 'fixed_amount'
          discount_value: number
          min_amount: number | null
          max_uses: number | null
          used_count: number
          valid_from: string
          valid_until: string | null
          day_restrictions: string[] | null
          time_restrictions: string | null
          active: boolean
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          code: string
          description: string
          discount_type: 'percentage' | 'fixed_amount'
          discount_value: number
          min_amount?: number | null
          max_uses?: number | null
          used_count?: number
          valid_from: string
          valid_until?: string | null
          day_restrictions?: string[] | null
          time_restrictions?: string | null
          active?: boolean
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          code?: string
          description?: string
          discount_type?: 'percentage' | 'fixed_amount'
          discount_value?: number
          min_amount?: number | null
          max_uses?: number | null
          used_count?: number
          valid_from?: string
          valid_until?: string | null
          day_restrictions?: string[] | null
          time_restrictions?: string | null
          active?: boolean
          created_at?: string
          updated_at?: string
        }
      }
      user_points: {
        Row: {
          id: string
          user_id: string
          points: number
          description: string
          type: 'earned' | 'redeemed'
          related_booking_id: string | null
          created_at: string
        }
        Insert: {
          id?: string
          user_id: string
          points: number
          description: string
          type: 'earned' | 'redeemed'
          related_booking_id?: string | null
          created_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          points?: number
          description?: string
          type?: 'earned' | 'redeemed'
          related_booking_id?: string | null
          created_at?: string
        }
      }
      referrals: {
        Row: {
          id: string
          referrer_id: string
          referred_id: string
          status: 'pending' | 'completed'
          reward_points: number
          created_at: string
          completed_at: string | null
        }
        Insert: {
          id?: string
          referrer_id: string
          referred_id: string
          status?: 'pending' | 'completed'
          reward_points?: number
          created_at?: string
          completed_at?: string | null
        }
        Update: {
          id?: string
          referrer_id?: string
          referred_id?: string
          status?: 'pending' | 'completed'
          reward_points?: number
          created_at?: string
          completed_at?: string | null
        }
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      [_ in never]: never
    }
  }
}
