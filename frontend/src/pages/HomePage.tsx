import React from 'react';
import { Link } from 'react-router-dom';

const HomePage: React.FC = () => {
  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center p-4">
      <div className="bg-white p-8 rounded-lg shadow-lg text-center">
        <h1 className="text-4xl font-bold text-indigo-600 mb-4">Página Inicial</h1>
        <p className="text-gray-700 text-lg mb-6">Bem-vindo ao Adote Quarta Colônia! Encontre seu novo melhor amigo.</p>
        <nav className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link to="/animais" className="px-6 py-3 bg-indigo-500 text-white font-semibold rounded-full shadow-md hover:bg-indigo-700 transition duration-300">
            Ver Animais para Adoção
          </Link>
          <Link to="/login" className="px-6 py-3 bg-green-500 text-white font-semibold rounded-full shadow-md hover:bg-green-700 transition duration-300">
            Login / Cadastro
          </Link>
        </nav>
      </div>
    </div>
  );
};

export default HomePage;