'use client';

import useAxios from "@/hooks/useAxios";
import {useEffect, useState} from "react";

const STORAGE_KEY = 'auth';

export default function useAuth() {
    'use client';

    const client = useAxios();

    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [auth, setAuth] = useState(null);

    const clearAuth = () => {
        setIsLoggedIn(false);
        setAuth(null);
        localStorage.clear();
        document.cookie.replace(/(?<=^|;).+?(?=\=|;|$)/g, name => location.hostname.split('.').reverse().reduce(domain => (domain=domain.replace(/^\.?[^.]+/, ''),document.cookie=`${name}=;max-age=0;path=/;domain=${domain}`,domain), location.hostname));
    }

    useEffect(() => {
        //  Check for auth storage key
        const storedAuth = localStorage.getItem(STORAGE_KEY);

        if (storedAuth) {
            setAuth(JSON.parse(storedAuth));
            setIsLoggedIn(true);
        } else if (!!document.cookie.match(/^(.*;)?\s*logged_in\s*=\s*[^;]+(.*)?$/)) {
            client.get('/api/user').then((response) => response.data).then(response => {
                localStorage.setItem(STORAGE_KEY, JSON.stringify(response.data));
                setAuth(response.data);
                setIsLoggedIn(true);
            })
        }
    }, []);

    const logout = async () => {
        localStorage.clear();
        await client.post('/api/auth/logout');
        window.location.href = '/';
    }

    return {
        isLoggedIn,
        logout,
        auth,
        clearAuth,
    }
}