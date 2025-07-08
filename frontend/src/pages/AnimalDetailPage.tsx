import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import api from '../services/api'; // Importa a instância do Axios
import type { IAbrigoFrontend, IAnimalFrontend } from '../types/model';


const AnimalDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>(); // Obtém o ID do animal da URL
  const [animal, setAnimal] = useState<IAnimalFrontend | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchAnimal = async () => {
      if (!id) {
        setError('ID do animal não fornecido.');
        setLoading(false);
        return;
      }
      try {
        setLoading(true);
        setError(null);
        const response = await api.get(`/animais/${id}`); // Faz a requisição GET por ID
        setAnimal(response.data);
      } catch (err: unknown) {
        console.error('Erro ao buscar detalhes do animal:', err);
        if (err.response && err.response.status === 404) {
          setError('Animal não encontrado.');
        } else {
          setError('Não foi possível carregar os detalhes do animal. Tente novamente mais tarde.');
        }
      } finally {
        setLoading(false);
      }
    };

    fetchAnimal();
  }, [id]); // O useEffect roda novamente se o ID na URL mudar

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center p-4">
        <p className="text-xl text-gray-700">Carregando detalhes do animal...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-red-100 flex items-center justify-center p-4">
        <p className="text-xl text-red-700">{error}</p>
        <Link to="/animais" className="mt-4 px-6 py-3 bg-gray-500 text-white font-semibold rounded-full shadow-md hover:bg-gray-700 transition duration-300">
          Voltar para a Lista
        </Link>
      </div>
    );
  }

  if (!animal) {
    return (
      <div className="min-h-screen bg-red-100 flex items-center justify-center p-4">
        <p className="text-xl text-red-700">Nenhum animal encontrado com este ID.</p>
        <Link to="/animais" className="mt-4 px-6 py-3 bg-gray-500 text-white font-semibold rounded-full shadow-md hover:bg-gray-700 transition duration-300">
            Voltar para a Lista
        </Link>
      </div>
    );
  }

  // Garante que abrigoResponsavel é do tipo IAbrigoFrontend para acessar suas propriedades
  const abrigo = animal.abrigoResponsavel as IAbrigoFrontend;

  return (
    <div className="min-h-screen bg-purple-100 p-8">
      <div className="max-w-4xl mx-auto bg-white rounded-lg shadow-xl p-8">
        <h1 className="text-5xl font-extrabold text-purple-800 mb-6 text-center">
          {animal.nome}
        </h1>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
          {/* Galeria de Fotos */}
          <div className="md:col-span-1">
            {animal.fotos.length > 0 ? (
              <div className="space-y-4">
                {animal.fotos.map((foto, index) => (
                  <img
                    key={index}
                    src={foto}
                    alt={`${animal.nome} - Foto ${index + 1}`}
                    className="w-full h-auto rounded-lg shadow-md object-cover"
                    onError={(e) => {
                      const target = e.target as HTMLImageElement;
                      target.onerror = null;
                      target.src = 'https://placehold.co/600x400/CCCCCC/333333?text=Erro+ao+Carregar';
                    }}
                  />
                ))}
              </div>
              ) : (
                <img
                  src="https://placehold.co/600x400/CCCCCC/333333?text=Sem+Foto"
                  alt="Sem foto disponível"
                  className="w-full h-auto rounded-lg shadow-md object-cover"
                />
              )}
            </div>

            {/* Informações do Animal */}
            <div className="md:col-span-1 flex flex-col justify-between">
                <div>
                    <p className="text-gray-700 text-xl mb-3">
                        <span className="font-semibold text-purple-700">Espécie:</span> {animal.especie}
                    </p>
                    {animal.raca && (
                        <p className="text-gray-700 text-xl mb-3">
                            <span className="font-semibold text-purple-700">Raça:</span> {animal.raca}
                        </p>
                    )}
                    <p className="text-gray-700 text-xl mb-3">
                        <span className="font-semibold text-purple-700">Idade:</span> {animal.idade} anos
                    </p>
                    <p className="text-gray-700 text-xl mb-3">
                        <span className="font-semibold text-purple-700">Sexo:</span> {animal.sexo}
                    </p>
                    <p className="text-gray-800 text-lg leading-relaxed mb-6">
                        <span className="font-semibold text-purple-700">Descrição:</span> {animal.descricao}
                    </p>
                </div>

                {/* Informações do Abrigo Responsável */}
                {abrigo && (
                    <div className="bg-purple-50 p-6 rounded-lg shadow-inner mt-6">
                        <h3 className="text-2xl font-bold text-purple-700 mb-4">Abrigo Responsável</h3>
                        <p className="text-gray-700 text-lg mb-2">
                            <span className="font-semibold">Nome:</span> {abrigo.nome}
                        </p>
                        <p className="text-gray-700 text-lg mb-2">
                            <span className="font-semibold">E-mail:</span> {abrigo.email}
                        </p>
                        <p className="text-gray-700 text-lg">
                            <span className="font-semibold">Telefone:</span> {abrigo.telefone}
                        </p>
                        <p className="text-gray-700 text-lg mt-2">
                            <span className="font-semibold">Endereço:</span> {abrigo.endereco}
                        </p>
                    </div>
                )}
            </div>
        </div>

        <div className="text-center mt-8">
          <Link
            to="/animais"
            className="inline-block px-8 py-4 bg-gray-500 text-white font-semibold rounded-full shadow-md hover:bg-gray-700 transition duration-300 text-lg"
          >
            Voltar para a Lista de Animais
          </Link>
        </div>
      </div>
    </div>
  );
};

export default AnimalDetailPage;