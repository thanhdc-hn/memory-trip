import { useCallback, useEffect, useRef, useState } from 'react';

import { teamService } from '@/services/team.service';
import { ADMIN_EXPIRED_TIME } from '@/utils/constants';
import { decode, encode } from '@/utils/crypto';

const ADMIN_AUTH_KEY = 'admin_auth_token';
const ADMIN_EXPIRE_KEY = 'admin_expire_time';

export function useAdminAuth() {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [remainingTime, setRemainingTime] = useState<number>(0);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const clearAdmin = useCallback(() => {
    localStorage.removeItem(ADMIN_AUTH_KEY);
    localStorage.removeItem(ADMIN_EXPIRE_KEY);
    setIsAuthenticated(false);
    setRemainingTime(0);
  }, []);

  const checkExpiry = useCallback(() => {
    const expireTime = localStorage.getItem(ADMIN_EXPIRE_KEY);
    if (!expireTime) {
      setRemainingTime(0);
      return;
    }
    const diff = Number(expireTime) - Date.now();
    if (diff <= 0) {
      clearAdmin();
      if (intervalRef.current) clearInterval(intervalRef.current);
    } else {
      setRemainingTime(diff);
    }
  }, [clearAdmin]);

  const startExpiryCheck = useCallback(() => {
    if (intervalRef.current) clearInterval(intervalRef.current);
    checkExpiry();
    intervalRef.current = setInterval(checkExpiry, 1_000);
  }, [checkExpiry]);

  const checkAuth = useCallback(() => {
    const token = localStorage.getItem(ADMIN_AUTH_KEY);
    if (!token) {
      setIsAuthenticated(false);
      setIsLoading(false);
      return false;
    }

    const decoded = decode(token);
    if (!decoded) {
      clearAdmin();
      setIsLoading(false);
      return false;
    }

    // Check if already expired
    const expireTime = localStorage.getItem(ADMIN_EXPIRE_KEY);
    if (expireTime && Date.now() > Number(expireTime)) {
      clearAdmin();
      setIsLoading(false);
      return false;
    }

    setIsAuthenticated(true);
    setIsLoading(false);
    startExpiryCheck();
    return true;
  }, [clearAdmin, startExpiryCheck]);

  useEffect(() => {
    checkAuth();
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [checkAuth]);

  const login = async (password: string) => {
    const token = encode(password);
    localStorage.setItem(ADMIN_AUTH_KEY, token);

    try {
      await teamService.getTeams();
      localStorage.setItem(
        ADMIN_EXPIRE_KEY,
        String(Date.now() + ADMIN_EXPIRED_TIME),
      );
      setIsAuthenticated(true);
      startExpiryCheck();
      return true;
    } catch {
      clearAdmin();
      return false;
    }
  };

  const logout = () => {
    clearAdmin();
    if (intervalRef.current) clearInterval(intervalRef.current);
  };

  return {
    isAuthenticated,
    isLoading,
    remainingTime,
    login,
    logout,
    checkAuth,
  };
}
