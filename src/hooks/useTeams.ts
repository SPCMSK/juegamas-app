import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import { useAuth } from '../contexts/AuthContext';
import type { Database } from '../lib/supabase';

type Team = Database['public']['Tables']['teams']['Row'];
type TeamInsert = Database['public']['Tables']['teams']['Insert'];
type TeamMember = Database['public']['Tables']['team_members']['Row'];

interface TeamWithMembers extends Team {
  team_members: (TeamMember & {
    users: {
      id: string;
      name: string;
      email: string;
    };
  })[];
  captain: {
    id: string;
    name: string;
    email: string;
  };
}

export const useTeams = () => {
  const [teams, setTeams] = useState<TeamWithMembers[]>([]);
  const [userTeams, setUserTeams] = useState<TeamWithMembers[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { user } = useAuth();

  // Obtener todos los equipos activos
  const fetchTeams = async () => {
    setLoading(true);
    setError(null);
    
    try {
      const { data, error } = await supabase
        .from('teams')
        .select(`
          *,
          team_members (
            *,
            users (
              id,
              name,
              email
            )
          ),
          captain:users!teams_captain_id_fkey (
            id,
            name,
            email
          )
        `)
        .eq('active', true)
        .order('ranking_points', { ascending: false });

      if (error) throw error;
      setTeams(data as TeamWithMembers[] || []);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al cargar equipos');
    } finally {
      setLoading(false);
    }
  };

  // Obtener equipos del usuario actual
  const fetchUserTeams = async () => {
    if (!user) return;
    
    try {
      const { data, error } = await supabase
        .from('team_members')
        .select(`
          teams (
            *,
            team_members (
              *,
              users (
                id,
                name,
                email
              )
            ),
            captain:users!teams_captain_id_fkey (
              id,
              name,
              email
            )
          )
        `)
        .eq('user_id', user.id);

      if (error) throw error;
      
      const userTeamsData = data?.map(item => item.teams).filter(Boolean) || [];
      setUserTeams(userTeamsData as unknown as TeamWithMembers[]);
    } catch (err) {
      console.error('Error fetching user teams:', err);
    }
  };

  // Crear nuevo equipo
  const createTeam = async (teamData: Omit<TeamInsert, 'captain_id'>) => {
    if (!user) throw new Error('Usuario no autenticado');
    
    setLoading(true);
    setError(null);
    
    try {
      // Crear el equipo
      const { data: team, error: teamError } = await supabase
        .from('teams')
        .insert({
          ...teamData,
          captain_id: user.id
        })
        .select()
        .single();

      if (teamError) throw teamError;

      // Agregar al capitán como miembro del equipo
      const { error: memberError } = await supabase
        .from('team_members')
        .insert({
          team_id: team.id,
          user_id: user.id,
          role: 'captain'
        });

      if (memberError) throw memberError;

      await fetchTeams();
      await fetchUserTeams();
      
      return team;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Error al crear equipo';
      setError(errorMessage);
      throw new Error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  // Unirse a un equipo
  const joinTeam = async (teamId: string, position?: string) => {
    if (!user) throw new Error('Usuario no autenticado');
    
    setLoading(true);
    setError(null);
    
    try {
      const { error } = await supabase
        .from('team_members')
        .insert({
          team_id: teamId,
          user_id: user.id,
          role: 'member',
          position
        });

      if (error) throw error;

      // Actualizar contador de miembros
      const { data: currentTeam } = await supabase
        .from('teams')
        .select('members_count')
        .eq('id', teamId)
        .single();

      const { error: updateError } = await supabase
        .from('teams')
        .update({ 
          members_count: (currentTeam?.members_count || 0) + 1
        })
        .eq('id', teamId);

      if (updateError) throw updateError;

      await fetchTeams();
      await fetchUserTeams();
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Error al unirse al equipo';
      setError(errorMessage);
      throw new Error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  // Salir de un equipo
  const leaveTeam = async (teamId: string) => {
    if (!user) throw new Error('Usuario no autenticado');
    
    setLoading(true);
    setError(null);
    
    try {
      const { error } = await supabase
        .from('team_members')
        .delete()
        .eq('team_id', teamId)
        .eq('user_id', user.id);

      if (error) throw error;

      // Actualizar contador de miembros
      const { data: currentTeam } = await supabase
        .from('teams')
        .select('members_count')
        .eq('id', teamId)
        .single();

      const { error: updateError } = await supabase
        .from('teams')
        .update({ 
          members_count: Math.max((currentTeam?.members_count || 1) - 1, 0)
        })
        .eq('id', teamId);

      if (updateError) throw updateError;

      await fetchTeams();
      await fetchUserTeams();
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Error al salir del equipo';
      setError(errorMessage);
      throw new Error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  // Obtener ranking de equipos
  const getTeamRankings = async () => {
    try {
      const { data, error } = await supabase
        .from('team_rankings')
        .select('*')
        .limit(10);

      if (error) throw error;
      return data || [];
    } catch (err) {
      console.error('Error fetching team rankings:', err);
      return [];
    }
  };

  // Verificar si el usuario pertenece a un equipo
  const isUserInTeam = (teamId: string): boolean => {
    return userTeams.some(team => team.id === teamId);
  };

  // Verificar si el usuario es capitán de un equipo
  const isUserCaptain = (teamId: string): boolean => {
    return userTeams.some(team => team.id === teamId && team.captain_id === user?.id);
  };

  useEffect(() => {
    fetchTeams();
  }, []);

  useEffect(() => {
    if (user) {
      fetchUserTeams();
    }
  }, [user]);

  return {
    teams,
    userTeams,
    loading,
    error,
    createTeam,
    joinTeam,
    leaveTeam,
    getTeamRankings,
    isUserInTeam,
    isUserCaptain,
    refetch: fetchTeams
  };
};
