'use client';


import {AuthProvider} from "@/hooks/auth-provider";
import {ReactNode} from "react";

export function Providers({children}: { children: ReactNode }) {
    return (
        <AuthProvider>
            {children}
        </AuthProvider>
    );
}