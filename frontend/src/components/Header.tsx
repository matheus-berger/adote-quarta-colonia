import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/authHook';

const Header: React.FC = () => {
  const { authState, logout } = useAuth(); // Obtém o estado de autenticação e a função de logout
  const navigate = useNavigate();

  const handleLogout = () => {
    logout(); // Chama a função de logout do contexto
    navigate('/login'); // Redireciona para a página de login após o logout
  };

  return (
    <header className="bg-indigo-700 text-white p-4 shadow-md">
      <div className="container mx-auto flex justify-between items-center">
        <Link to="/" className="text-3xl font-bold hover:text-indigo-200 transition duration-300">
          🐾 Adote Quarta Colônia
        </Link>
        <nav>
          <ul className="flex space-x-6 items-center">
            <li>
              <Link to="/animais" className="text-lg font-semibold hover:text-indigo-200 transition duration-300">
                Animais
              </Link>
            </li>
            {authState.isAuthenticated ? (
              // Se o usuário estiver autenticado
              <>
                {authState.user?.role === 'abrigo' && (
                  <li>
                    <Link to="/abrigo" className="text-lg font-semibold hover:text-indigo-200 transition duration-300">
                      Minha Área (Abrigo)
                    </Link>
                  </li>
                )}
                {authState.user?.role === 'adotante' && (
                  <li>
                    <Link to="/adotante" className="text-lg font-semibold hover:text-indigo-200 transition duration-300">
                      Minha Área (Adotante)
                    </Link>
                  </li>
                )}
                {authState.user?.role === 'administrador' && (
                  <li>
                    <Link to="/admin" className="text-lg font-semibold hover:text-indigo-200 transition duration-300">
                      Admin
                    </Link>
                  </li>
                )}
                <li>
                  <button
                    onClick={handleLogout}
                    className="px-4 py-2 bg-red-500 text-white font-semibold rounded-full shadow-md hover:bg-red-600 transition duration-300 text-sm"
                  >
                    Sair ({authState.user?.email})
                  </button>
                </li>
              </>
            ) : (
              // Se o usuário NÃO estiver autenticado
              <li>
                <Link to="/login" className="px-4 py-2 bg-green-500 text-white font-semibold rounded-full shadow-md hover:bg-green-600 transition duration-300 text-sm">
                  Login / Cadastro
                </Link>
              </li>
            )}
          </ul>
        </nav>
      </div>
    </header>
  );
};

export default Header;
