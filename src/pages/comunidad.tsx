import { useState } from "react";
import { Plus, Users, User, MessageCircle, Calendar, MapPin, Clock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";

interface Post {
  id: string;
  type: "seeking_team" | "seeking_players";
  author: string;
  position: string;
  gameDate: string;
  gameTime: string;
  location: string;
  playersNeeded?: number;
  description: string;
  contactInfo: string;
  createdAt: string;
}

export default function Comunidad() {
  const [activeTab, setActiveTab] = useState("seeking_team");
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [newPost, setNewPost] = useState<{
    type: "seeking_team" | "seeking_players";
    position: string;
    gameDate: string;
    gameTime: string;
    location: string;
    playersNeeded: number;
    description: string;
    contactInfo: string;
  }>({
    type: "seeking_team",
    position: "",
    gameDate: "",
    gameTime: "",
    location: "",
    playersNeeded: 1,
    description: "",
    contactInfo: ""
  });
  const { toast } = useToast();

  // Mock data - replace with real data
  const posts: Post[] = [
    {
      id: "1",
      type: "seeking_team",
      author: "Carlos M.",
      position: "Delantero",
      gameDate: "2024-08-15",
      gameTime: "19:00",
      location: "Cancha 1",
      description: "Jugador experimentado busca equipo para partido amistoso",
      contactInfo: "+56 9 1234 5678",
      createdAt: "2024-08-10"
    },
    {
      id: "2",
      type: "seeking_players",
      author: "Equipo Los Tigres",
      position: "Defensa Central",
      gameDate: "2024-08-16",
      gameTime: "20:00",
      location: "Cancha 2",
      playersNeeded: 2,
      description: "Necesitamos 2 defensas para completar nuestro equipo",
      contactInfo: "tigres.fc@email.com",
      createdAt: "2024-08-09"
    },
    {
      id: "3",
      type: "seeking_team",
      author: "Miguel R.",
      position: "Portero",
      gameDate: "2024-08-17",
      gameTime: "18:30",
      location: "Cancha 3",
      description: "Portero con experiencia busca equipo",
      contactInfo: "+56 9 8765 4321",
      createdAt: "2024-08-11"
    },
    {
      id: "4",
      type: "seeking_players",
      author: "FC Barcelona Local",
      position: "Mediocampo",
      gameDate: "2024-08-18",
      gameTime: "19:30",
      location: "Cancha 1",
      playersNeeded: 1,
      description: "Buscamos un mediocampo creativo para partido importante",
      contactInfo: "barcelona.local@email.com",
      createdAt: "2024-08-12"
    }
  ];

  const handleCreatePost = () => {
    // TODO: Implement post creation with Supabase
    toast({
      title: "¡Publicación creada!",
      description: "Tu publicación ha sido creada exitosamente.",
    });
    setIsCreateModalOpen(false);
    setNewPost({
      type: "seeking_team",
      position: "",
      gameDate: "",
      gameTime: "",
      location: "",
      playersNeeded: 1,
      description: "",
      contactInfo: ""
    });
  };

  const handleContact = (post: Post) => {
    if (post.contactInfo.includes("@")) {
      window.open(`mailto:${post.contactInfo}`, '_blank');
    } else {
      window.open(`tel:${post.contactInfo}`, '_blank');
    }
  };

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr + 'T00:00:00');
    return date.toLocaleDateString('es-ES', { 
      weekday: 'short', 
      month: 'short', 
      day: 'numeric' 
    });
  };

  const getTimeAgo = (dateStr: string) => {
    const days = Math.floor((Date.now() - new Date(dateStr).getTime()) / (1000 * 60 * 60 * 24));
    if (days === 0) return "Hoy";
    if (days === 1) return "Ayer";
    return `Hace ${days} días`;
  };

  const filteredPosts = posts.filter(post => post.type === activeTab);

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <div className="flex flex-col md:flex-row md:items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold mb-2">Comunidad de Jugadores</h1>
          <p className="text-muted-foreground">Conecta con otros jugadores y forma tu equipo ideal</p>
        </div>
        
        <Dialog open={isCreateModalOpen} onOpenChange={setIsCreateModalOpen}>
          <DialogTrigger asChild>
            <Button className="bg-gradient-primary hover:opacity-90 mt-4 md:mt-0">
              <Plus className="h-4 w-4 mr-2" />
              Nueva Publicación
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle>Crear Nueva Publicación</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <Label>Tipo de publicación</Label>
                <Select 
                  value={newPost.type} 
                  onValueChange={(value: "seeking_team" | "seeking_players") => 
                    setNewPost(prev => ({ ...prev, type: value }))
                  }
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="seeking_team">Busco Equipo</SelectItem>
                    <SelectItem value="seeking_players">Buscamos Jugadores</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div>
                <Label>Posición</Label>
                <Select value={newPost.position} onValueChange={(value) => setNewPost(prev => ({ ...prev, position: value }))}>
                  <SelectTrigger>
                    <SelectValue placeholder="Selecciona posición" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Portero">Portero</SelectItem>
                    <SelectItem value="Defensa">Defensa</SelectItem>
                    <SelectItem value="Mediocampo">Mediocampo</SelectItem>
                    <SelectItem value="Delantero">Delantero</SelectItem>
                    <SelectItem value="Cualquiera">Cualquier posición</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <Label>Fecha del partido</Label>
                  <Input
                    type="date"
                    value={newPost.gameDate}
                    onChange={(e) => setNewPost(prev => ({ ...prev, gameDate: e.target.value }))}
                    min={new Date().toISOString().split('T')[0]}
                  />
                </div>
                <div>
                  <Label>Hora</Label>
                  <Input
                    type="time"
                    value={newPost.gameTime}
                    onChange={(e) => setNewPost(prev => ({ ...prev, gameTime: e.target.value }))}
                  />
                </div>
              </div>
              
              {newPost.type === "seeking_players" && (
                <div>
                  <Label>Jugadores necesarios</Label>
                  <Input
                    type="number"
                    min="1"
                    max="11"
                    value={newPost.playersNeeded}
                    onChange={(e) => setNewPost(prev => ({ ...prev, playersNeeded: parseInt(e.target.value) }))}
                  />
                </div>
              )}
              
              <div>
                <Label>Descripción</Label>
                <Textarea
                  placeholder="Describe tu búsqueda..."
                  value={newPost.description}
                  onChange={(e) => setNewPost(prev => ({ ...prev, description: e.target.value }))}
                />
              </div>
              
              <div>
                <Label>Contacto</Label>
                <Input
                  placeholder="Email o teléfono"
                  value={newPost.contactInfo}
                  onChange={(e) => setNewPost(prev => ({ ...prev, contactInfo: e.target.value }))}
                />
              </div>
              
              <div className="flex gap-2">
                <Button variant="outline" onClick={() => setIsCreateModalOpen(false)} className="flex-1">
                  Cancelar
                </Button>
                <Button onClick={handleCreatePost} className="flex-1 bg-gradient-primary hover:opacity-90">
                  Publicar
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="seeking_team" className="flex items-center gap-2">
            <User className="h-4 w-4" />
            Busco Equipo
          </TabsTrigger>
          <TabsTrigger value="seeking_players" className="flex items-center gap-2">
            <Users className="h-4 w-4" />
            Buscamos Jugadores
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="seeking_team" className="mt-6">
          <div className="space-y-4">
            {filteredPosts.map(post => (
              <Card key={post.id} className="shadow-card hover:shadow-sport transition-all duration-300">
                <CardHeader className="pb-3">
                  <div className="flex items-start justify-between">
                    <div>
                      <CardTitle className="text-lg">{post.author}</CardTitle>
                      <CardDescription className="flex items-center gap-4 mt-1">
                        <Badge variant="secondary">{post.position}</Badge>
                        <span className="text-xs text-muted-foreground">{getTimeAgo(post.createdAt)}</span>
                      </CardDescription>
                    </div>
                    <Button
                      size="sm"
                      onClick={() => handleContact(post)}
                      className="bg-gradient-primary hover:opacity-90"
                    >
                      <MessageCircle className="h-4 w-4 mr-2" />
                      Contactar
                    </Button>
                  </div>
                </CardHeader>
                <CardContent className="space-y-3">
                  <p className="text-sm">{post.description}</p>
                  
                  <div className="flex flex-wrap gap-4 text-sm text-muted-foreground">
                    <div className="flex items-center gap-1">
                      <Calendar className="h-4 w-4 text-primary" />
                      {formatDate(post.gameDate)}
                    </div>
                    <div className="flex items-center gap-1">
                      <Clock className="h-4 w-4 text-primary" />
                      {post.gameTime}
                    </div>
                    <div className="flex items-center gap-1">
                      <MapPin className="h-4 w-4 text-primary" />
                      {post.location}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>
        
        <TabsContent value="seeking_players" className="mt-6">
          <div className="space-y-4">
            {filteredPosts.map(post => (
              <Card key={post.id} className="shadow-card hover:shadow-sport transition-all duration-300">
                <CardHeader className="pb-3">
                  <div className="flex items-start justify-between">
                    <div>
                      <CardTitle className="text-lg">{post.author}</CardTitle>
                      <CardDescription className="flex items-center gap-4 mt-1">
                        <Badge variant="secondary">{post.position}</Badge>
                        {post.playersNeeded && (
                          <Badge variant="outline">
                            Necesita {post.playersNeeded} jugador{post.playersNeeded > 1 ? 'es' : ''}
                          </Badge>
                        )}
                        <span className="text-xs text-muted-foreground">{getTimeAgo(post.createdAt)}</span>
                      </CardDescription>
                    </div>
                    <Button
                      size="sm"
                      onClick={() => handleContact(post)}
                      className="bg-gradient-primary hover:opacity-90"
                    >
                      <MessageCircle className="h-4 w-4 mr-2" />
                      Contactar
                    </Button>
                  </div>
                </CardHeader>
                <CardContent className="space-y-3">
                  <p className="text-sm">{post.description}</p>
                  
                  <div className="flex flex-wrap gap-4 text-sm text-muted-foreground">
                    <div className="flex items-center gap-1">
                      <Calendar className="h-4 w-4 text-primary" />
                      {formatDate(post.gameDate)}
                    </div>
                    <div className="flex items-center gap-1">
                      <Clock className="h-4 w-4 text-primary" />
                      {post.gameTime}
                    </div>
                    <div className="flex items-center gap-1">
                      <MapPin className="h-4 w-4 text-primary" />
                      {post.location}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>
      </Tabs>

      {filteredPosts.length === 0 && (
        <div className="text-center py-12">
          <Users className="h-16 w-16 mx-auto mb-4 text-muted-foreground/50" />
          <h3 className="text-lg font-semibold mb-2">No hay publicaciones disponibles</h3>
          <p className="text-muted-foreground mb-4">
            ¡Sé el primero en crear una publicación!
          </p>
          <Button onClick={() => setIsCreateModalOpen(true)} className="bg-gradient-primary hover:opacity-90">
            <Plus className="h-4 w-4 mr-2" />
            Crear Publicación
          </Button>
        </div>
      )}
    </div>
  );
}