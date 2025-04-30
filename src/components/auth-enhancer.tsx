"use client";

import { Interaction, Post } from "@/interfaces";
import PostList from "@/components/post-list";
import React, { useContext, useEffect, useState } from "react";
import { AuthContext } from "@/hooks/auth-provider";
import useUserInteractionApi from "@/hooks/useUserInteractionApi";

export default function AuthEnhancer({ posts }: { posts: Post[] }) {
  const { currentUser } = useContext(AuthContext);
  const { getPostsInteractions } = useUserInteractionApi();
  const [copy, setCopy] = useState(posts);

  useEffect(() => {
    if (currentUser) {
      getPostsInteractions({ postIds: posts.map((post) => post.id) }).then((response) => {
        const map = response.data.data.reduce(
          (
            accumulator: {
              [key: string]: Interaction[];
            },
            currentValue: Interaction,
          ) => {
            if (!accumulator.hasOwnProperty(currentValue.interactableId!)) {
              accumulator[currentValue.interactableId!] = [currentValue];
            } else {
              accumulator[currentValue.interactableId!].push(currentValue);
            }
            return accumulator;
          },
          {},
        );

        setCopy((prev) => {
          //  Set the fetched interactions to the posts
          return prev.map((prevPost) => {
            prevPost.interactions = [];
            if (map[prevPost.id]) {
              prevPost.interactions = map[prevPost.id];
            }

            return prevPost;
          });
        });
      });
    }
  }, [currentUser, getPostsInteractions, posts]);

  return <PostList posts={copy}></PostList>;
}
