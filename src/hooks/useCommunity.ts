import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import { useAuth } from '../contexts/AuthContext';
import type { Database } from '../lib/supabase';

type CommunityPost = Database['public']['Tables']['community_posts']['Row'];
type CommunityPostInsert = Database['public']['Tables']['community_posts']['Insert'];

interface CommunityPostWithAuthor extends CommunityPost {
  author: {
    id: string;
    name: string;
    email: string;
  };
}

export const useCommunity = () => {
  const [posts, setPosts] = useState<CommunityPostWithAuthor[]>([]);
  const [userPosts, setUserPosts] = useState<CommunityPostWithAuthor[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { user } = useAuth();

  // Obtener todas las publicaciones activas
  const fetchPosts = async () => {
    setLoading(true);
    setError(null);
    
    try {
      const { data, error } = await supabase
        .from('community_posts')
        .select(`
          *,
          author:users!community_posts_author_id_fkey (
            id,
            name,
            email
          )
        `)
        .eq('status', 'active')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setPosts(data as CommunityPostWithAuthor[] || []);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al cargar publicaciones');
    } finally {
      setLoading(false);
    }
  };

  // Obtener publicaciones del usuario actual
  const fetchUserPosts = async () => {
    if (!user) return;
    
    try {
      const { data, error } = await supabase
        .from('community_posts')
        .select(`
          *,
          author:users!community_posts_author_id_fkey (
            id,
            name,
            email
          )
        `)
        .eq('author_id', user.id)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setUserPosts(data as CommunityPostWithAuthor[] || []);
    } catch (err) {
      console.error('Error fetching user posts:', err);
    }
  };

  // Crear nueva publicación
  const createPost = async (postData: Omit<CommunityPostInsert, 'author_id'>) => {
    if (!user) throw new Error('Usuario no autenticado');
    
    setLoading(true);
    setError(null);
    
    try {
      const { data, error } = await supabase
        .from('community_posts')
        .insert({
          ...postData,
          author_id: user.id
        })
        .select(`
          *,
          author:users!community_posts_author_id_fkey (
            id,
            name,
            email
          )
        `)
        .single();

      if (error) throw error;
      
      await fetchPosts();
      await fetchUserPosts();
      
      return data;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Error al crear publicación';
      setError(errorMessage);
      throw new Error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  // Actualizar publicación
  const updatePost = async (postId: string, updates: Partial<CommunityPost>) => {
    if (!user) throw new Error('Usuario no autenticado');
    
    setLoading(true);
    setError(null);
    
    try {
      const { error } = await supabase
        .from('community_posts')
        .update(updates)
        .eq('id', postId)
        .eq('author_id', user.id);

      if (error) throw error;
      
      await fetchPosts();
      await fetchUserPosts();
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Error al actualizar publicación';
      setError(errorMessage);
      throw new Error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  // Cerrar publicación
  const closePost = async (postId: string) => {
    await updatePost(postId, { status: 'closed' });
  };

  // Eliminar publicación (cambiar a expirada)
  const deletePost = async (postId: string) => {
    await updatePost(postId, { status: 'expired' });
  };

  // Filtrar publicaciones por tipo
  const getPostsByType = (type: CommunityPost['type']) => {
    return posts.filter(post => post.type === type);
  };

  // Obtener publicaciones de búsqueda de equipo
  const getSeekingTeamPosts = () => {
    return getPostsByType('seeking_team');
  };

  // Obtener publicaciones de búsqueda de jugadores
  const getSeekingPlayersPosts = () => {
    return getPostsByType('seeking_players');
  };

  // Filtrar publicaciones por fecha
  const getPostsByDate = (date: string) => {
    return posts.filter(post => post.game_date === date);
  };

  // Obtener publicaciones próximas (próximos 7 días)
  const getUpcomingPosts = () => {
    const today = new Date();
    const nextWeek = new Date();
    nextWeek.setDate(today.getDate() + 7);
    
    const todayStr = today.toISOString().split('T')[0];
    const nextWeekStr = nextWeek.toISOString().split('T')[0];
    
    return posts.filter(post => 
      post.game_date >= todayStr && 
      post.game_date <= nextWeekStr
    );
  };

  // Verificar si el usuario es autor de una publicación
  const isUserAuthor = (postId: string): boolean => {
    return userPosts.some(post => post.id === postId);
  };

  // Limpiar publicaciones expiradas automáticamente
  const cleanExpiredPosts = async () => {
    try {
      const yesterday = new Date();
      yesterday.setDate(yesterday.getDate() - 1);
      const yesterdayStr = yesterday.toISOString().split('T')[0];

      const { error } = await supabase
        .from('community_posts')
        .update({ status: 'expired' })
        .eq('status', 'active')
        .lt('game_date', yesterdayStr);

      if (error) throw error;
      
      await fetchPosts();
    } catch (err) {
      console.error('Error cleaning expired posts:', err);
    }
  };

  useEffect(() => {
    fetchPosts();
    cleanExpiredPosts(); // Limpiar posts expirados al cargar
  }, []);

  useEffect(() => {
    if (user) {
      fetchUserPosts();
    }
  }, [user]);

  return {
    posts,
    userPosts,
    loading,
    error,
    createPost,
    updatePost,
    closePost,
    deletePost,
    getPostsByType,
    getSeekingTeamPosts,
    getSeekingPlayersPosts,
    getPostsByDate,
    getUpcomingPosts,
    isUserAuthor,
    refetch: fetchPosts
  };
};
