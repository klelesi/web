import useServerAxios from "@/hooks/useServerAxios";
import {Post, Result} from "@/interfaces";

export default function usePostAPI() {
    const serverClient = useServerAxios();

    const getPost = (slug: string) => {
        return serverClient.get<Result<Post>>(`/api/posts/${slug}`);
    }

    return {
        getPost,
    }
}