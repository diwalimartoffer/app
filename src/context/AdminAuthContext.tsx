import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

// Obfuscated storage key for secure session isolation
export const ADMIN_SESSION_STORAGE_KEY = '_dm_sec_vault_9472';

interface AdminSession {
  adminId: string;
  username: string;
  role: 'super_admin';
  token: string;
  loggedInAt: string;
}

interface AdminAuthContextType {
  isAdminAuthenticated: boolean;
  adminSession: AdminSession | null;
  adminLogin: (identifier: string, password: string) => { success: boolean; error?: string };
  adminLogout: () => void;
}

const AdminAuthContext = createContext<AdminAuthContextType | undefined>(undefined);

// Clean, secure credentials
const VALID_ADMIN_USER = 'alonehacker4r';
const VALID_ADMIN_PASS = '!Alone@lonehacker4r';

export const AdminAuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [adminSession, setAdminSession] = useState<AdminSession | null>(() => {
    try {
      const raw = localStorage.getItem(ADMIN_SESSION_STORAGE_KEY);
      if (!raw) return null;
      const parsed = JSON.parse(raw);
      if (parsed && parsed.username === VALID_ADMIN_USER && parsed.token) {
        return parsed;
      }
      return null;
    } catch {
      return null;
    }
  });

  const adminLogin = (identifier: string, password: string): { success: boolean; error?: string } => {
    const trimmedUser = identifier.trim();

    // Strict authentication match
    if (trimmedUser !== VALID_ADMIN_USER || password !== VALID_ADMIN_PASS) {
      return { success: false, error: 'Access Denied: Invalid credentials.' };
    }

    const session: AdminSession = {
      adminId: 'adm_sec_9472',
      username: VALID_ADMIN_USER,
      role: 'super_admin',
      token: `sec_${Math.random().toString(36).substring(2)}${Date.now().toString(36)}`,
      loggedInAt: new Date().toISOString()
    };

    try {
      localStorage.setItem(ADMIN_SESSION_STORAGE_KEY, JSON.stringify(session));
    } catch {
      // Ignore storage errors
    }

    setAdminSession(session);
    return { success: true };
  };

  const adminLogout = () => {
    try {
      localStorage.removeItem(ADMIN_SESSION_STORAGE_KEY);
      // Also clean up any legacy keys
      localStorage.removeItem('diwalimart_admin_session');
    } catch {
      // Ignore
    }
    setAdminSession(null);
  };

  return (
    <AdminAuthContext.Provider
      value={{
        isAdminAuthenticated: Boolean(adminSession),
        adminSession,
        adminLogin,
        adminLogout
      }}
    >
      {children}
    </AdminAuthContext.Provider>
  );
};

export function useAdminAuth(): AdminAuthContextType {
  const context = useContext(AdminAuthContext);
  if (!context) {
    throw new Error('useAdminAuth must be used within an AdminAuthProvider');
  }
  return context;
}
