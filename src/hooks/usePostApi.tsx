import useClientAxios from "@/hooks/useClientAxios";

export default function usePostApi() {
    const client = useClientAxios();

    const getFeed = ({cursor}: { cursor?: string | null }) => {
        return client.get('/feed', {params: {cursor}});
    }

    const deletePost = (postId: string) => {
        return client.delete(`/posts/${postId}`);
    }

    const deleteComment = (commentId: string) => {
        return client.delete(`/comments/${commentId}`);
    }

    const lockPost = (postId: string) => {
        return client.post(`/posts/${postId}/lock`);
    }

    const unlockPost = (postId: string) => {
        return client.post(`/posts/${postId}/unlock`);
    }

    const lockComment = (commentId: string) => {
        return client.post(`/comments/${commentId}/lock`);
    }

    const unlockComment = (commentId: string) => {
        return client.post(`/comments/${commentId}/unlock`);
    }

    return {
        getFeed,
        deletePost,
        lockPost,
        unlockPost,
        deleteComment,
        lockComment,
        unlockComment,
    }
}