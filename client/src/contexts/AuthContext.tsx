

import { createContext, useContext, useState, useEffect, type ReactNode } from 'react';
import { onAuthStateChanged, User as FirebaseUser } from 'firebase/auth';
import { auth } from '../config/firebase';
import { login as loginService, signup as signupService, logout as logoutService } from '../services/authService';
import { User, LoginCredentials, SignupCredentials } from '../types/api';

interface AuthContextType {
  user: User | null;                                    // Current logged-in user 
  loading: boolean;                                      // Is auth state loading?
  login: (credentials: LoginCredentials) => Promise<void>;    // Login function
  signup: (credentials: SignupCredentials) => Promise<void>;  // Signup function
  logout: () => Promise<void>;                          // Logout function
}


const AuthContext = createContext<AuthContextType | undefined>(undefined);


export const AuthProvider = ({ children }: { children: ReactNode }) => {
  
  // STATE
  const [user, setUser] = useState<User | null>(null);      // Current user
  const [loading, setLoading] = useState(true);             // Loading state
  

  useEffect(() => {
    console.log('🔍 Setting up auth state listener');
    
    // Subscribe to auth state changes
    const unsubscribe = onAuthStateChanged(auth, (firebaseUser: FirebaseUser | null) => {
      
      if (firebaseUser) {
        // User is logged in
        console.log('✅ User logged in:', firebaseUser.email);
        
        // Convert Firebase user to our User interface
        setUser({
          uid: firebaseUser.uid,
          email: firebaseUser.email,
          displayName: firebaseUser.displayName || undefined,
          photoURL: firebaseUser.photoURL || undefined,
        });
        
      } else {
        // User is logged out
        console.log('👋 User logged out');
        setUser(null);
      }
      
      // Done loading
      console.log('✅ Auth state loaded, setting loading to false');
      setLoading(false);
    }, (error) => {
      // Handle Firebase initialization errors
      console.error('❌ Firebase auth error:', error);
      setLoading(false); // Stop loading even on error
    });
    
    // Cleanup: Unsubscribe when component unmounts
    return () => {
      console.log('🔌 Removing auth state listener');
      unsubscribe();
    };
  }, []); // Empty dependency array = run once on mount
  
  /**
   * LOGIN FUNCTION
   * 
   * Calls login service and updates state.
   * onAuthStateChanged will automatically update user state.
   */
  const login = async (credentials: LoginCredentials) => {
    try {
      console.log('🔑 AuthContext: Logging in...');
      await loginService(credentials);
      // No need to setUser here - onAuthStateChanged will handle it
      console.log('✅ AuthContext: Login successful');
    } catch (error) {
      console.error('❌ AuthContext: Login failed:', error);
      throw error; // Re-throw so component can handle it
    }
  };
  
  /**
   * SIGNUP FUNCTION
   * 
   * Calls signup service and updates state.
   * onAuthStateChanged will automatically update user state.
   */
  const signup = async (credentials: SignupCredentials) => {
    try {
      console.log('📝 AuthContext: Signing up...');
      await signupService(credentials);
      // No need to setUser here - onAuthStateChanged will handle it
      console.log('✅ AuthContext: Signup successful');
    } catch (error) {
      console.error('❌ AuthContext: Signup failed:', error);
      throw error;
    }
  };
  
  /**
   * LOGOUT FUNCTION
   * 
   * Calls logout service and clears state.
   * onAuthStateChanged will automatically set user to null.
   */
  const logout = async () => {
    try {
      console.log('👋 AuthContext: Logging out...');
      await logoutService();
      // No need to setUser(null) here - onAuthStateChanged will handle it
      console.log('✅ AuthContext: Logout successful');
    } catch (error) {
      console.error('❌ AuthContext: Logout failed:', error);
      throw error;
    }
  };
  
  /**
   * CONTEXT VALUE
   * 
   * This is what components get when they call useAuth()
   */
  const value: AuthContextType = {
    user,
    loading,
    login,
    signup,
    logout,
  };
  
  /**
   * RENDER
   * 
   * Show loading state while checking auth
   * Then provide context to children
   */
  if (loading) {
    console.log('⏳ AuthContext is loading...');
    return (
      <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 dark:from-slate-950 dark:via-blue-950 dark:to-indigo-950">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600 dark:text-gray-400">Loading...</p>
        </div>
      </div>
    );
  }
  
  console.log('✅ AuthContext loaded, rendering app with user:', user?.email || 'not logged in');
  
  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

/**
 * CUSTOM HOOK: useAuth
 * 
 * Easy way for components to access auth context.
 * 
 * USAGE:
 * const { user, login, logout } = useAuth();
 * 
 * if (user) {
 *   // User is logged in
 * }
 */
export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  
  return context;
};
