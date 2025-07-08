import React from 'react';
import { Link } from 'react-router-dom';

const LoginPage: React.FC = () => {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-yellow-100 p-4">
      <div className="bg-white p-8 rounded-lg shadow-lg text-center">
        <h1 className="text-4xl font-bold text-yellow-600 mb-4">Login / Cadastro</h1>
        <p className="text-gray-700 text-lg mb-6">Acesse sua conta ou crie uma nova. (Funcionalidade a ser implementada)</p>
        <Link to="/" className="px-6 py-3 bg-gray-500 text-white font-semibold rounded-full shadow-md hover:bg-gray-700 transition duration-300">
          Voltar para Home
        </Link>
      </div>
    </div>
  );
};

export default LoginPage;
