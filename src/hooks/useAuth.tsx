'use client';

import useAxios from "@/hooks/useAxios";
import {useEffect, useState} from "react";

const STORAGE_KEY = 'auth';

export default function useAuth() {
    'use client';

    const client = useAxios();

    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [auth, setAuth] = useState(null);

    useEffect(() => {
        //  Check for auth storage key
        let auth = localStorage.getItem(STORAGE_KEY);

        if (auth) {
            setAuth(JSON.parse(auth));
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
    }
}