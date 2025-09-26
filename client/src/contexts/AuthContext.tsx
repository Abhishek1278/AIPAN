import { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { User as FirebaseUser, onAuthStateChanged } from 'firebase/auth';
import { auth, signInWithGoogle, signInWithEmail, signUpWithEmail, signOutUser, createUserProfile, getUserProfile, handleRedirectResult } from '@/lib/firebase';
import type { AuthContextType, User } from '@/types';

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider = ({ children }: AuthProviderProps) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Handle redirect result on page load
    handleRedirectResult().then((result) => {
      if (result?.user) {
        createUserProfile(result.user);
      }
    });

    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser: FirebaseUser | null) => {
      if (firebaseUser) {
        const userProfile = await getUserProfile(firebaseUser.uid);
        setUser(userProfile);
      } else {
        setUser(null);
      }
      setLoading(false);
    });

    return unsubscribe;
  }, []);

  const handleSignInWithGoogle = async () => {
    try {
      await signInWithGoogle();
    } catch (error) {
      console.error('Error signing in with Google:', error);
      throw error;
    }
  };

  const handleSignInWithEmail = async (email: string, password: string) => {
    try {
      const result = await signInWithEmail(email, password);
      if (result.user) {
        await createUserProfile(result.user);
      }
    } catch (error) {
      console.error('Error signing in with email:', error);
      throw error;
    }
  };

  const handleSignUpWithEmail = async (email: string, password: string) => {
    try {
      const result = await signUpWithEmail(email, password);
      if (result.user) {
        await createUserProfile(result.user);
      }
    } catch (error) {
      console.error('Error signing up with email:', error);
      throw error;
    }
  };

  const handleSignOut = async () => {
    try {
      await signOutUser();
    } catch (error) {
      console.error('Error signing out:', error);
      throw error;
    }
  };

  const value: AuthContextType = {
    user,
    loading,
    signInWithGoogle: handleSignInWithGoogle,
    signInWithEmail: handleSignInWithEmail,
    signUpWithEmail: handleSignUpWithEmail,
    signOut: handleSignOut,
    isAdmin: user?.isAdmin || false,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};
