import { useState, useEffect } from "react";

const AUTH_KEY = "vj_admin_auth";

export function useAdminAuth() {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);

  useEffect(() => {
    const stored = localStorage.getItem(AUTH_KEY);
    if (stored) {
      try {
        const { token, expires } = JSON.parse(stored);
        if (token && expires && Date.now() < expires) {
          setIsAuthenticated(true);
          return;
        }
      } catch {
        // invalid data
      }
    }
    localStorage.removeItem(AUTH_KEY);
    setIsAuthenticated(false);
  }, []);

  const login = (token: string) => {
    const expires = Date.now() + 1000 * 60 * 60 * 8; // 8 hours
    localStorage.setItem(AUTH_KEY, JSON.stringify({ token, expires }));
    setIsAuthenticated(true);
  };

  const logout = () => {
    localStorage.removeItem(AUTH_KEY);
    setIsAuthenticated(false);
  };

  const getToken = (): string | null => {
    const stored = localStorage.getItem(AUTH_KEY);
    if (!stored) return null;
    try {
      return JSON.parse(stored).token;
    } catch {
      return null;
    }
  };

  return { isAuthenticated, login, logout, getToken };
}
