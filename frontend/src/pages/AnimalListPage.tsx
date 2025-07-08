import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../services/api'; // Importa a instância do Axios
import type { IAnimalFrontend } from '../types/model';

const AnimalListPage: React.FC = () => {
  const [animais, setAnimais] = useState<IAnimalFrontend[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchAnimais = async () => {
      try {
        setLoading(true);
        setError(null);
        const response = await api.get('/animais'); // Faz a requisição GET para a API
        setAnimais(response.data); // Atualiza o estado com os dados recebidos
      } catch (err: unknown) {
        console.error('Erro ao buscar animais:', err);
        setError('Não foi possível carregar os animais. Tente novamente mais tarde.');
      } finally {
        setLoading(false);
      }
    };

    fetchAnimais();
  }, []); // O array vazio garante que o useEffect rode apenas uma vez (ao montar o componente)

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center p-4">
        <p className="text-xl text-gray-700">Carregando animais...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-red-100 flex items-center justify-center p-4">
          <p className="text-xl text-red-700">{error}</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-blue-100 p-8">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-5xl font-extrabold text-blue-800 mb-8 text-center">
          Animais para Adoção
        </h1>
        <p className="text-gray-700 text-lg mb-10 text-center">
          Encontre seu novo melhor amigo na Quarta Colônia!
        </p>

        {animais.length === 0 ? (
          <div className="text-center text-gray-600 text-2xl mt-10">
            Nenhum animal disponível para adoção no momento.
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {animais.map((animal) => (
              <div key={animal._id} className="bg-white rounded-lg shadow-xl overflow-hidden transform transition duration-300 hover:scale-105">
                <img
                  src={animal.fotos[0] || 'https://placehold.co/600x400/CCCCCC/333333?text=Sem+Foto'}
                  alt={animal.nome}
                  className="w-full h-64 object-cover"
                  onError={(e) => {
                    const target = e.target as HTMLImageElement;
                    target.onerror = null; // Previne loop infinito
                    target.src = 'https://placehold.co/600x400/CCCCCC/333333?text=Erro+ao+Carregar';
                  }}
                />
                <div className="p-6">
                  <h2 className="text-3xl font-bold text-gray-900 mb-2">{animal.nome}</h2>
                  <p className="text-gray-600 text-lg mb-2">
                    <span className="font-semibold">Espécie:</span> {animal.especie}
                  </p>
                  {animal.raca && (
                    <p className="text-gray-600 text-lg mb-2">
                      <span className="font-semibold">Raça:</span> {animal.raca}
                    </p>
                  )}
                  <p className="text-gray-600 text-lg mb-2">
                    <span className="font-semibold">Idade:</span> {animal.idade} anos
                  </p>
                  <p className="text-gray-600 text-lg mb-4">
                    <span className="font-semibold">Sexo:</span> {animal.sexo}
                  </p>
                  {/* Exibe o nome do abrigo se estiver populado */}
                  {typeof animal.abrigoResponsavel !== 'string' && (
                    <p className="text-gray-700 text-md mb-4">
                      <span className="font-semibold">Abrigo:</span> {animal.abrigoResponsavel.nome}
                    </p>
                  )}
                  <Link
                    to={`/animais/${animal._id}`}
                    className="block w-full text-center px-6 py-3 bg-indigo-600 text-white font-semibold rounded-md shadow-md hover:bg-indigo-700 transition duration-300"
                  >
                    Ver Detalhes
                  </Link>
                </div>
              </div>
            ))}
          </div>
        )}

        <div className="text-center mt-12">
          <Link
            to="/"
            className="inline-block px-8 py-4 bg-gray-500 text-white font-semibold rounded-full shadow-md hover:bg-gray-700 transition duration-300 text-lg"
          >
            Voltar para Home
          </Link>
        </div>
      </div>
    </div>
  );
};

export default AnimalListPage;