import { Routes, Route, Link } from 'react-router-dom';

// Importa todos os componentes de página
import HomePage from './pages/HomePage';
import AnimalListPage from './pages/AnimalListPage';
import AnimalDetailPage from './pages/AnimalDetailPage';
import LoginPage from './pages/LoginPage';
import AbrigoAreaPage from './pages/AbrigoAreaPage';
import AdotanteAreaPage from './pages/AdotanteAreaPage';
import AdminAreaPage from './pages/AdminAreaPage';
import Layout from './components/Layout';

function App() {
  return (
    <Routes>
      {/* Todas as rotas agora usam o componente Layout */}
      <Route path="/" element={<Layout><HomePage /></Layout>} />
      <Route path="/animais" element={<Layout><AnimalListPage /></Layout>} />
      <Route path="/animais/:id" element={<Layout><AnimalDetailPage /></Layout>} />
      <Route path="/login" element={<Layout><LoginPage /></Layout>} />
      <Route path="/abrigo" element={<Layout><AbrigoAreaPage /></Layout>} />
      <Route path="/adotante" element={<Layout><AdotanteAreaPage /></Layout>} />
      <Route path="/admin" element={<Layout><AdminAreaPage /></Layout>} />
      {/* A rota 404 também pode usar o layout ou ter um estilo próprio */}
      <Route path="*" element={
        <Layout>
          <div className="flex flex-col items-center justify-center min-h-screen bg-red-200 p-4">
            <div className="bg-white p-8 rounded-lg shadow-lg text-center">
              <h1 className="text-4xl font-bold text-red-700 mb-4">404 - Página Não Encontrada</h1>
              <p className="text-gray-700 text-lg mb-6">A rota que você tentou acessar não existe.</p>
              <Link to="/" className="px-6 py-3 bg-gray-500 text-white font-semibold rounded-full shadow-md hover:bg-gray-700 transition duration-300">
                Voltar para Home
              </Link>
            </div>
          </div>
        </Layout>
      } />
    </Routes>
  );
}

export default App;
