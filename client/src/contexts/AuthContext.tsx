import { createContext, useContext, useEffect, useState, ReactNode } from 'react';

// Placeholder auth context until Firebase is fully integrated
interface User {
  uid: string;
  email: string | null;
  displayName: string | null;
  photoURL: string | null;
}

interface AuthContextType {
  user: User | null;
  loading: boolean;
  token: string | null;
  signInWithGoogle: () => Promise<void>;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Placeholder - Firebase initialization would go here
    // For now, we'll work without authentication
    setLoading(false);
  }, []);

  const signInWithGoogle = async () => {
    // Placeholder - Firebase Google Sign-In would go here
    console.log('Google Sign-In not yet implemented');
  };

  const signOut = async () => {
    // Placeholder - Firebase Sign-Out would go here
    setUser(null);
    setToken(null);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        token,
        signInWithGoogle,
        signOut,
      }}
    >
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
