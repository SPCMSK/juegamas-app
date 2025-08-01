import { useState } from "react";
import { Trophy, Calendar, Users, DollarSign, Clock, Medal, Star, Award } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";

interface Tournament {
  id: string;
  name: string;
  description: string;
  prize: string;
  registrationFee: number;
  startDate: string;
  endDate: string;
  maxTeams: number;
  registeredTeams: number;
  status: "open" | "active" | "finished";
  category: string;
  rules: string[];
  teams: string[];
}

export default function Torneos() {
  const [selectedTournament, setSelectedTournament] = useState<Tournament | null>(null);
  const [isRegistrationModalOpen, setIsRegistrationModalOpen] = useState(false);
  const [teamName, setTeamName] = useState("");
  const { toast } = useToast();

  // Mock data - replace with real data
  const tournaments: Tournament[] = [
    {
      id: "1",
      name: "Copa de Verano 2024",
      description: "El torneo más esperado del año con los mejores equipos de la ciudad",
      prize: "$500.000 + Trofeo",
      registrationFee: 50000,
      startDate: "2024-08-20",
      endDate: "2024-09-15",
      maxTeams: 16,
      registeredTeams: 12,
      status: "open",
      category: "Fútbol 5",
      rules: [
        "Máximo 8 jugadores por equipo",
        "Edad mínima: 18 años",
        "Partidos de 25 minutos cada tiempo",
        "Sistema de eliminación directa",
        "Arbitraje profesional incluido"
      ],
      teams: ["Los Tigres", "FC Barcelona Local", "Deportivo Maipú", "River Santiago"]
    },
    {
      id: "2",
      name: "Liga Amateur Otoño",
      description: "Liga competitiva para equipos amateur con sistema de todos contra todos",
      prize: "$300.000 + Medallas",
      registrationFee: 35000,
      startDate: "2024-09-01",
      endDate: "2024-10-30",
      maxTeams: 12,
      registeredTeams: 8,
      status: "open",
      category: "Fútbol 7",
      rules: [
        "Máximo 11 jugadores por equipo",
        "Edad mínima: 16 años",
        "Partidos de 30 minutos cada tiempo",
        "Sistema de puntos (todos contra todos)",
        "Fair play obligatorio"
      ],
      teams: ["Sporting Club", "Unidos FC", "La Roja", "Juventus Local"]
    },
    {
      id: "3",
      name: "Torneo Relámpago",
      description: "Torneo de un día para equipos que buscan acción rápida",
      prize: "$150.000 + Trofeo",
      registrationFee: 25000,
      startDate: "2024-08-25",
      endDate: "2024-08-25",
      maxTeams: 8,
      registeredTeams: 8,
      status: "active",
      category: "Fútbol 5",
      rules: [
        "Máximo 6 jugadores por equipo",
        "Partidos de 15 minutos cada tiempo",
        "Eliminación directa",
        "Cambios ilimitados"
      ],
      teams: ["Los Halcones", "FC Rápido", "Deportes Pumas", "Racing Club"]
    },
    {
      id: "4",
      name: "Copa de Invierno 2024",
      description: "Torneo finalizado con gran éxito de participación",
      prize: "$400.000 + Trofeo",
      registrationFee: 45000,
      startDate: "2024-06-01",
      endDate: "2024-07-15",
      maxTeams: 16,
      registeredTeams: 16,
      status: "finished",
      category: "Fútbol 5",
      rules: [
        "Máximo 8 jugadores por equipo",
        "Edad mínima: 18 años",
        "Sistema de grupos + eliminación directa"
      ],
      teams: ["Campeón: Los Leones", "Subcampeón: FC Tigres"]
    }
  ];

  const handleRegistration = () => {
    if (!teamName.trim()) {
      toast({
        title: "Error",
        description: "Por favor ingresa el nombre de tu equipo.",
        variant: "destructive",
      });
      return;
    }

    // TODO: Implement tournament registration with Supabase
    toast({
      title: "¡Inscripción exitosa!",
      description: `El equipo "${teamName}" ha sido inscrito en ${selectedTournament?.name}.`,
    });
    setIsRegistrationModalOpen(false);
    setTeamName("");
    setSelectedTournament(null);
  };

  const getStatusBadge = (status: Tournament["status"]) => {
    switch (status) {
      case "open":
        return <Badge className="bg-success hover:bg-success/80">Inscripciones Abiertas</Badge>;
      case "active":
        return <Badge variant="secondary">En Juego</Badge>;
      case "finished":
        return <Badge variant="outline">Finalizado</Badge>;
    }
  };

  const getStatusColor = (status: Tournament["status"]) => {
    switch (status) {
      case "open":
        return "border-success/20 hover:border-success/40";
      case "active":
        return "border-warning/20 hover:border-warning/40";
      case "finished":
        return "border-muted/40 hover:border-muted/60";
    }
  };

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr + 'T00:00:00');
    return date.toLocaleDateString('es-ES', { 
      day: 'numeric',
      month: 'short',
      year: 'numeric'
    });
  };

  return (
    <div className="container mx-auto px-4 py-8 max-w-6xl">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2 flex items-center gap-2">
          <Trophy className="h-8 w-8 text-primary" />
          Torneos
        </h1>
        <p className="text-muted-foreground">Participa en emocionantes torneos y demuestra tu talento</p>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        {tournaments.map(tournament => (
          <Card 
            key={tournament.id} 
            className={`shadow-card hover:shadow-sport transition-all duration-300 border-2 ${getStatusColor(tournament.status)}`}
          >
            <CardHeader className="pb-4">
              <div className="flex items-start justify-between">
                <div>
                  <CardTitle className="text-xl mb-2">{tournament.name}</CardTitle>
                  <CardDescription className="text-base">{tournament.description}</CardDescription>
                </div>
                {getStatusBadge(tournament.status)}
              </div>
            </CardHeader>
            
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div className="flex items-center gap-2">
                  <Trophy className="h-4 w-4 text-primary" />
                  <span className="font-medium">{tournament.prize}</span>
                </div>
                <div className="flex items-center gap-2">
                  <DollarSign className="h-4 w-4 text-primary" />
                  <span>${tournament.registrationFee.toLocaleString()}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Calendar className="h-4 w-4 text-primary" />
                  <span>{formatDate(tournament.startDate)}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Users className="h-4 w-4 text-primary" />
                  <span>{tournament.registeredTeams}/{tournament.maxTeams} equipos</span>
                </div>
              </div>
              
              <div className="flex items-center gap-2">
                <Badge variant="outline">{tournament.category}</Badge>
                {tournament.status === "open" && (
                  <div className="ml-auto">
                    <div className="text-xs text-muted-foreground">
                      {tournament.maxTeams - tournament.registeredTeams} cupos disponibles
                    </div>
                  </div>
                )}
              </div>
              
              <div className="flex gap-2">
                <Dialog>
                  <DialogTrigger asChild>
                    <Button variant="outline" className="flex-1">Ver Detalles</Button>
                  </DialogTrigger>
                  <DialogContent className="sm:max-w-2xl">
                    <DialogHeader>
                      <DialogTitle>{tournament.name}</DialogTitle>
                    </DialogHeader>
                    <div className="space-y-6">
                      <div>
                        <h4 className="font-semibold mb-2 flex items-center gap-2">
                          <Award className="h-4 w-4 text-primary" />
                          Información General
                        </h4>
                        <div className="grid grid-cols-2 gap-4 text-sm">
                          <div>
                            <span className="text-muted-foreground">Premio:</span>
                            <p className="font-medium">{tournament.prize}</p>
                          </div>
                          <div>
                            <span className="text-muted-foreground">Inscripción:</span>
                            <p className="font-medium">${tournament.registrationFee.toLocaleString()}</p>
                          </div>
                          <div>
                            <span className="text-muted-foreground">Inicio:</span>
                            <p className="font-medium">{formatDate(tournament.startDate)}</p>
                          </div>
                          <div>
                            <span className="text-muted-foreground">Fin:</span>
                            <p className="font-medium">{formatDate(tournament.endDate)}</p>
                          </div>
                        </div>
                      </div>
                      
                      <div>
                        <h4 className="font-semibold mb-3 flex items-center gap-2">
                          <Clock className="h-4 w-4 text-primary" />
                          Reglamento
                        </h4>
                        <ul className="space-y-2 text-sm">
                          {tournament.rules.map((rule, index) => (
                            <li key={index} className="flex items-start gap-2">
                              <Star className="h-3 w-3 text-primary mt-1 flex-shrink-0" />
                              {rule}
                            </li>
                          ))}
                        </ul>
                      </div>
                      
                      <div>
                        <h4 className="font-semibold mb-3 flex items-center gap-2">
                          <Users className="h-4 w-4 text-primary" />
                          Equipos {tournament.status === "finished" ? "Finalistas" : "Inscritos"}
                        </h4>
                        <div className="grid grid-cols-2 gap-2">
                          {tournament.teams.map((team, index) => (
                            <div key={index} className="flex items-center gap-2 p-2 bg-muted/50 rounded">
                              {tournament.status === "finished" && index === 0 ? (
                                <Medal className="h-4 w-4 text-yellow-500" />
                              ) : tournament.status === "finished" && index === 1 ? (
                                <Medal className="h-4 w-4 text-gray-400" />
                              ) : (
                                <Trophy className="h-4 w-4 text-primary" />
                              )}
                              <span className="text-sm">{team}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  </DialogContent>
                </Dialog>
                
                {tournament.status === "open" && tournament.registeredTeams < tournament.maxTeams && (
                  <Dialog open={isRegistrationModalOpen} onOpenChange={setIsRegistrationModalOpen}>
                    <DialogTrigger asChild>
                      <Button 
                        className="flex-1 bg-gradient-primary hover:opacity-90"
                        onClick={() => setSelectedTournament(tournament)}
                      >
                        Inscribir Equipo
                      </Button>
                    </DialogTrigger>
                    <DialogContent className="sm:max-w-md">
                      <DialogHeader>
                        <DialogTitle>Inscribir Equipo</DialogTitle>
                      </DialogHeader>
                      <div className="space-y-4">
                        <div>
                          <Label>Nombre del Equipo</Label>
                          <Input
                            placeholder="Ingresa el nombre de tu equipo"
                            value={teamName}
                            onChange={(e) => setTeamName(e.target.value)}
                          />
                        </div>
                        
                        <div className="bg-gradient-card rounded-lg p-4 space-y-2">
                          <h4 className="font-semibold">Resumen de Inscripción</h4>
                          <div className="text-sm space-y-1">
                            <div className="flex justify-between">
                              <span>Torneo:</span>
                              <span className="font-medium">{selectedTournament?.name}</span>
                            </div>
                            <div className="flex justify-between">
                              <span>Costo:</span>
                              <span className="font-medium">${selectedTournament?.registrationFee.toLocaleString()}</span>
                            </div>
                            <div className="flex justify-between">
                              <span>Categoría:</span>
                              <span className="font-medium">{selectedTournament?.category}</span>
                            </div>
                          </div>
                        </div>
                        
                        <div className="flex gap-2">
                          <Button 
                            variant="outline" 
                            onClick={() => {
                              setIsRegistrationModalOpen(false);
                              setTeamName("");
                              setSelectedTournament(null);
                            }}
                            className="flex-1"
                          >
                            Cancelar
                          </Button>
                          <Button 
                            onClick={handleRegistration}
                            className="flex-1 bg-gradient-primary hover:opacity-90"
                          >
                            Confirmar Inscripción
                          </Button>
                        </div>
                      </div>
                    </DialogContent>
                  </Dialog>
                )}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Info Section */}
      <Card className="mt-8 bg-gradient-card">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Trophy className="h-5 w-5 text-primary" />
            Información Importante
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-2 text-sm">
          <p>• Las inscripciones se cierran 48 horas antes del inicio del torneo</p>
          <p>• El pago de la inscripción debe realizarse en efectivo en nuestras instalaciones</p>
          <p>• Todos los equipos deben presentar lista de jugadores antes del primer partido</p>
          <p>• Se requiere Fair Play en todos los partidos</p>
          <p>• Los premios se entregan inmediatamente después de la final</p>
        </CardContent>
      </Card>
    </div>
  );
}