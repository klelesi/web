import useClientAxios from "@/hooks/useClientAxios";

export default function useReportApi() {
    const client = useClientAxios();

    const storeReport = (data: { postId?: string, commentId?: string, comment: string }) => {
        return client.post('/api/reports', data);
    }

    return {
        storeReport
    }
}