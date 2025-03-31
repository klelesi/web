import useClientAxios from "@/hooks/useClientAxios";

export default function usePostApi() {
    const client = useClientAxios();

    const getFeed = ({cursor}: { cursor?: string|null }) => {
        return client.get('/feed', {params: {cursor}});
    }

    return {
        getFeed,
    }
}