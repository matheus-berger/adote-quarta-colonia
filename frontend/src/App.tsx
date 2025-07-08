import { Link, Route, Routes } from 'react-router-dom';
import './index.css'; // Garanta que o index.css está sendo importado

// Componentes de placeholder para as páginas
const HomePage: React.FC = () => (
  <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 p-4">
    <div className="bg-white p-8 rounded-lg shadow-lg text-center">
      <h1 className="text-4xl font-bold text-indigo-600 mb-4">Página Inicial</h1>
      <p className="text-gray-700 text-lg mb-6">Bem-vindo ao Adote Quarta Colônia!</p>
      <nav className="flex gap-4 justify-center">
        <Link to="/animais" className="px-6 py-3 bg-indigo-500 text-white font-semibold rounded-full shadow-md hover:bg-indigo-700 transition duration-300">
          Ver Animais
        </Link>
        <Link to="/login" className="px-6 py-3 bg-green-500 text-white font-semibold rounded-full shadow-md hover:bg-green-700 transition duration-300">
          Login
        </Link>
      </nav>
    </div>
  </div>
);

const AnimalListPage: React.FC = () => (
  <div className="flex flex-col items-center justify-center min-h-screen bg-blue-100 p-4">
    <div className="bg-white p-8 rounded-lg shadow-lg text-center">
      <h1 className="text-4xl font-bold text-blue-600 mb-4">Lista de Animais</h1>
      <p className="text-gray-700 text-lg mb-6">Aqui você verá todos os animais disponíveis para adoção.</p>
      <Link to="/" className="px-6 py-3 bg-gray-500 text-white font-semibold rounded-full shadow-md hover:bg-gray-700 transition duration-300">
        Voltar para Home
      </Link>
    </div>
  </div>
);

const AnimalDetailPage: React.FC = () => (
  <div className="flex flex-col items-center justify-center min-h-screen bg-purple-100 p-4">
    <div className="bg-white p-8 rounded-lg shadow-lg text-center">
      <h1 className="text-4xl font-bold text-purple-600 mb-4">Detalhe do Animal</h1>
      <p className="text-gray-700 text-lg mb-6">Informações detalhadas sobre um animal específico.</p>
      <Link to="/animais" className="px-6 py-3 bg-gray-500 text-white font-semibold rounded-full shadow-md hover:bg-gray-700 transition duration-300">
        Voltar para Lista
      </Link>
    </div>
  </div>
);

const LoginPage: React.FC = () => (
  <div className="flex flex-col items-center justify-center min-h-screen bg-yellow-100 p-4">
    <div className="bg-white p-8 rounded-lg shadow-lg text-center">
      <h1 className="text-4xl font-bold text-yellow-600 mb-4">Login / Cadastro</h1>
      <p className="text-gray-700 text-lg mb-6">Acesse sua conta ou crie uma nova.</p>
      <Link to="/" className="px-6 py-3 bg-gray-500 text-white font-semibold rounded-full shadow-md hover:bg-gray-700 transition duration-300">
        Voltar para Home
      </Link>
    </div>
  </div>
);

const ShelterAreaPage: React.FC = () => (
  <div className="flex flex-col items-center justify-center min-h-screen bg-red-100 p-4">
    <div className="bg-white p-8 rounded-lg shadow-lg text-center">
      <h1 className="text-4xl font-bold text-red-600 mb-4">Área do Abrigo</h1>
      <p className="text-gray-700 text-lg mb-6">Gerencie seus animais e adoções.</p>
      <Link to="/" className="px-6 py-3 bg-gray-500 text-white font-semibold rounded-full shadow-md hover:bg-gray-700 transition duration-300">
        Voltar para Home
      </Link>
    </div>
  </div>
);

const AdopterAreaPage: React.FC = () => (
  <div className="flex flex-col items-center justify-center min-h-screen bg-green-100 p-4">
    <div className="bg-white p-8 rounded-lg shadow-lg text-center">
      <h1 className="text-4xl font-bold text-green-600 mb-4">Área do Adotante</h1>
      <p className="text-gray-700 text-lg mb-6">Visualize suas adoções e perfil.</p>
      <Link to="/" className="px-6 py-3 bg-gray-500 text-white font-semibold rounded-full shadow-md hover:bg-gray-700 transition duration-300">
        Voltar para Home
      </Link>
    </div>
  </div>
);

const AdminAreaPage: React.FC = () => (
  <div className="flex flex-col items-center justify-center min-h-screen bg-orange-100 p-4">
    <div className="bg-white p-8 rounded-lg shadow-lg text-center">
      <h1 className="text-4xl font-bold text-orange-600 mb-4">Área de Administração</h1>
      <p className="text-gray-700 text-lg mb-6">Gerencie todo o sistema.</p>
      <Link to="/" className="px-6 py-3 bg-gray-500 text-white font-semibold rounded-full shadow-md hover:bg-gray-700 transition duration-300">
        Voltar para Home
      </Link>
    </div>
  </div>
);


function App() {
  return (
    <Routes>
      <Route path="/" element={<HomePage />} />
      <Route path="/animais" element={<AnimalListPage />} />
      <Route path="/animais/:id" element={<AnimalDetailPage />} />
      <Route path="/login" element={<LoginPage />} />
      <Route path="/abrigo" element={<ShelterAreaPage />} />
      <Route path="/adotante" element={<AdopterAreaPage />} />
      <Route path="/admin" element={<AdminAreaPage />} />
      {/* Rota para 404 - Página Não Encontrada */}
      <Route path="*" element={
        <div className="flex flex-col items-center justify-center min-h-screen bg-red-200 p-4">
          <div className="bg-white p-8 rounded-lg shadow-lg text-center">
            <h1 className="text-4xl font-bold text-red-700 mb-4">404 - Página Não Encontrada</h1>
            <p className="text-gray-700 text-lg mb-6">A rota que você tentou acessar não existe.</p>
            <Link to="/" className="px-6 py-3 bg-gray-500 text-white font-semibold rounded-full shadow-md hover:bg-gray-700 transition duration-300">
              Voltar para Home
            </Link>
          </div>
        </div>
      } />
    </Routes>
  );
}

export default App;
