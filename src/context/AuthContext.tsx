import React, { createContext, useContext, useState, useEffect, useCallback, ReactNode } from 'react';
import { UserProfile, SavedAddress } from '../types';
import {
  apiLogin,
  apiRegister,
  apiLogout,
  apiGetStoredSession,
  apiGetAddresses,
  apiSaveAddress,
  apiDeleteAddress,
  apiUpdateProfile
} from '../services/supabase';
import { useToast } from './ToastContext';

interface AuthContextType {
  user: UserProfile | null;
  loading: boolean;
  addresses: SavedAddress[];
  login: (phone: string, password: string) => Promise<{ success: boolean; error?: string }>;
  register: (fullName: string, phone: string, password: string) => Promise<{ success: boolean; error?: string }>;
  logout: () => Promise<void>;
  saveAddress: (addr: Omit<SavedAddress, 'id' | 'createdAt' | 'updatedAt'>) => Promise<SavedAddress>;
  deleteAddress: (id: string) => Promise<void>;
  updateProfileName: (fullName: string) => Promise<boolean>;
  refreshAddresses: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [addresses, setAddresses] = useState<SavedAddress[]>([]);
  const { showToast } = useToast();

  const loadUserData = useCallback(async (activeUser: UserProfile | null) => {
    if (!activeUser) {
      setAddresses([]);
      return;
    }
    try {
      const addrs = await apiGetAddresses(activeUser.userId);
      setAddresses(addrs);
    } catch {
      // Graceful fallback
    }
  }, []);

  useEffect(() => {
    const session = apiGetStoredSession();
    if (session) {
      setUser(session);
      loadUserData(session);
    }
    setLoading(false);
  }, [loadUserData]);

  const login = async (phone: string, pass: string): Promise<{ success: boolean; error?: string }> => {
    setLoading(true);
    const res = await apiLogin(phone, pass);
    setLoading(false);

    if (res.error || !res.user) {
      showToast(res.error || 'Login failed', 'error');
      return { success: false, error: res.error || 'Login failed' };
    }

    setUser(res.user);
    await loadUserData(res.user);
    showToast(`Welcome back, ${res.user.fullName}!`, 'success');
    return { success: true };
  };

  const register = async (
    fullName: string,
    phone: string,
    pass: string
  ): Promise<{ success: boolean; error?: string }> => {
    setLoading(true);
    const res = await apiRegister(fullName, phone, pass);
    setLoading(false);

    if (res.error || !res.user) {
      showToast(res.error || 'Registration failed', 'error');
      return { success: false, error: res.error || 'Registration failed' };
    }

    setUser(res.user);
    await loadUserData(res.user);
    showToast(`Welcome to Diwali Mart, ${res.user.fullName}!`, 'festive');
    return { success: true };
  };

  const logout = async (): Promise<void> => {
    await apiLogout();
    setUser(null);
    setAddresses([]);
    showToast('You have been logged out.', 'info');
  };

  const saveAddress = async (addrData: Omit<SavedAddress, 'id' | 'createdAt' | 'updatedAt'>): Promise<SavedAddress> => {
    const saved = await apiSaveAddress(addrData);
    setAddresses(prev => [saved, ...prev.filter(a => a.id !== saved.id)]);
    showToast('Delivery address saved successfully.', 'success');
    return saved;
  };

  const deleteAddress = async (id: string): Promise<void> => {
    await apiDeleteAddress(id);
    setAddresses(prev => prev.filter(a => a.id !== id));
    showToast('Address removed.', 'info');
  };

  const updateProfileName = async (fullName: string): Promise<boolean> => {
    if (!user) return false;
    const updated = await apiUpdateProfile(user.userId, fullName);
    if (updated) {
      setUser(updated);
      showToast('Profile updated successfully.', 'success');
      return true;
    }
    return false;
  };

  const refreshAddresses = async (): Promise<void> => {
    if (user) {
      await loadUserData(user);
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        addresses,
        login,
        register,
        logout,
        saveAddress,
        deleteAddress,
        updateProfileName,
        refreshAddresses
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export function useAuth(): AuthContextType {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
