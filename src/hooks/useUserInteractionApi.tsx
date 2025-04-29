import useClientAxios from "@/hooks/useClientAxios";
import { useCallback } from "react";

export default function useUserInteractionApi() {
  const client = useClientAxios();

  const storeView = (data: { postId: string }) => {
    return client.post("/interactions", { ...data, type: "view" });
  };

  const upvotePost = (data: { postId: string }) => {
    return client.post("/interactions", { ...data, type: "upvote" });
  };

  const removeUpvotePost = (data: { postId: string }) => {
    return client.post("/interactions/remove", { ...data, type: "upvote" });
  };

  const downvotePost = (data: { postId: string }) => {
    return client.post("/interactions", { ...data, type: "downvote" });
  };

  const removeDownvotePost = (data: { postId: string }) => {
    return client.post("/interactions/remove", { ...data, type: "downvote" });
  };

  const getPostsInteractions = useCallback(
    ({ postIds }: { postIds: string[] }) => {
      return client.get("/interactions/posts", { params: { postIds } });
    },
    [client],
  );

  return {
    storeView,
    upvotePost,
    removeUpvotePost,
    downvotePost,
    removeDownvotePost,
    getPostsInteractions,
  };
}
