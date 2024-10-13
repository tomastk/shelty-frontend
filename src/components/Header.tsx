import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { PawPrint, Menu, X } from 'lucide-react';

const Header: React.FC = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  return (
    <header className="bg-white shadow-md">
      <div className="container mx-auto px-4 py-4 flex flex-col sm:flex-row justify-between items-center">
        
        {/* Agrupar logo y botón en un div con flex */}
        <div className="flex justify-between items-center w-full sm:w-auto">
          <Link
            to="/"
            className="flex items-center text-2xl font-bold text-[#0081a7]"
            style={{ transition: 'transform 0.5s ease' }}
          >
            <PawPrint className="mr-2 text-[#00afb9]" />
            Shelty
          </Link>

          {/* Botón del menú para móviles */}
          <button
            className="sm:hidden text-[#00afb9] hover:text-[#0081a7] focus:outline-none transition duration-300"
            onClick={toggleMenu}
          >
            {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>

        {/* Menú de navegación */}
        <nav className={`${isMenuOpen ? 'block' : 'hidden'} w-full sm:w-auto sm:block`}>
          <ul className="flex flex-col sm:flex-row sm:space-x-4 space-y-4 sm:space-y-0 items-center">
            {['Home', 'Publicar', 'Mapa'].map((item) => (
              <li key={item}>
                <Link
                  to={item === 'Home' ? '/' : `/${item.toLowerCase()}`}
                  className="text-[#0081a7] hover:text-[#00afb9] transition duration-300 ease-in-out
                             border-b-2 border-transparent hover:border-[#00afb9] pb-1"
                >
                  {item}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
      </div>
    </header>
  );
};

export default Header;