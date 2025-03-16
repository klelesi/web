'use client'

import axios, {AxiosError} from "axios";
import {useContext, useEffect, useMemo} from "react";
import {AuthContext} from "@/components/auth-provider";

const instance = axios.create({
    baseURL: process.env.NEXT_PUBLIC_API_URL,
    withCredentials: true,
    withXSRFToken: true,
});

export default function useAxios() {
    const {clear} = useContext(AuthContext);

    useEffect(() => {
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