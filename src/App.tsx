import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "@/contexts/AuthContext";
import Index from "./pages/Index";
import ReservasOptimized from "./pages/reservas-optimized";
import ReservasTest from "./pages/reservas-test";
import BasicTest from "./pages/basic-test";
import Comunidad from "./pages/comunidad";
import Torneos from "./pages/torneos";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <AuthProvider>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/reservas" element={<ReservasOptimized />} />
            <Route path="/reservas-test" element={<ReservasTest />} />
            <Route path="/basic-test" element={<BasicTest />} />
            <Route path="/comunidad" element={<Comunidad />} />
            <Route path="/torneos" element={<Torneos />} />
            {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </AuthProvider>
  </QueryClientProvider>
);

export default App;
