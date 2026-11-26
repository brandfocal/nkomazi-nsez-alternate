import React, { createContext, useContext, useState, useEffect } from 'react';
import { AdminUser, AdminRole } from '../types';
import { INITIAL_USERS } from '../mockData';

interface AdminAuthContextType {
  user: AdminUser | null;
  isAuthenticated: boolean;
  isSuperAdmin: boolean;
  login: (email: string, password: string, preferredRole?: AdminRole) => Promise<boolean>;
  logout: () => void;
  switchRole: (newRole: AdminRole) => void;
}

const AdminAuthContext = createContext<AdminAuthContextType | undefined>(undefined);

export const AdminAuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<AdminUser | null>(() => {
    try {
      const stored = localStorage.getItem('nkomazi_admin_session');
      if (stored) {
        const parsed = JSON.parse(stored);
        if (parsed && typeof parsed === 'object' && parsed.id && parsed.name && parsed.role) {
          return parsed;
        }
      }
      return INITIAL_USERS[0]; // defaults logged in as Super Admin for demo ease
    } catch {
      return INITIAL_USERS[0];
    }
  });

  useEffect(() => {
    try {
      if (user) {
        localStorage.setItem('nkomazi_admin_session', JSON.stringify(user));
      } else {
        localStorage.removeItem('nkomazi_admin_session');
      }
    } catch {
      // ignore
    }
  }, [user]);

  const login = async (email: string, _password: string, preferredRole?: AdminRole): Promise<boolean> => {
    // Mock login logic: match by email or fallback to demo account
    const matched = INITIAL_USERS.find(u => u.email.toLowerCase() === email.toLowerCase());
    if (matched) {
      setUser(matched);
      return true;
    }

    // Default demo fallback based on role
    const demoUser: AdminUser = {
      id: `user-${Date.now()}`,
      name: email.split('@')[0] || 'Administrator',
      email: email,
      role: preferredRole || 'SUPER_ADMIN',
      department: 'Nkomazi SEZ Management Unit',
      lastLogin: 'Just now'
    };
    setUser(demoUser);
    return true;
  };

  const logout = () => {
    setUser(null);
  };

  const switchRole = (newRole: AdminRole) => {
    if (!user) return;
    const target = INITIAL_USERS.find(u => u.role === newRole) || {
      ...user,
      role: newRole,
      name: newRole === 'SUPER_ADMIN' ? 'Sipho Ndlovu' : 'Thandi Mokoena',
      email: newRole === 'SUPER_ADMIN' ? 'sipho.ndlovu@nkomazisez.gov.za' : 'thandi.m@nkomazisez.gov.za'
    };
    setUser(target);
  };

  return (
    <AdminAuthContext.Provider
      value={{
        user,
        isAuthenticated: !!user,
        isSuperAdmin: user?.role === 'SUPER_ADMIN',
        login,
        logout,
        switchRole
      }}
    >
      {children}
    </AdminAuthContext.Provider>
  );
};

export function useAdminAuth() {
  const context = useContext(AdminAuthContext);
  if (!context) {
    throw new Error('useAdminAuth must be used within an AdminAuthProvider');
  }
  return context;
}
