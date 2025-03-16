import useAxios from "@/hooks/useAxios";
import useAuth from "@/hooks/useAuth";

export default function useUserApi() {
    const client = useAxios();
    const {clearAuth} = useAuth();

    const getProfile = () => {
        return client.get('/api/user');
    }

    const logout = () => {
        return client.post('/api/auth/logout', {}).then((respone) => {
            clearAuth();
            return respone;
        }, (error) => {
            clearAuth();
            return error;
        });
    }

    return {
        getProfile,
        logout,
    }
}