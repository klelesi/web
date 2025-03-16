import useAxios from "@/hooks/useAxios";

export default function useUserApi() {
    const client = useAxios();

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