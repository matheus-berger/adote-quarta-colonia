import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/authHook';
import type { IAbrigoFrontend, IAnimalFrontend } from '../types/model';
import api from '../services/api';

const AbrigoAreaPage: React.FC = () => {
  const { authState } = useAuth();
  const navigate = useNavigate();
  const [abrigoData, setAbrigoData] = useState<IAbrigoFrontend | null>(null);
  const [animaisDoAbrigo, setAnimaisDoAbrigo] = useState<IAnimalFrontend[]>([]);
  const [loadingData, setLoadingData] = useState<boolean>(true);
  const [errorData, setErrorData] = useState<string | null>(null);

  // Estados para o formulário de animal
  const [isEditing, setIsEditing] = useState<boolean>(false);
  const [currentAnimal, setCurrentAnimal] = useState<IAnimalFrontend | null>(null);
  const [formNome, setFormNome] = useState<string>('');
  const [formEspecie, setFormEspecie] = useState<'cachorro' | 'gato'>('cachorro');
  const [formRaca, setFormRaca] = useState<string>('');
  const [formIdade, setFormIdade] = useState<number>(0);
  const [formSexo, setFormSexo] = useState<'Macho' | 'Fêmea'>('Macho');
  const [formDescricao, setFormDescricao] = useState<string>('');
  const [formFotos, setFormFotos] = useState<string>(''); // String de URLs separadas por vírgula
  const [formError, setFormError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

  // Efeito para redirecionar se o usuário não for um abrigo
  useEffect(() => {
    if (!authState.loading && (!authState.isAuthenticated || authState.user?.role !== 'abrigo')) {
      navigate('/login');
    }
  }, [authState, navigate]);

  // Efeito para buscar os dados do abrigo e seus animais
  useEffect(() => {
    const fetchData = async () => {
      if (authState.isAuthenticated && authState.user?.role === 'abrigo' && authState.user?.entityId) {
        try {
          setLoadingData(true);
          setErrorData(null);

          // Busca dados do abrigo
          const abrigoResponse = await api.get(`/abrigos/${authState.user.entityId}`);
          setAbrigoData(abrigoResponse.data);

          // Busca animais associados a este abrigo
          const animaisResponse = await api.get(`/animais?abrigo=${authState.user.entityId}`);
          setAnimaisDoAbrigo(animaisResponse.data);

        } catch (err: any) {
          console.error('Erro ao buscar dados da área do abrigo:', err);
          setErrorData('Não foi possível carregar os dados do abrigo ou seus animais.');
        } finally {
          setLoadingData(false);
        }
      } else if (!authState.loading) { // Se não for abrigo e não estiver carregando, para de carregar
        setLoadingData(false);
      }
    };

    fetchData();
  }, [authState.isAuthenticated, authState.user, authState.loading]); // Depende do estado de autenticação

  // Função para resetar o formulário
  const resetForm = () => {
    setIsEditing(false);
    setCurrentAnimal(null);
    setFormNome('');
    setFormEspecie('cachorro');
    setFormRaca('');
    setFormIdade(0);
    setFormSexo('Macho');
    setFormDescricao('');
    setFormFotos('');
    setFormError(null);
  };

  // Função para preencher o formulário para edição
  const handleEditClick = (animal: IAnimalFrontend) => {
    setIsEditing(true);
    setCurrentAnimal(animal);
    setFormNome(animal.nome);
    setFormEspecie(animal.especie);
    setFormRaca(animal.raca || '');
    setFormIdade(animal.idade);
    setFormSexo(animal.sexo);
    setFormDescricao(animal.descricao);
    setFormFotos(animal.fotos.join(', ')); // Converte array de fotos para string
    setFormError(null);
    window.scrollTo({ top: 0, behavior: 'smooth' }); // Rola para o topo para ver o formulário
  };

  // Função para lidar com a submissão do formulário (criar ou editar animal)
  const handleSubmitAnimal = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError(null);
    setIsSubmitting(true);

    // Validação básica do formulário
    if (!formNome || !formDescricao || formIdade < 0 || !formFotos) {
      setFormError('Por favor, preencha todos os campos obrigatórios e forneça pelo menos uma foto.');
      setIsSubmitting(false);
      return;
    }

    const fotosArray = formFotos.split(',').map(url => url.trim()).filter(url => url);

    if (fotosArray.length === 0) {
        setFormError('Por favor, forneça pelo menos uma URL de foto válida.');
        setIsSubmitting(false);
        return;
    }

    const animalData = {
      nome: formNome,
      especie: formEspecie,
      raca: formRaca,
      idade: formIdade,
      sexo: formSexo,
      descricao: formDescricao,
      fotos: fotosArray,
      abrigoResponsavel: authState.user?.entityId, // ID do abrigo logado
    };

    try {
      let response;
      if (isEditing && currentAnimal) {
        // Atualizar animal
        response = await api.put(`/animais/${currentAnimal._id}`, animalData);
        setAnimaisDoAbrigo(prevAnimais =>
          prevAnimais.map(animal =>
            animal._id === currentAnimal._id ? response.data : animal
          )
        );
      } else {
        // Criar novo animal
        response = await api.post('/animais', animalData);
        setAnimaisDoAbrigo(prevAnimais => [...prevAnimais, response.data]);
      }
      resetForm(); // Limpa o formulário após sucesso
    } catch (err: any) {
      console.error('Erro ao salvar animal:', err);
      setFormError(err.response?.data?.message || 'Erro ao salvar animal. Verifique os dados.');
    } finally {
      setIsSubmitting(false);
    }
  };

  // Função para lidar com a exclusão de animal
  const handleDeleteAnimal = async (animalId: string) => {
    if (window.confirm('Tem certeza que deseja excluir este animal?')) {
      try {
        await api.delete(`/animais/${animalId}`);
        setAnimaisDoAbrigo(prevAnimais => prevAnimais.filter(animal => animal._id !== animalId));
      } catch (err: any) {
        console.error('Erro ao excluir animal:', err);
        setFormError(err.response?.data?.message || 'Erro ao excluir animal.');
      }
    }
  };

  // Renderização condicional para estados de carregamento e erro
  if (authState.loading || loadingData) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 p-4">
        <p className="text-xl text-gray-700">Carregando área do abrigo...</p>
      </div>
    );
  }

  if (errorData) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-red-100 p-4">
        <div className="bg-white p-8 rounded-lg shadow-lg text-center">
          <h1 className="text-4xl font-bold text-red-600 mb-4">Erro na Área do Abrigo</h1>
          <p className="text-gray-700 text-lg mb-6">{errorData}</p>
          <Link to="/" className="px-6 py-3 bg-gray-500 text-white font-semibold rounded-full shadow-md hover:bg-gray-700 transition duration-300">
            Voltar para Home
          </Link>
        </div>
      </div>
    );
  }

  // Se o usuário não for um abrigo (e já passou do loading), redireciona
  if (!authState.isAuthenticated || authState.user?.role !== 'abrigo') {
    return null; // O useEffect já redirecionou, então não renderiza nada
  }

  return (
    <div className="min-h-screen bg-red-100 p-8">
      <div className="max-w-7xl mx-auto bg-white rounded-lg shadow-xl p-8">
        <h1 className="text-5xl font-extrabold text-red-800 mb-6 text-center">
          Área do Abrigo: {abrigoData?.nome || 'Carregando...'}
        </h1>
        <p className="text-gray-700 text-lg mb-4 text-center">
          Bem-vindo, {authState.user?.email}! Gerencie seus animais.
        </p>

        {/* Detalhes do Abrigo */}
        {abrigoData ? (
          <div className="text-left mt-6 p-4 border rounded-lg bg-red-50 mb-8">
            <h2 className="text-2xl font-semibold text-red-700 mb-3">Detalhes do Seu Abrigo:</h2>
            <p className="text-gray-800 text-lg mb-2"><span className="font-bold">Endereço:</span> {abrigoData.endereco}</p>
            <p className="text-gray-800 text-lg mb-2"><span className="font-bold">Telefone:</span> {abrigoData.telefone}</p>
            <p className="text-gray-800 text-lg mb-2"><span className="font-bold">E-mail:</span> {abrigoData.email}</p>
            <p className="text-gray-800 text-lg"><span className="font-bold">Cadastrado em:</span> {new Date(abrigoData.createdAt).toLocaleDateString()}</p>
          </div>
        ) : (
          <p className="text-gray-600 text-lg mt-6 text-center">Nenhum dado de abrigo encontrado para este usuário.</p>
        )}

        {/* Formulário de Adicionar/Editar Animal */}
        <div className="mt-10 p-6 border rounded-lg shadow-md bg-white">
          <h2 className="text-3xl font-bold text-red-700 mb-6 text-center">
            {isEditing ? 'Editar Animal' : 'Adicionar Novo Animal'}
          </h2>
          {formError && (
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-4" role="alert">
              <strong className="font-bold">Erro!</strong>
              <span className="block sm:inline"> {formError}</span>
            </div>
          )}
          <form onSubmit={handleSubmitAnimal} className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label htmlFor="nome" className="block text-gray-700 text-sm font-bold mb-2">
                Nome:
              </label>
              <input
                type="text"
                id="nome"
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                value={formNome}
                onChange={(e) => setFormNome(e.target.value)}
                required
              />
            </div>
            <div>
              <label htmlFor="especie" className="block text-gray-700 text-sm font-bold mb-2">
                Espécie:
              </label>
              <select
                id="especie"
                className="shadow border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                value={formEspecie}
                onChange={(e) => setFormEspecie(e.target.value as 'cachorro' | 'gato')}
                required
              >
                <option value="cachorro">Cachorro</option>
                <option value="gato">Gato</option>
              </select>
            </div>
            <div>
              <label htmlFor="raca" className="block text-gray-700 text-sm font-bold mb-2">
                Raça (Opcional):
              </label>
              <input
                type="text"
                id="raca"
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                value={formRaca}
                onChange={(e) => setFormRaca(e.target.value)}
              />
            </div>
            <div>
              <label htmlFor="idade" className="block text-gray-700 text-sm font-bold mb-2">
                Idade (anos):
              </label>
              <input
                type="number"
                id="idade"
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                value={formIdade}
                onChange={(e) => setFormIdade(parseInt(e.target.value) || 0)}
                min="0"
                required
              />
            </div>
            <div>
              <label htmlFor="sexo" className="block text-gray-700 text-sm font-bold mb-2">
                Sexo:
              </label>
              <select
                id="sexo"
                className="shadow border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                value={formSexo}
                onChange={(e) => setFormSexo(e.target.value as 'Macho' | 'Fêmea')}
                required
              >
                <option value="Macho">Macho</option>
                <option value="Fêmea">Fêmea</option>
              </select>
            </div>
            <div className="md:col-span-2">
              <label htmlFor="descricao" className="block text-gray-700 text-sm font-bold mb-2">
                Descrição:
              </label>
              <textarea
                id="descricao"
                rows={4}
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                value={formDescricao}
                onChange={(e) => setFormDescricao(e.target.value)}
                required
              ></textarea>
            </div>
            <div className="md:col-span-2">
              <label htmlFor="fotos" className="block text-gray-700 text-sm font-bold mb-2">
                URLs das Fotos (separadas por vírgula):
              </label>
              <input
                type="text"
                id="fotos"
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                placeholder="https://foto1.com/img.jpg, https://foto2.com/img.png"
                value={formFotos}
                onChange={(e) => setFormFotos(e.target.value)}
                required
              />
              <p className="text-xs text-gray-500 mt-1">
                Insira URLs válidas, separadas por vírgula. Pelo menos uma é obrigatória.
              </p>
            </div>
            <div className="md:col-span-2 flex justify-end gap-4">
              <button
                type="submit"
                className="px-6 py-3 bg-red-600 text-white font-semibold rounded-full shadow-md hover:bg-red-700 transition duration-300"
                disabled={isSubmitting}
              >
                {isSubmitting ? 'Salvando...' : (isEditing ? 'Salvar Alterações' : 'Adicionar Animal')}
              </button>
              {isEditing && (
                <button
                  type="button"
                  onClick={resetForm}
                  className="px-6 py-3 bg-gray-500 text-white font-semibold rounded-full shadow-md hover:bg-gray-600 transition duration-300"
                  disabled={isSubmitting}
                >
                  Cancelar Edição
                </button>
              )}
            </div>
          </form>
        </div>

        {/* Lista de Animais do Abrigo */}
        <div className="mt-12">
          <h2 className="text-3xl font-bold text-red-700 mb-6 text-center">Meus Animais</h2>
          {animaisDoAbrigo.length === 0 ? (
            <p className="text-gray-600 text-lg text-center">Você ainda não cadastrou nenhum animal.</p>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
              {animaisDoAbrigo.map((animal) => (
                <div key={animal._id} className="bg-white rounded-lg shadow-xl overflow-hidden transform transition duration-300 hover:scale-105">
                  <img
                    src={animal.fotos[0] || 'https://placehold.co/600x400/CCCCCC/333333?text=Sem+Foto'}
                    alt={animal.nome}
                    className="w-full h-64 object-cover"
                    onError={(e) => {
                        const target = e.target as HTMLImageElement;
                        target.onerror = null;
                        target.src = 'https://placehold.co/600x400/CCCCCC/333333?text=Erro+ao+Carregar';
                    }}
                  />
                  <div className="p-6">
                    <h3 className="text-2xl font-bold text-gray-900 mb-2">{animal.nome}</h3>
                    <p className="text-gray-600 text-md mb-1"><span className="font-semibold">Espécie:</span> {animal.especie}</p>
                    {animal.raca && <p className="text-gray-600 text-md mb-1"><span className="font-semibold">Raça:</span> {animal.raca}</p>}
                    <p className="text-gray-600 text-md mb-1"><span className="font-semibold">Idade:</span> {animal.idade} anos</p>
                    <p className="text-gray-600 text-md mb-4"><span className="font-semibold">Sexo:</span> {animal.sexo}</p>
                    <div className="flex justify-between items-center gap-2 mt-4">
                      <Link
                        to={`/animais/${animal._id}`}
                        className="flex-1 text-center px-4 py-2 bg-indigo-600 text-white font-semibold rounded-md shadow-md hover:bg-indigo-700 transition duration-300 text-sm"
                      >
                        Ver Detalhes
                      </Link>
                      <button
                        onClick={() => handleEditClick(animal)}
                        className="flex-1 px-4 py-2 bg-yellow-500 text-white font-semibold rounded-md shadow-md hover:bg-yellow-600 transition duration-300 text-sm"
                      >
                        Editar
                      </button>
                      <button
                        onClick={() => handleDeleteAnimal(animal._id)}
                        className="flex-1 px-4 py-2 bg-red-500 text-white font-semibold rounded-md shadow-md hover:bg-red-600 transition duration-300 text-sm"
                      >
                        Excluir
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="text-center mt-12">
          <Link to="/" className="inline-block px-8 py-4 bg-gray-500 text-white font-semibold rounded-full shadow-md hover:bg-gray-700 transition duration-300 text-lg">
            Voltar para Home
          </Link>
        </div>
      </div>
    </div>
  );
};


export default AbrigoAreaPage;