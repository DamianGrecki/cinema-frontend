import { Link } from 'react-router-dom';
import { Film } from 'lucide-react';
import { Button } from '@/components/ui/button';

export default function Navbar() {
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
        </nav>
      </div>
    </header>
  );
}
