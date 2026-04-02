import { Link, useNavigate } from 'react-router-dom';
import { Film, LogIn, LogOut, UserPlus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useAuthStore } from '@/store/authStore';
import { logoutRequest } from '@/api/auth';

export default function Navbar() {
  const navigate = useNavigate();
  const { email, logout, isAuthenticated } = useAuthStore();

  const handleLogout = async () => {
    await logoutRequest().catch(() => {});
    logout();
    navigate('/');
  };

  return (
    <header className="border-b bg-card">
      <div className="container mx-auto px-4 h-16 flex items-center justify-between">
        <Link to="/" className="flex items-center gap-2 font-bold text-xl">
          <Film className="h-6 w-6" />
          CinemaApp
        </Link>

        <nav className="flex items-center gap-2">
          <Link to="/movies">
            <Button variant="ghost">Filmy</Button>
          </Link>
          <Link to="/screenings">
            <Button variant="ghost">Repertuar</Button>
          </Link>

          {isAuthenticated() ? (
            <div className="flex items-center gap-2 ml-2">
              <span className="text-sm text-muted-foreground hidden sm:inline">{email}</span>
              <Button variant="outline" size="sm" onClick={handleLogout}>
                <LogOut className="h-4 w-4 mr-1" />
                Wyloguj
              </Button>
            </div>
          ) : (
            <>
              <Link to="/register" className="ml-2">
                <Button variant="outline" size="sm">
                  <UserPlus className="h-4 w-4 mr-1" />
                  Zarejestruj się
                </Button>
              </Link>
              <Link to="/login">
                <Button variant="outline" size="sm">
                  <LogIn className="h-4 w-4 mr-1" />
                  Zaloguj
                </Button>
              </Link>
            </>
          )}
        </nav>
      </div>
    </header>
  );
}
