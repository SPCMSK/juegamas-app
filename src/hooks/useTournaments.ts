import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import { useAuth } from '../contexts/AuthContext';
import type { Database } from '../lib/supabase';

type Tournament = Database['public']['Tables']['tournaments']['Row'];
type TournamentInsert = Database['public']['Tables']['tournaments']['Insert'];
type TournamentRegistration = Database['public']['Tables']['tournament_registrations']['Row'];

interface TournamentWithRegistrations extends Tournament {
  tournament_registrations: (TournamentRegistration & {
    teams: {
      id: string;
      name: string;
      captain_id: string;
    };
  })[];
}

export const useTournaments = () => {
  const [tournaments, setTournaments] = useState<TournamentWithRegistrations[]>([]);
  const [userTournaments, setUserTournaments] = useState<TournamentWithRegistrations[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { user } = useAuth();

  // Obtener todos los torneos
  const fetchTournaments = async () => {
    setLoading(true);
    setError(null);
    
    try {
      const { data, error } = await supabase
        .from('tournaments')
        .select(`
          *,
          tournament_registrations (
            *,
            teams (
              id,
              name,
              captain_id
            )
          )
        `)
        .order('start_date', { ascending: true });

      if (error) throw error;
      setTournaments(data as TournamentWithRegistrations[] || []);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al cargar torneos');
    } finally {
      setLoading(false);
    }
  };

  // Obtener torneos donde el usuario está registrado
  const fetchUserTournaments = async () => {
    if (!user) return;
    
    try {
      // Primero obtenemos los equipos del usuario
      const { data: userTeams, error: teamsError } = await supabase
        .from('team_members')
        .select('team_id')
        .eq('user_id', user.id);

      if (teamsError) throw teamsError;
      
      const teamIds = userTeams?.map(tm => tm.team_id) || [];
      
      if (teamIds.length === 0) {
        setUserTournaments([]);
        return;
      }

      // Luego obtenemos los torneos donde estos equipos están registrados
      const { data, error } = await supabase
        .from('tournament_registrations')
        .select(`
          tournaments (
            *,
            tournament_registrations (
              *,
              teams (
                id,
                name,
                captain_id
              )
            )
          )
        `)
        .in('team_id', teamIds);

      if (error) throw error;
      
      const userTournamentsData = data?.map(item => item.tournaments).filter(Boolean) || [];
      setUserTournaments(userTournamentsData as unknown as TournamentWithRegistrations[]);
    } catch (err) {
      console.error('Error fetching user tournaments:', err);
    }
  };

  // Crear nuevo torneo (solo para organizadores)
  const createTournament = async (tournamentData: Omit<TournamentInsert, 'organizer_id'>) => {
    if (!user) throw new Error('Usuario no autenticado');
    
    setLoading(true);
    setError(null);
    
    try {
      const { data, error } = await supabase
        .from('tournaments')
        .insert({
          ...tournamentData,
          organizer_id: user.id
        })
        .select()
        .single();

      if (error) throw error;
      
      await fetchTournaments();
      return data;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Error al crear torneo';
      setError(errorMessage);
      throw new Error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  // Registrar equipo en torneo
  const registerTeamForTournament = async (tournamentId: string, teamId: string) => {
    if (!user) throw new Error('Usuario no autenticado');
    
    setLoading(true);
    setError(null);
    
    try {
      const { error } = await supabase
        .from('tournament_registrations')
        .insert({
          tournament_id: tournamentId,
          team_id: teamId,
          payment_status: 'pending'
        });

      if (error) throw error;
      
      await fetchTournaments();
      await fetchUserTournaments();
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Error al registrar equipo';
      setError(errorMessage);
      throw new Error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  // Retirar equipo de torneo
  const withdrawTeamFromTournament = async (tournamentId: string, teamId: string) => {
    if (!user) throw new Error('Usuario no autenticado');
    
    setLoading(true);
    setError(null);
    
    try {
      const { error } = await supabase
        .from('tournament_registrations')
        .update({ status: 'withdrawn' })
        .eq('tournament_id', tournamentId)
        .eq('team_id', teamId);

      if (error) throw error;
      
      await fetchTournaments();
      await fetchUserTournaments();
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Error al retirar equipo';
      setError(errorMessage);
      throw new Error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  // Obtener torneos por estado
  const getTournamentsByStatus = (status: Tournament['status']) => {
    return tournaments.filter(tournament => tournament.status === status);
  };

  // Obtener torneos próximos
  const getUpcomingTournaments = () => {
    const today = new Date().toISOString().split('T')[0];
    return tournaments.filter(tournament => 
      tournament.start_date >= today && 
      tournament.status !== 'cancelled'
    );
  };

  // Verificar si un equipo está registrado en un torneo
  const isTeamRegistered = (tournamentId: string, teamId: string): boolean => {
    const tournament = tournaments.find(t => t.id === tournamentId);
    return tournament?.tournament_registrations.some(
      reg => reg.team_id === teamId && reg.status === 'registered'
    ) || false;
  };

  // Obtener espacios disponibles en un torneo
  const getAvailableSpots = (tournamentId: string): number => {
    const tournament = tournaments.find(t => t.id === tournamentId);
    if (!tournament) return 0;
    
    const registeredTeams = tournament.tournament_registrations.filter(
      reg => reg.status === 'registered'
    ).length;
    
    return Math.max(tournament.max_teams - registeredTeams, 0);
  };

  useEffect(() => {
    fetchTournaments();
  }, []);

  useEffect(() => {
    if (user) {
      fetchUserTournaments();
    }
  }, [user]);

  return {
    tournaments,
    userTournaments,
    loading,
    error,
    createTournament,
    registerTeamForTournament,
    withdrawTeamFromTournament,
    getTournamentsByStatus,
    getUpcomingTournaments,
    isTeamRegistered,
    getAvailableSpots,
    refetch: fetchTournaments
  };
};
