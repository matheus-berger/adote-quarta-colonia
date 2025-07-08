import React, { useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/authHook';

const AdminAreaPage: React.FC = () => {
  const { authState } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    // Redireciona se não estiver autenticado ou não for um administrador
    if (!authState.loading && (!authState.isAuthenticated || authState.user?.role !== 'administrador')) {
      navigate('/login');
      return;
    }
  }, [authState, navigate]);

  if (authState.loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 p-4">
        <p className="text-xl text-gray-700">Carregando área de administração...</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-orange-100 p-4">
      <div className="bg-white p-8 rounded-lg shadow-lg text-center w-full max-w-lg">
        <h1 className="text-4xl font-bold text-orange-600 mb-6">Área de Administração</h1>
        <p className="text-gray-700 text-lg mb-4">Bem-vindo, Administrador {authState.user?.email}!</p>
        <p className="text-gray-700 text-lg mb-6">Aqui você pode gerenciar todo o sistema: abrigos, animais, adotantes e adoções. (Funcionalidade a ser implementada)</p>
        <Link to="/" className="px-6 py-3 bg-gray-500 text-white font-semibold rounded-full shadow-md hover:bg-gray-700 transition duration-300">
          Voltar para Home
        </Link>
      </div>
    </div>
  );
};

export default AdminAreaPage;
