'use client';


import {AuthProvider} from "@/components/auth-provider";

export function Providers({ children }) {
    return (
        <AuthProvider>
            { children }
        </AuthProvider>
    );
}