import React from 'react';
import { Link } from 'react-router-dom';

const Header: React.FC = () => {
  return (
    <header className="bg-indigo-700 text-white p-4 shadow-md">
      <div className="container mx-auto flex justify-between items-center">
        <Link to="/" className="text-3xl font-bold hover:text-indigo-200 transition duration-300">
          🐾 Adote Quarta Colônia
        </Link>
        <nav>
          <ul className="flex space-x-6">
            <li>
              <Link to="/animais" className="text-lg font-semibold hover:text-indigo-200 transition duration-300">
                Animais
              </Link>
            </li>
            <li>
              <Link to="/login" className="text-lg font-semibold hover:text-indigo-200 transition duration-300">
                Login
              </Link>
            </li>
            {/* Futuramente, links condicionais para áreas de abrigo/adotante/admin */}
          </ul>
        </nav>
      </div>
    </header>
  );
};

export default Header;
