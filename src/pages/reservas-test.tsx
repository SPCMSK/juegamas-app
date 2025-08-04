import { Navigation } from "@/components/ui/navigation";
import { useAuth } from "@/contexts/AuthContext";

export default function ReservasTest() {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <Navigation />
        <div className="container mx-auto px-4 py-8">
          <div className="text-center">
            <h1 className="text-2xl font-bold">Cargando...</h1>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      <div className="container mx-auto px-4 py-8">
        <div className="text-center">
          <h1 className="text-3xl font-bold mb-4">Reservas - Sport La Calera</h1>
          <p className="text-lg">
            {user ? `Bienvenido, ${user.email}` : "No estás conectado"}
          </p>
          <div className="mt-8 p-4 bg-white rounded-lg shadow">
            <h2 className="text-xl font-semibold mb-2">Estado de la conexión</h2>
            <p>AuthContext cargado correctamente</p>
            <p>Supabase: {user ? "✅ Conectado" : "❌ No conectado"}</p>
          </div>
        </div>
      </div>
    </div>
  );
}
