import useClientAxios from "@/hooks/useClientAxios";

export default function useUserApi() {
    const client = useClientAxios();

    const getProfile = () => {
        return client.get('/api/user');
    }

    const logout = () => {
        return client.post('/api/auth/logout', {})
    }

    return {
        getProfile,
        logout,
    }
}