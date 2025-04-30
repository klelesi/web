import { PostMeta } from "@/components/post-meta";
import PostAuthorActions from "@/components/post-author-actions";
import { UnsafeHTML } from "@/components/unsafe-html";
import { MarkdownPost as MarkdownPostInterface } from "@/interfaces";
import { UpvoteDownvote } from "@/components/upvote-downvote";
import { resolveUpvoteDownvoteState } from "@/utils";

export const MarkdownPost = ({ post }: { post: MarkdownPostInterface }) => {
  return (
    <div className={"flex flex-col"}>
      <div className="flex flex-row justify-between items-center">
        <PostMeta author={post.author} createdAt={post.createdAt} />
        <PostAuthorActions item={post} />
      </div>

      <hr className={"my-2"} />

      <div className="flex flex-row items-center justify-center mb-4 md:mb-8">
        <div className="mr-2">
          <UpvoteDownvote item={post} initialState={resolveUpvoteDownvoteState(post.interactions)}/>
        </div>
        <h1 className={"text-2xl md:text-5xl font-bold flex-1"}>{post.title}</h1>
      </div>

      <div className={"prose"}>
        <UnsafeHTML html={post.html} />
      </div>
    </div>
  );
};
