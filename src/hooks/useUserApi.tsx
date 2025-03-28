import useClientAxios from "@/hooks/useClientAxios";
import {useContext} from "react";
import {AuthContext} from "@/hooks/auth-provider";
import {useRouter} from "next/navigation";

export default function useUserApi() {
    const client = useClientAxios();
    const {loginUser} = useContext(AuthContext);
    const router = useRouter();

    const getProfile = () => {
        return client.get('/api/user');
    }

    const updateProfile = (data: { name: string }) => {
        return client.put('/api/user', data);
    }

    const register = (data: { name: string, password: string, email: string }) => {
        return client.post('/api/auth/register', data);
    }

    const login = (data: { password: string, email: string }) => {
        return client.post('/api/auth/login', data);
    }

    const passwordRequest = (data: { email: string }) => {
        return client.post('/api/auth/password-request', data);
    }

    const passwordReset = (data: { email: string, token: string, password: string }) => {
        return client.post('/api/auth/password-reset', data);
    }

    const logout = () => {
        return client.post('/api/auth/logout', {})
    }

    const checkLogin = (callback = () => {}) => {
        getProfile().then((success) => {
            loginUser(success.data.data);
            router.push('/');
        }, () => {
            callback();
        });
    }

    return {
        getProfile,
        updateProfile,
        logout,
        register,
        checkLogin,
        login,
        passwordRequest,
        passwordReset,
    }
}