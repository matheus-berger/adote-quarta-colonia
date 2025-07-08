import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import api from '../services/api';
import { useAuth } from '../hooks/authHook';
import type { IAdotanteFrontend } from '../types/model';

const AdotanteAreaPage: React.FC = () => {
  const { authState } = useAuth();
  const navigate = useNavigate();
  const [adotanteData, setAdotanteData] = useState<IAdotanteFrontend | null>(null);
  const [loadingData, setLoadingData] = useState<boolean>(true);
  const [errorData, setErrorData] = useState<string | null>(null);

  useEffect(() => {
    // Redireciona se não estiver autenticado ou não for um adotante
    if (!authState.loading && (!authState.isAuthenticated || authState.user?.role !== 'adotante')) {
      navigate('/login');
      return;
    }

    const fetchAdotanteData = async () => {
      if (authState.user?.entityId) {
        try {
          setLoadingData(true);
          const response = await api.get(`/adotantes/${authState.user.entityId}`);
          setAdotanteData(response.data);
        } catch (err: any) {
          console.error('Erro ao buscar dados do adotante:', err);
          setErrorData('Não foi possível carregar os dados do adotante.');
        } finally {
          setLoadingData(false);
        }
      } else {
        setLoadingData(false); // Não há entityId para buscar
        setErrorData('Nenhum ID de adotante associado a este usuário.');
      }
    };

    // Só busca os dados do adotante se o usuário estiver autenticado e for um adotante
    if (authState.isAuthenticated && authState.user?.role === 'adotante') {
      fetchAdotanteData();
    }
  }, [authState, navigate]);

  if (authState.loading || loadingData) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 p-4">
        <p className="text-xl text-gray-700">Carregando área do adotante...</p>
      </div>
    );
  }

  if (errorData) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-red-100 p-4">
        <div className="bg-white p-8 rounded-lg shadow-lg text-center">
          <h1 className="text-4xl font-bold text-red-600 mb-4">Erro na Área do Adotante</h1>
          <p className="text-gray-700 text-lg mb-6">{errorData}</p>
          <Link to="/" className="px-6 py-3 bg-gray-500 text-white font-semibold rounded-full shadow-md hover:bg-gray-700 transition duration-300">
            Voltar para Home
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-green-100 p-4">
      <div className="bg-white p-8 rounded-lg shadow-lg text-center w-full max-w-lg">
        <h1 className="text-4xl font-bold text-green-600 mb-6">Área do Adotante</h1>
        <p className="text-gray-700 text-lg mb-4">Bem-vindo, {authState.user?.email}!</p>

        {adotanteData ? (
          <div className="text-left mt-6 p-4 border rounded-lg bg-gray-50">
            <h2 className="text-2xl font-semibold text-green-700 mb-3">Detalhes do Seu Perfil:</h2>
            <p className="text-gray-800 text-lg mb-2"><span className="font-bold">Nome:</span> {adotanteData.nome}</p>
            <p className="text-gray-800 text-lg mb-2"><span className="font-bold">Endereço:</span> {adotanteData.endereco}</p>
            <p className="text-gray-800 text-lg mb-2"><span className="font-bold">Telefone:</span> {adotanteData.telefone}</p>
            <p className="text-gray-800 text-lg mb-2"><span className="font-bold">E-mail:</span> {adotanteData.email}</p>
            <p className="text-gray-800 text-lg"><span className="font-bold">Cadastrado em:</span> {new Date(adotanteData.createdAt).toLocaleDateString()}</p>
          </div>
        ) : (
          <p className="text-gray-600 text-lg mt-6">Nenhum dado de adotante encontrado para este usuário.</p>
        )}

        <p className="text-gray-700 text-lg mt-6 mb-6">Visualize suas adoções e gerencie seu perfil. (Funcionalidade a ser implementada)</p>
        <Link to="/" className="px-6 py-3 bg-gray-500 text-white font-semibold rounded-full shadow-md hover:bg-gray-700 transition duration-300">
          Voltar para Home
        </Link>
      </div>
    </div>
  );
};

export default AdotanteAreaPage;
