import useClientAxios from "@/hooks/useClientAxios";

export default function useUserInteractionApi() {
    const client = useClientAxios();

    const storeView = (data: { postId: string }) => {
        return client.post('/api/interactions', {...data, type: 'view'});
    }

    const getPostsInteractions = ({postIds}: { postIds: string[] }) => {
        return client.get('/api/interactions/posts', {params: {postIds}});
    }

    return {
        storeView,
        getPostsInteractions,
    }
}