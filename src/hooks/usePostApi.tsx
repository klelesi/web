import useClientAxios from "@/hooks/useClientAxios";

export default function usePostApi() {
    const client = useClientAxios();

    const getFeed = ({cursor}: { cursor?: string|null }) => {
        return client.get('/feed', {params: {cursor}});
    }

    const deletePost = (postId: string) => {
        return client.delete(`/posts/${postId}`);
    }

    return {
        getFeed,
        deletePost,
    }
}