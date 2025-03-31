'use client'

import axios, {AxiosError} from "axios";
import {useCallback, useContext, useMemo} from "react";
import {AuthContext} from "@/hooks/auth-provider";

export default function useClientAxios() {
    const {clear} = useContext(AuthContext);

    const refreshCSRFCookie = useCallback(() => {
        return axios.get(`${process.env.NEXT_PUBLIC_API_URL}/sanctum/csrf-cookie`, {
            withCredentials: true,
            withXSRFToken: true,
        });
    }, []);

    return useMemo(() => {
        const instance = axios.create({
            baseURL: process.env.NEXT_PUBLIC_API_URL,
            withCredentials: true,
            withXSRFToken: true,
        });

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

        return instance;
    }, []);
}