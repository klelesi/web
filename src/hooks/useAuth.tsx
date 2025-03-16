'use client';

import {useEffect, useState} from "react";
import {Auth} from "@/interfaces";

const STORAGE_KEY = 'auth';

export default function useAuth() {
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [auth, setAuth] = useState<Auth>(null);

    useEffect(() => {
        const storedAuth = getStoredAuth();
        setAuth(storedAuth);
        setIsLoggedIn(!!storedAuth);
    }, []);

    const login = (user: Auth) => {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(user));
        setAuth(user);
        setIsLoggedIn(true);
    };

    const clearAuth = () => {
        localStorage.clear();
        setAuth(null);
        setIsLoggedIn(false);
    }

    const getStoredAuth = () => {
        const fromStorage = localStorage.getItem(STORAGE_KEY);

        if (fromStorage) {
            return JSON.parse(fromStorage);
        }

        return null;
    }

    return {
        isLoggedIn,
        auth,
        login,
        clearAuth,
    }
}