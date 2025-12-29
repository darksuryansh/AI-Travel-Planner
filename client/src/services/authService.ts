
import {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut,
  updateProfile,
  User as FirebaseUser,
} from 'firebase/auth';
import { auth } from '../config/firebase';
import { AuthResponse, LoginCredentials, SignupCredentials, User } from '../types/api';

/**
 * LOGIN USER
 * 
 * Signs in existing user with email and password.
 * 

 * 1. Firebase validates credentials
 * 2. Firebase returns user object with ID token
 * 3. extract user info and token
 * 4. Return formatted response
 * 
 
 @param credentials - { email, password }
 @returns { user, token } - User info and auth token
*/
 
export const login = async (credentials: LoginCredentials): Promise<AuthResponse> => {
  try {
    const { email, password } = credentials;
    
    console.log(' Logging in user:', email);
    
    // Firebase Authentication - validates and signs in
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    
    // Extract user from response
    const firebaseUser = userCredential.user;
    
    // Get ID token (JWT) - this is what we send to backend
    const token = await firebaseUser.getIdToken();
    
    console.log(' Login successful:', firebaseUser.email);
    
    // Return formatted response
    return {
      user: formatUser(firebaseUser),
      token,
    };
  } catch (error: any) {
    console.error(' Login error:', error.code, error.message);
    
    // Convert Firebase error codes to user-friendly messages
    const errorMessage = getAuthErrorMessage(error.code);
    throw new Error(errorMessage);
  }
};

/**
 * SIGNUP NEW USER
 * 
 * Creates a new user account with email and password.

 * 1. Firebase creates new user account
 * 2. Optionally set display name
 * 3. Get ID token
 * 4. Return user info and token
 * 
 * @param credentials - { email, password, displayName? }
 * @returns { user, token } - User info and auth token
 * 
 * ERRORS:
 * - "auth/email-already-in-use" → Email already registered
 * - "auth/weak-password" → Password too weak (< 6 chars)
 * - "auth/invalid-email" → Email format invalid
 */
export const signup = async (credentials: SignupCredentials): Promise<AuthResponse> => {
  try {
    const { email, password, displayName } = credentials;
    
    console.log(' Creating new user:', email);
    
    // Firebase Authentication - creates new account
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    
    const firebaseUser = userCredential.user;
    
    // Set display name if provided
    if (displayName) {
      await updateProfile(firebaseUser, { displayName });
      console.log('Display name set:', displayName);
    }
    
    // Get ID token
    const token = await firebaseUser.getIdToken();
    
    console.log(' Signup successful:', firebaseUser.email);
    
    return {
      user: formatUser(firebaseUser),
      token,
    };
  } catch (error: any) {
    console.error(' Signup error:', error.code, error.message);
    
    const errorMessage = getAuthErrorMessage(error.code);
    throw new Error(errorMessage);
  }
};

/**
 * LOGOUT USER
 * 
 * Signs out the current user.
 * 
 * PROCESS:
 * 1. Firebase clears session
 * 2. Tokens are invalidated
 * 3. auth.currentUser becomes null
 * 
 * RESULT:
 * - User is logged out
 * - Redirected to login page (handled by AuthContext)
 */
export const logout = async (): Promise<void> => {
  try {
    console.log('👋 Logging out user');
    await signOut(auth);
    console.log('✅ Logout successful');
  } catch (error: any) {
    console.error('❌ Logout error:', error);
    throw new Error('Failed to logout');
  }
};

/**
 * GET CURRENT USER TOKEN
 * 
 * Gets fresh ID token for current user.

 * - When you need to manually add token to a request
 * - Usually not needed (axios interceptor handles it)
 * 
 * @param forceRefresh - Force getting new token even if cached one is valid
 * @returns ID token string
 */
export const getCurrentUserToken = async (forceRefresh = false): Promise<string | null> => {
  try {
    const currentUser = auth.currentUser;
    
    if (!currentUser) {
      console.log('⚠️ No user logged in');
      return null;
    }
    
    const token = await currentUser.getIdToken(forceRefresh);
    console.log('🎫 Got user token');
    
    return token;
  } catch (error) {
    console.error('❌ Error getting token:', error);
    return null;
  }
};

/**
 * HELPER FUNCTION: Format Firebase User
 * 
 * Converts Firebase user object to our User interface.
 * Extracts only the fields we need.
 */
function formatUser(firebaseUser: FirebaseUser): User {
  return {
    uid: firebaseUser.uid,
    email: firebaseUser.email,
    displayName: firebaseUser.displayName || undefined,
    photoURL: firebaseUser.photoURL || undefined,
  };
}

/**
 * HELPER FUNCTION: Get User-Friendly Error Messages
 * 
 * Converts Firebase error codes to messages users can understand.
 */
function getAuthErrorMessage(errorCode: string): string {
  const errorMessages: Record<string, string> = {
    'auth/user-not-found': 'No account found with this email',
    'auth/wrong-password': 'Incorrect password',
    'auth/email-already-in-use': 'This email is already registered',
    'auth/weak-password': 'Password must be at least 6 characters',
    'auth/invalid-email': 'Invalid email address',
    'auth/too-many-requests': 'Too many failed attempts. Please try again later',
    'auth/network-request-failed': 'Network error. Please check your connection',
  };
  
  return errorMessages[errorCode] || 'Authentication failed. Please try again';
}
