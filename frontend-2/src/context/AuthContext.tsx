import React, { createContext, useContext, useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';
import axios from 'axios';
import { User } from '../types';

interface AuthContextType {
  user: User | null;
  session: any;
  loading: boolean;
  signUp: (email: string, password: string, userData: Partial<User>) => Promise<void>;
  signIn: (email: string, password: string) => Promise<void>;
  signOut: () => Promise<void>;
  updateProfile: (data: Partial<User>) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchSession = async () => {
      const { data } = await supabase.auth.getSession();
      setSession(data.session);
      
      if (data.session?.user) {
        try {
          // Fetch user profile from our backend
          const response = await axios.get('/api/users/profile', {
            headers: {
              Authorization: `Bearer ${data.session.access_token}`
            }
          });
          setUser(response.data);
        } catch (error) {
          console.error('Error fetching user profile:', error);
        }
      }
      
      setLoading(false);
    };

    fetchSession();

    const { data: authListener } = supabase.auth.onAuthStateChange(async (event, newSession) => {
      setSession(newSession);
      
      if (event === 'SIGNED_IN' && newSession) {
        try {
          const response = await axios.get('/api/users/profile', {
            headers: {
              Authorization: `Bearer ${newSession.access_token}`
            }
          });
          setUser(response.data);
        } catch (error) {
          console.error('Error fetching user profile:', error);
        }
      } else if (event === 'SIGNED_OUT') {
        setUser(null);
      }
    });

    return () => {
      authListener.subscription.unsubscribe();
    };
  }, []);

  const signUp = async (email: string, password: string, userData: Partial<User>) => {
    setLoading(true);
    try {
      const { data, error } = await supabase.auth.signUp({ email, password });
      
      if (error) throw error;
      
      if (data.user) {
        // Create user profile in our backend
        await axios.post('/api/users', {
          id: data.user.id,
          email: data.user.email,
          ...userData
        });
      }
    } catch (error) {
      console.error('Error signing up:', error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const signIn = async (email: string, password: string) => {
    setLoading(true);
    try {
      const { error } = await supabase.auth.signInWithPassword({ email, password });
      if (error) throw error;
    } catch (error) {
      console.error('Error signing in:', error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const signOut = async () => {
    try {
      await supabase.auth.signOut();
    } catch (error) {
      console.error('Error signing out:', error);
      throw error;
    }
  };

  const updateProfile = async (data: Partial<User>) => {
    if (!user) throw new Error('No user logged in');
    
    try {
      const response = await axios.put('/api/users/profile', data, {
        headers: {
          Authorization: `Bearer ${session.access_token}`
        }
      });
      setUser(response.data);
    } catch (error) {
      console.error('Error updating profile:', error);
      throw error;
    }
  };

  const value = {
    user,
    session,
    loading,
    signUp,
    signIn,
    signOut,
    updateProfile
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};