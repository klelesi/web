'use client'

import axios, {AxiosError} from "axios";
import {useCallback, useMemo} from "react";
import useAuth from "@/hooks/useAuth";

const instance = axios.create({
    baseURL: process.env.NEXT_PUBLIC_API_URL,
    withCredentials: true,
    withXSRFToken: true,
});

export default function useAxios() {
    const {clearAuth} = useAuth();

    return useMemo(() => {
        instance.interceptors.response.use(res => res, (error: AxiosError) => {
            if (error.status === 401) {
                clearAuth();
            }
            throw error;
        });

        return instance;
    }, []);
}