import { createContext, useContext, useEffect, useState, ReactNode } from 'react';

interface User {
  id: string;
  email: string;
  name: string;
}

interface AuthContextType {
  user: User | null;
  loading: boolean;
  signIn: (email: string, password: string) => Promise<void>;
  signUp: (email: string, password: string, name: string) => Promise<void>;
  signInWithGoogle: () => Promise<void>;
  logOut: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const MOCK_USER: User = {
  id: 'local-user',
  email: 'pierre@local.dev',
  name: 'Pierre'
};

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check local storage for auth
    const stored = localStorage.getItem('bonne-nuit-user');
    if (stored) {
      setUser(JSON.parse(stored));
    }
    setLoading(false);
  }, []);

  const signIn = async (email: string, password: string) => {
    // Mock auth - accept any credentials for testing
    const user = { ...MOCK_USER, email };
    localStorage.setItem('bonne-nuit-user', JSON.stringify(user));
    setUser(user);
  };

  const signUp = async (email: string, password: string, name: string) => {
    const user = { id: 'local-user', email, name };
    localStorage.setItem('bonne-nuit-user', JSON.stringify(user));
    setUser(user);
  };

  const signInWithGoogle = async () => {
    localStorage.setItem('bonne-nuit-user', JSON.stringify(MOCK_USER));
    setUser(MOCK_USER);
  };

  const logOut = () => {
    localStorage.removeItem('bonne-nuit-user');
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, loading, signIn, signUp, signInWithGoogle, logOut }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
