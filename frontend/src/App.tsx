import React from 'react';
import { Routes, Route, Link } from 'react-router-dom';

// Importa os componentes de página criados
import AnimalListPage from './pages/AnimalListPage';
import AnimalDetailPage from './pages/AnimalDetailPage';


// Componente de placeholder para a Página Inicial (se ainda não tiver um arquivo separado)
// Se você já moveu para src/pages/HomePage.tsx, pode remover esta definição aqui.
// Por enquanto, vamos mantê-lo aqui para garantir que a HomePage funcione.
const HomePagePlaceholder: React.FC = () => (
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

// O componente App principal com as rotas
function App() {
  return (
    <Routes>
      <Route path="/" element={<HomePagePlaceholder />} /> {/* Usamos o placeholder por enquanto */}
      <Route path="/animais" element={<AnimalListPage />} />
      <Route path="/animais/:id" element={<AnimalDetailPage />} />
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
