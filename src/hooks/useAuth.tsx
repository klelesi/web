'use client';

import useAxios from "@/hooks/useAxios";
import {useEffect, useState} from "react";

export default function useAuth() {
    'use client';

    const client = useAxios();

    const [isLoggedIn, setIsLoggedIn] = useState(false);

    useEffect(() => {
        setIsLoggedIn(!!document.cookie.match(/^(.*;)?\s*logged_in\s*=\s*[^;]+(.*)?$/));
    }, []);

    const logout = async () => {
        await client.post('/api/auth/logout');
        window.location.href = '/';
    }

    return {
        isLoggedIn,
        logout,
    }
}