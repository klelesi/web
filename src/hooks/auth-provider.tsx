"use client";

import { createContext, ReactNode, useCallback, useEffect, useState } from "react";
import useUserApi from "@/hooks/useUserApi";
import { Auth } from "@/interfaces";

export const AuthContext = createContext<{
  currentUser: Auth | null;
  logoutUser: () => void;
  loginUser: (user: Auth) => void;
  permissions: string[];
  clear: () => void;
}>({
  currentUser: null,
  logoutUser: () => {},
  loginUser: () => {},
  clear: () => {},
  permissions: [],
});

const STORAGE_KEY_AUTH = "auth";
const STORAGE_KEY_PERMISSIONS = "permissions";

export function AuthProvider({ children }: { children: ReactNode }) {
  const { logout, getPermissions } = useUserApi();
  const [currentUser, setCurrentUser] = useState<Auth | null>(null);
  const [permissions, setPermissions] = useState<string[]>([]);

  useEffect(() => {
    const storedUser = getStoredUser();
    const storedPermissions = getStoredPermissions();

    if (storedUser) {
      setCurrentUser(storedUser);
    }

    if (storedPermissions) {
      setPermissions(storedPermissions);
    } else if (storedUser) {
      getPermissions().then((response) => {
        localStorage.setItem(STORAGE_KEY_PERMISSIONS, JSON.stringify(response.data.data.permissions));
        setPermissions(response.data.data.permissions);
      });
    }
  }, [getPermissions]);

  const getStoredPermissions = () => {
    const fromStorage = localStorage.getItem(STORAGE_KEY_PERMISSIONS);

    if (fromStorage) {
      return JSON.parse(fromStorage);
    }

    return null;
  };

  const getStoredUser = () => {
    const fromStorage = localStorage.getItem(STORAGE_KEY_AUTH);

    if (fromStorage) {
      return JSON.parse(fromStorage);
    }

    return null;
  };

  const logoutUser = () => {
    logout().then(
      () => clear(),
      () => clear(),
    );
  };

  const clear = () => {
    localStorage.clear();
    setCurrentUser(null);
  };

  const loginUser = useCallback((user: Auth) => {
    if (user) {
      localStorage.setItem(STORAGE_KEY_AUTH, JSON.stringify(user));
      setCurrentUser(user);
    }
  }, []);

  return <AuthContext.Provider value={{ currentUser, loginUser, logoutUser, clear, permissions }}>{children}</AuthContext.Provider>;
}
