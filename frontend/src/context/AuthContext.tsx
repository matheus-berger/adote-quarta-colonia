import React, { createContext, useState, useEffect, type ReactNode } from 'react';
import api from '../services/api';
import type { IUserFrontend } from '../types/model';

// Define a interface para o estado de autenticação
interface AuthState {
  token: string | null;
  user: IUserFrontend | null;
  isAuthenticated: boolean;
  loading: boolean;
  error: string | null;
}

// Define a interface para as ações de autenticação
export interface AuthContextType {
  authState: AuthState;
  login: (email: string, password: string) => Promise<void>;
  register: (email: string, password: string, role: string, entityId?: string) => Promise<void>;
  logout: () => void;
  checkAuth: () => Promise<void>; // Função para verificar autenticação ao carregar a aplicação
}

// Cria o contexto com um valor inicial padrão
const AuthContext = createContext<AuthContextType | undefined>(undefined);

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [authState, setAuthState] = useState<AuthState>({
    token: localStorage.getItem('token'), // Tenta carregar o token do localStorage
    user: null,
    isAuthenticated: false,
    loading: true, // Começa como true para verificar a autenticação inicial
    error: null,
  });

  // Função para verificar a autenticação do usuário
  const checkAuth = async () => {
    const token = localStorage.getItem('token');
    if (token) {
      // Configura o token no Axios para a requisição de verificação
      api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
      try {
        const response = await api.get('/auth/me'); // Rota protegida para obter dados do usuário
        setAuthState({
          token,
          user: response.data.user,
          isAuthenticated: true,
          loading: false,
          error: null,
        });
      } catch (err: any) {
        console.error('Erro ao verificar autenticação:', err);
        localStorage.removeItem('token'); // Remove token inválido
        setAuthState({
          token: null,
          user: null,
          isAuthenticated: false,
          loading: false,
          error: 'Sessão expirada ou inválida. Por favor, faça login novamente.',
        });
      }
    } else {
      setAuthState((prev) => ({ ...prev, loading: false })); // Não há token, não está autenticado
    }
  };

  // Efeito para verificar a autenticação ao carregar a aplicação
  useEffect(() => {
    checkAuth();
  }, []);

  // Função de login
  const login = async (email: string, password: string) => {
    setAuthState((prev) => ({ ...prev, loading: true, error: null }));
    try {
      const response = await api.post('/auth/login', { email, password });
      const { token, user } = response.data;
      localStorage.setItem('token', token); // Armazena o token
      setAuthState({
        token,
        user,
        isAuthenticated: true,
        loading: false,
        error: null,
      });
      api.defaults.headers.common['Authorization'] = `Bearer ${token}`; // Configura o token para futuras requisições
    } catch (err: unknown) {
      console.error('Erro no login:', err);
      localStorage.removeItem('token');
      setAuthState({
        token: null,
        user: null,
        isAuthenticated: false,
        loading: false,
        error: err.response?.data?.message || 'Erro ao fazer login. Verifique suas credenciais.',
      });
      throw err; // Rejeita a Promise para que o componente possa lidar com o erro
    }
  };

  // Função de registro
  const register = async (email: string, password: string, role: string, entityId?: string) => {
    setAuthState((prev) => ({ ...prev, loading: true, error: null }));
    try {
      const response = await api.post('/auth/register', { email, password, role, entityId });
      const { token, user } = response.data;
      localStorage.setItem('token', token); // Armazena o token
      setAuthState({
          token,
          user,
          isAuthenticated: true,
          loading: false,
          error: null,
      });
      api.defaults.headers.common['Authorization'] = `Bearer ${token}`; // Configura o token para futuras requisições
    } catch (err: any) {
      console.error('Erro no registro:', err);
      localStorage.removeItem('token');
      setAuthState({
        token: null,
        user: null,
        isAuthenticated: false,
        loading: false,
        error: err.response?.data?.message || 'Erro ao registrar. Tente novamente.',
      });
      throw err; // Rejeita a Promise para que o componente possa lidar com o erro
    }
  };

  // Função de logout
  const logout = () => {
    localStorage.removeItem('token');
    delete api.defaults.headers.common['Authorization']; // Remove o token do Axios
    setAuthState({
      token: null,
      user: null,
      isAuthenticated: false,
      loading: false,
      error: null,
    });
  };

  return (
    <AuthContext.Provider value={{ authState, login, register, logout, checkAuth }}>
      {children}
    </AuthContext.Provider>
  );

};

// Exporta o contexto real e seu tipo para ser usado pelo useAuth.ts
export { AuthContext };
