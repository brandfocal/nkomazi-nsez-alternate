import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { AdminUser, AdminRole } from '../types';
import { INITIAL_USERS } from '../mockData';
import { apiClient, setAuthToken, clearAuthToken } from '../services/apiClient';

interface AdminAuthContextType {
  user: AdminUser | null;
  isAuthenticated: boolean;
  isSuperAdmin: boolean;
  backendConnected: boolean;
  checkBackendHealth: () => Promise<boolean>;
  login: (email: string, password: string, preferredRole?: AdminRole) => Promise<boolean>;
  logout: () => void;
  switchRole: (newRole: AdminRole) => void;
}

const AdminAuthContext = createContext<AdminAuthContextType | undefined>(undefined);

export const AdminAuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [backendConnected, setBackendConnected] = useState<boolean>(false);

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

  const checkBackendHealth = useCallback(async (): Promise<boolean> => {
    try {
      const health = await apiClient.checkHealth();
      setBackendConnected(health.online);
      return health.online;
    } catch {
      setBackendConnected(false);
      return false;
    }
  }, []);

  useEffect(() => {
    checkBackendHealth();
    // Poll connection status every 30 seconds
    const interval = setInterval(checkBackendHealth, 30000);
    return () => clearInterval(interval);
  }, [checkBackendHealth]);

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

  const login = async (email: string, password: string, preferredRole?: AdminRole): Promise<boolean> => {
    // 1. Attempt authentication against the bespoke Express API first
    try {
      const result = await apiClient.login(email, password, preferredRole);
      if (result && result.user) {
        const liveUser: AdminUser = {
          id: result.user.id || `user-${Date.now()}`,
          name: result.user.name,
          email: result.user.email,
          role: result.user.role as AdminRole,
          department: result.user.department || 'Executive Governance',
          lastLogin: 'Just now (PostgreSQL API)'
        };
        setUser(liveUser);
        setBackendConnected(true);
        if (result.token) {
          setAuthToken(result.token);
        }
        return true;
      }
    } catch (err) {
      console.info('Backend API unavailable or login fallback: running in local sandbox mode.', err);
      setBackendConnected(false);
    }

    // 2. Seamless local demo fallback if API is not yet active
    const matched = INITIAL_USERS.find(u => u.email.toLowerCase() === email.toLowerCase());
    if (matched) {
      setUser(matched);
      return true;
    }

    const demoUser: AdminUser = {
      id: `user-${Date.now()}`,
      name: email.split('@')[0] || 'Administrator',
      email: email,
      role: preferredRole || 'SUPER_ADMIN',
      department: 'Nkomazi SEZ Management Unit',
      lastLogin: 'Just now (Sandbox)'
    };
    setUser(demoUser);
    return true;
  };

  const logout = () => {
    clearAuthToken();
    setUser(null);
  };

  const switchRole = (newRole: AdminRole) => {
    if (!user) return;
    const target = INITIAL_USERS.find(u => u.role === newRole) || {
      ...user,
      role: newRole,
      name: newRole === 'SUPER_ADMIN' ? 'Dr. Sipho Ndlovu' : 'Thandi Modise',
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
        backendConnected,
        checkBackendHealth,
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
