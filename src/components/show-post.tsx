"use client";

import { LinkPost as LinkPostInterface, MarkdownPost as MarkdownPostInterface, Post, PostType } from "@/interfaces";
import { Card } from "@/components/card";
import { MarkdownPost } from "@/components/post/markdown-post";
import { LinkPost } from "@/components/post/link-post";
import { isLocked } from "@/utils";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faLock } from "@fortawesome/free-solid-svg-icons";
import { ReportContentDialog } from "@/components/report-content-dialog";
import { PostComments } from "@/components/post-comments";
import PostUserInteractions from "@/components/post-user-interactions";
import { useContext, useEffect, useState } from "react";
import { AuthContext } from "@/hooks/auth-provider";
import useUserInteractionApi from "@/hooks/useUserInteractionApi";

export const ShowPost = ({ post }: { post: Post }) => {
  const { currentUser } = useContext(AuthContext);
  const { getPostsInteractions } = useUserInteractionApi();
  const [copy, setCopy] = useState(post);

  useEffect(() => {
    if (currentUser) {
      getPostsInteractions({ postIds: [post.id] }).then((response) => {
        const interactions = response.data.data;

        setCopy((prev) => {
          return {
            ...prev,
            interactions,
          };
        });
      });
    }
  }, [currentUser, post, getPostsInteractions]);

  return (
    <>
      <Card>
        <>
          {post.postType == PostType.MARKDOWN ? <MarkdownPost post={copy as MarkdownPostInterface} /> : null}
          {post.postType == PostType.LINK ? <LinkPost post={copy as LinkPostInterface} /> : null}
        </>

        <div className="mt-6 flex flex-row justify-between items-center">
          <div>
            {isLocked(copy) && (
              <p className={"text-sm italic"}>
                <FontAwesomeIcon icon={faLock} className={"mr-2"} />
                Prispevek je zaklenjen.
              </p>
            )}
          </div>

          <ReportContentDialog post={copy} />
        </div>
      </Card>

      <PostComments post={copy} />
      <PostUserInteractions post={copy} />
    </>
  );
};
