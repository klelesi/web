'use client'

import axios, {AxiosError} from "axios";
import {useContext, useEffect, useMemo} from "react";
import {AuthContext} from "@/hooks/auth-provider";

const instance = axios.create({
    baseURL: process.env.NEXT_PUBLIC_API_URL,
    withCredentials: true,
    withXSRFToken: true,
});

function refreshCSRFCookie() {
    return axios.get(`${process.env.NEXT_PUBLIC_API_URL}/sanctum/csrf-cookie`, {
        withCredentials: true,
        withXSRFToken: true,
    });
}

export default function useClientAxios() {
    const {clear} = useContext(AuthContext);

    useEffect(() => {
        instance.interceptors.request.use(
            async (config) => {
                if (config.method !== 'get') {
                    await refreshCSRFCookie();
                }
                return config;
            },
            (error) => Promise.reject(error)
        );

        instance.interceptors.response.use(res => res, (error: AxiosError) => {
            if (error.status === 401) {
                clear();
            }
            throw error;
        });
    }, []);

    return useMemo(() => {
        return instance;
    }, []);
}