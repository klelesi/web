'use client'

import axios from "axios";
import {useCallback} from "react";

const instance = axios.create({
    baseURL: process.env.NEXT_PUBLIC_API_URL,
    withCredentials: true,
    withXSRFToken: true,
});

export default function useAxios() {
    return useCallback(instance, []);
}