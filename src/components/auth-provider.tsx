'use client';

import {createContext, useEffect, useState} from "react";
import useUserApi from "@/hooks/useUserApi";
import {Auth} from "@/interfaces";

export const AuthContext = createContext<{
    currentUser: Auth | null,
    logoutUser: () => void,
    loginUser: (user: Auth) => void,
    clear: () => void,
}>({
    currentUser: null,
    logoutUser: () => {},
    loginUser: () => {},
    clear: () => {},
});

const STORAGE_KEY = 'auth';

export function AuthProvider({children}) {
    const {logout} = useUserApi();
    const [currentUser, setCurrentUser] = useState<Auth>(null)

    useEffect(() => {
        const storedUser = getStoredUser();

        if (storedUser) {
            setCurrentUser(storedUser);
        }
    }, [])

    const getStoredUser = () => {
        const fromStorage = localStorage.getItem(STORAGE_KEY);

        if (fromStorage) {
            return JSON.parse(fromStorage);
        }

        return null;
    };

    const logoutUser = () => {
        logout().then((_) => clear(), (_) => clear())
    }

    const clear = () => {
        localStorage.clear();
        setCurrentUser(null);
    }

    const loginUser = (user: Auth) => {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(user));
        setCurrentUser(user);
    }

    return (
        <AuthContext.Provider value={{currentUser, loginUser, logoutUser, clear}}>
            {children}
        </AuthContext.Provider>
    );
}