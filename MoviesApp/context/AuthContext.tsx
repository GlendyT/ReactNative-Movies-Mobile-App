import { deleteSession } from '@/services/api';
import AsyncStorage from '@react-native-async-storage/async-storage';
import React, { createContext, useContext, useEffect, useState } from 'react';

interface User {
  id: number;
  username: string;
  name: string;
  include_adult: boolean;
  iso_639_1: string;
  iso_3166_1: string;
  avatar: {
    gravatar: {
      hash: string;
    };
    tmdb: {
      avatar_path: string | null;
    };
  };
}

interface AuthContextType {
  isAuthenticated: boolean;
  user: User | null;
  sessionId: string | null;
  accountId: number | null;
  login: (userData: User, sessionId: string) => Promise<void>;
  logout: () => Promise<void>;
  isLoading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState<User | null>(null);
  const [sessionId, setSessionId] = useState<string | null>(null);
  const [accountId, setAccountId] = useState<number | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Cargar datos de autenticación al iniciar la app
  useEffect(() => {
    loadAuthData();
  }, []);

  const loadAuthData = async () => {
    try {
      const storedSessionId = await AsyncStorage.getItem('tmdb_session_id');
      const storedUser = await AsyncStorage.getItem('tmdb_user');
    
      
      if (storedSessionId && storedUser) {
        const userData = JSON.parse(storedUser);
        setSessionId(storedSessionId);
        setUser(userData);
        setAccountId(userData.id);
        setIsAuthenticated(true);
      } else {
      }
    } catch (error) {
      console.error('Error loading auth data:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const login = async (userData: User, sessionId: string) => {
    try {
      // Guardar en AsyncStorage
      await AsyncStorage.setItem('tmdb_session_id', sessionId);
      await AsyncStorage.setItem('tmdb_user', JSON.stringify(userData));
      
      // Actualizar estado
      setIsAuthenticated(true);
      setUser(userData);
      setSessionId(sessionId);
      setAccountId(userData.id); // El account ID está en los datos del usuario
    } catch (error) {
      console.error('Error saving auth data:', error);
      throw error;
    }
  };

  const logout = async () => {
    try {
      // Eliminar sesión del servidor si existe
      if (sessionId) {
        try {
          await deleteSession(sessionId);
        } catch (error) {
          console.error('Error deleting session from server:', error);
          // Continúa con el logout local aunque falle el servidor
        }
      }
      
      // Limpiar AsyncStorage
      await AsyncStorage.removeItem('tmdb_session_id');
      await AsyncStorage.removeItem('tmdb_user');
      
      // Limpiar estado
      setIsAuthenticated(false);
      setUser(null);
      setSessionId(null);
      setAccountId(null);
    } catch (error) {
      console.error('Error during logout:', error);
      throw error;
    }
  };

  return (
    <AuthContext.Provider value={{ 
      isAuthenticated, 
      user, 
      sessionId, 
      accountId,
      login, 
      logout, 
      isLoading 
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
