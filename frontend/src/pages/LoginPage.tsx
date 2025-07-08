import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/authHook';


const LoginPage: React.FC = () => {
  const [email, setEmail] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [loginError, setLoginError] = useState<string | null>(null);
  const [isRegistering, setIsRegistering] = useState<boolean>(false); // Para alternar entre login e registro
  const [role, setRole] = useState<string>('adotante'); // Padrão para registro
  const [entityId, setEntityId] = useState<string>(''); // Para vincular ao Abrigo/Adotante
  const navigate = useNavigate();
  const { login, register, authState } = useAuth(); // Obtém as funções e o estado de autenticação

  const handleSubmitLogin = async (e: React.FormEvent) => {
      e.preventDefault();
      setLoginError(null);
      try {
          await login(email, password);
          navigate('/'); // Redireciona para a home ou dashboard após login
      } catch (err: any) {
          setLoginError(err.response?.data?.message || 'Erro ao fazer login. Tente novamente.');
      }
  };

  const handleSubmitRegister = async (e: React.FormEvent) => {
      e.preventDefault();
      setLoginError(null);
      try {
          await register(email, password, role, entityId || undefined); // entityId pode ser opcional
          navigate('/'); // Redireciona após registro
      } catch (err: any) {
          setLoginError(err.response?.data?.message || 'Erro ao registrar. Tente novamente.');
      }
  };

  // Se já estiver autenticado, redireciona
  if (authState.isAuthenticated && !authState.loading) {
      navigate('/');
      return null; // Não renderiza nada enquanto redireciona
  }

  if (authState.loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 p-4">
        <p className="text-xl text-gray-700">Carregando...</p>
      </div>
    );
}

return (
  <div className="flex flex-col items-center justify-center min-h-screen bg-yellow-100 p-4">
      <div className="bg-white p-8 rounded-lg shadow-lg w-full max-w-md">
          <h1 className="text-4xl font-bold text-yellow-600 mb-6 text-center">
              {isRegistering ? 'Cadastro' : 'Login'}
          </h1>

          {loginError && (
              <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-4" role="alert">
                  <strong className="font-bold">Erro!</strong>
                  <span className="block sm:inline"> {loginError}</span>
              </div>
          )}

          <form onSubmit={isRegistering ? handleSubmitRegister : handleSubmitLogin} className="space-y-4">
              <div>
                  <label htmlFor="email" className="block text-gray-700 text-sm font-bold mb-2">
                      E-mail:
                  </label>
                  <input
                      type="email"
                      id="email"
                      className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                      placeholder="seu@email.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                  />
              </div>
              <div>
                  <label htmlFor="password" className="block text-gray-700 text-sm font-bold mb-2">
                      Senha:
                  </label>
                  <input
                      type="password"
                      id="password"
                      className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 mb-3 leading-tight focus:outline-none focus:shadow-outline"
                      placeholder="********"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      required
                  />
              </div>

              {isRegistering && (
                  <>
                    <div>
                        <label htmlFor="role" className="block text-gray-700 text-sm font-bold mb-2">
                            Tipo de Usuário:
                        </label>
                        <select
                            id="role"
                            className="shadow border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                            value={role}
                            onChange={(e) => setRole(e.target.value)}
                            required
                        >
                            <option value="adotante">Adotante</option>
                            <option value="abrigo">Abrigo</option>
                            <option value="administrador">Administrador</option>
                        </select>
                    </div>
                    {(role === 'abrigo' || role === 'adotante') && (
                        <div>
                            <label htmlFor="entityId" className="block text-gray-700 text-sm font-bold mb-2">
                                ID da Entidade (Abrigo/Adotante):
                            </label>
                            <input
                                type="text"
                                id="entityId"
                                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                                placeholder="Cole o ID do Abrigo ou Adotante aqui"
                                value={entityId}
                                onChange={(e) => setEntityId(e.target.value)}
                                required={role !== 'administrador'} // Obrigatório para abrigo/adotante
                            />
                            <p className="text-xs text-gray-500 mt-1">
                                Este é o ID gerado pelo backend ao criar um Abrigo ou Adotante.
                            </p>
                        </div>
                      )}
                  </>
                )}

                <button
                    type="submit"
                    className={`w-full px-4 py-2 rounded-md font-semibold text-white transition duration-300 ${isRegistering ? 'bg-green-600 hover:bg-green-700' : 'bg-indigo-600 hover:bg-indigo-700'}`}
                    disabled={authState.loading}
                >
                    {authState.loading ? 'Processando...' : (isRegistering ? 'Registrar' : 'Entrar')}
                </button>
            </form>

            <div className="mt-6 text-center">
                <button
                    onClick={() => setIsRegistering(!isRegistering)}
                    className="text-indigo-600 hover:text-indigo-800 text-sm font-semibold transition duration-300"
                >
                    {isRegistering ? 'Já tem uma conta? Faça Login' : 'Não tem uma conta? Cadastre-se'}
                </button>
            </div>

            <div className="text-center mt-6">
                <Link to="/" className="text-gray-500 hover:text-gray-700 text-sm font-semibold transition duration-300">
                    Voltar para Home
                </Link>
            </div>
        </div>
    </div>
  );
};

export default LoginPage;