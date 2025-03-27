import useClientAxios from "@/hooks/useClientAxios";

export default function useCSRFCookieApi() {
    const client = useClientAxios();

    const refreshCSRFCookie = () => {
        return client.get('/api/sanctum/csrf-cookie');
    }

    return {
        refreshCSRFCookie,
    }
}