import React from 'react';
import { Home, PlusCircle, MapPin, Github } from 'lucide-react';
import { Link } from 'react-router-dom';

const Footer: React.FC = () => {
  return (
    <footer className="bg-white shadow-md mt-auto">
      <div className="container mx-auto px-4 py-4">
        <nav className="flex justify-around items-center">
          {[
            { to: "/", icon: Home, label: "Adoptar" },
            { to: "/publicar", icon: PlusCircle, label: "Publicar" },
            { to: "/mapa", icon: MapPin, label: "Mapa" },
          ].map(({ to, icon: Icon, label }) => (
            <Link 
              key={to} 
              to={to} 
              className="flex flex-col items-center text-[#0081a7] hover:text-[#00afb9] transition duration-300"
            >
              <Icon size={24} />
              <span className="text-sm mt-1">{label}</span>
            </Link>
          ))}
          <a 
            href="https://github.com/tomastk/shelty-frontend" 
            target="_blank" 
            rel="noopener noreferrer" 
            className="flex flex-col items-center text-[#0081a7] hover:text-[#00afb9] transition duration-300"
          >
            <Github size={24} />
            <span className="text-sm mt-1">GitHub</span>
          </a>
        </nav>
      </div>
    </footer>
  );
};

export default Footer;
