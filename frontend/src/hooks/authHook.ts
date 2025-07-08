// src/hooks/useAuth.ts

import { useContext } from 'react';
import { AuthContext, type AuthContextType } from '../context/AuthContext';

// Hook customizado para usar o contexto de autenticação
export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth deve ser usado dentro de um AuthProvider');
  }
  return context;
};