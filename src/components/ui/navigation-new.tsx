import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger, DropdownMenuSeparator } from "@/components/ui/dropdown-menu";
import { Menu, Calendar, Users, Trophy, LogIn, User, LogOut, Settings } from "lucide-react";
import { cn } from "@/lib/utils";
import { useAuth } from "@/contexts/AuthContext";
import { AuthModal } from "@/components/auth/auth-modal";
import { useToast } from "@/hooks/use-toast";

export function Navigation() {
  const [isOpen, setIsOpen] = useState(false);
  const [showAuthModal, setShowAuthModal] = useState(false);
  const location = useLocation();
  const { user, signOut } = useAuth();
  const { toast } = useToast();

  const navItems = [
    { href: "/", label: "Inicio", icon: null },
    { href: "/reservas", label: "Reservas", icon: Calendar },
    { href: "/comunidad", label: "Comunidad", icon: Users },
    { href: "/torneos", label: "Torneos", icon: Trophy },
  ];

  const isActive = (href: string) => {
    if (href === "/") return location.pathname === "/";
    return location.pathname.startsWith(href);
  };

  const handleSignOut = async () => {
    const { error } = await signOut();
    if (error) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "No se pudo cerrar sesión",
      });
    } else {
      toast({
        title: "Sesión cerrada",
        description: "Has cerrado sesión correctamente",
      });
    }
  };

  const NavContent = () => (
    <>
      {navItems.map((item) => {
        const Icon = item.icon;
        return (
          <Link
            key={item.href}
            to={item.href}
            className={cn(
              "flex items-center gap-2 px-3 py-2 rounded-lg font-medium transition-smooth",
              "hover:bg-accent hover:text-accent-foreground",
              isActive(item.href)
                ? "bg-primary text-primary-foreground shadow-sport"
                : "text-foreground/80"
            )}
            onClick={() => setIsOpen(false)}
          >
            {Icon && <Icon className="h-4 w-4" />}
            {item.label}
          </Link>
        );
      })}
    </>
  );

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center justify-between px-4">
        {/* Logo */}
        <Link to="/" className="flex items-center space-x-2">
          <img 
            src="/SPORT PLAY (200 x 60 px) (1).svg" 
            alt="Sport Play" 
            className="h-12 w-auto"
            style={{ maxWidth: '160px', height: 'auto' }}
          />
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center space-x-1">
          <NavContent />
        </nav>

        {/* User Actions */}
        <div className="flex items-center gap-2">
          {user ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="ghost"
                  size="sm"
                  className="hidden md:flex items-center gap-2"
                >
                  <User className="h-4 w-4" />
                  {user.user_metadata?.name || user.email}
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56">
                <DropdownMenuItem>
                  <Settings className="mr-2 h-4 w-4" />
                  <span>Mi Perfil</span>
                </DropdownMenuItem>
                <DropdownMenuItem>
                  <Calendar className="mr-2 h-4 w-4" />
                  <span>Mis Reservas</span>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={handleSignOut}>
                  <LogOut className="mr-2 h-4 w-4" />
                  <span>Cerrar Sesión</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <Button
              variant="default"
              size="sm"
              onClick={() => setShowAuthModal(true)}
              className="hidden md:flex items-center gap-2 bg-gradient-primary hover:opacity-90"
            >
              <LogIn className="h-4 w-4" />
              Iniciar Sesión
            </Button>
          )}

          {/* Mobile Menu */}
          <Sheet open={isOpen} onOpenChange={setIsOpen}>
            <SheetTrigger asChild>
              <Button variant="ghost" size="sm" className="md:hidden">
                <Menu className="h-5 w-5" />
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="w-80">
              <div className="flex flex-col space-y-4 mt-8">
                <NavContent />
                <div className="pt-4 border-t">
                  {user ? (
                    <div className="space-y-2">
                      <div className="text-sm text-muted-foreground px-3">
                        {user.user_metadata?.name || user.email}
                      </div>
                      <Button
                        variant="ghost"
                        className="w-full justify-start"
                        onClick={() => setIsOpen(false)}
                      >
                        <Settings className="mr-2 h-4 w-4" />
                        Mi Perfil
                      </Button>
                      <Button
                        variant="ghost"
                        className="w-full justify-start"
                        onClick={() => setIsOpen(false)}
                      >
                        <Calendar className="mr-2 h-4 w-4" />
                        Mis Reservas
                      </Button>
                      <Button
                        variant="ghost"
                        className="w-full justify-start text-red-600 hover:text-red-700"
                        onClick={() => {
                          handleSignOut();
                          setIsOpen(false);
                        }}
                      >
                        <LogOut className="mr-2 h-4 w-4" />
                        Cerrar Sesión
                      </Button>
                    </div>
                  ) : (
                    <Button
                      variant="default"
                      className="w-full bg-gradient-primary"
                      onClick={() => {
                        setShowAuthModal(true);
                        setIsOpen(false);
                      }}
                    >
                      <LogIn className="mr-2 h-4 w-4" />
                      Iniciar Sesión
                    </Button>
                  )}
                </div>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>

      {/* Auth Modal */}
      <AuthModal 
        isOpen={showAuthModal} 
        onClose={() => setShowAuthModal(false)} 
      />
    </header>
  );
}
