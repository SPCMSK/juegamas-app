import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Menu, Calendar, Users, Trophy, Phone, LogIn, User } from "lucide-react";
import { cn } from "@/lib/utils";

interface NavigationProps {
  user?: any;
  onLoginClick: () => void;
  onProfileClick: () => void;
}

export function Navigation({ user, onLoginClick, onProfileClick }: NavigationProps) {
  const [isOpen, setIsOpen] = useState(false);
  const location = useLocation();

  const navItems = [
    { href: "/", label: "Inicio", icon: null },
    { href: "/reservas", label: "Reservas", icon: Calendar },
    { href: "/comunidad", label: "Comunidad", icon: Users },
    { href: "/torneos", label: "Torneos", icon: Trophy },
    { href: "/contacto", label: "Contacto", icon: Phone },
  ];

  const isActive = (href: string) => {
    if (href === "/") return location.pathname === "/";
    return location.pathname.startsWith(href);
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
          <div className="h-8 w-8 rounded-lg bg-gradient-primary flex items-center justify-center">
            <span className="text-primary-foreground font-bold text-sm">JF</span>
          </div>
          <span className="font-bold text-xl bg-gradient-primary bg-clip-text text-transparent">
            JuegaFácil
          </span>
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center space-x-1">
          <NavContent />
        </nav>

        {/* User Actions */}
        <div className="flex items-center gap-2">
          {user ? (
            <Button
              variant="ghost"
              size="sm"
              onClick={onProfileClick}
              className="hidden md:flex items-center gap-2"
            >
              <User className="h-4 w-4" />
              {user.name || user.email}
            </Button>
          ) : (
            <Button
              variant="default"
              size="sm"
              onClick={onLoginClick}
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
                    <Button
                      variant="ghost"
                      onClick={() => {
                        onProfileClick();
                        setIsOpen(false);
                      }}
                      className="w-full justify-start"
                    >
                      <User className="h-4 w-4 mr-2" />
                      {user.name || user.email}
                    </Button>
                  ) : (
                    <Button
                      onClick={() => {
                        onLoginClick();
                        setIsOpen(false);
                      }}
                      className="w-full bg-gradient-primary hover:opacity-90"
                    >
                      <LogIn className="h-4 w-4 mr-2" />
                      Iniciar Sesión
                    </Button>
                  )}
                </div>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  );
}