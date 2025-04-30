import { PostMeta } from "@/components/post-meta";
import PostAuthorActions from "@/components/post-author-actions";
import { Card } from "@/components/card";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faLink } from "@fortawesome/free-solid-svg-icons";
import { LinkPost as LinkPostInterface } from "@/interfaces";
import { UpvoteDownvote } from "@/components/upvote-downvote";
import { resolveUpvoteDownvoteState } from "@/utils";

export const LinkPost = ({ post }: { post: LinkPostInterface }) => {
  const openGraphImage = post.urlMeta?.openGraph["og:image"] ?? null;
  const openGraphTitle = post.urlMeta?.openGraph["og:title"] ?? null;
  const openGraphDescription = post.urlMeta?.openGraph["og:description"] ?? null;

  return (
    <div className={"flex flex-col"}>
      <div className="flex flex-row justify-between items-center">
        <PostMeta author={post.author} createdAt={post.createdAt} />
        <PostAuthorActions item={post} />
      </div>

      <hr className={"my-2"} />

      <div className="flex flex-row items-center justify-center mb-4 md:mb-8">
        <UpvoteDownvote item={post} initialState={resolveUpvoteDownvoteState(post.interactions)}/>
        <h1 className={"text-2xl md:text-5xl font-bold flex-1"}>{post.title}</h1>
      </div>

      <a href={post.url} title={openGraphTitle ?? post.title} rel={"noreferrer nofollow"} target={"_blank"}>
        <Card>
          <div className="grid grid-cols-3">
            {openGraphImage && (
              <>
                <div className={"flex justify-center items-center"}>
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={openGraphImage} alt="" className={"w-full"} />
                </div>
              </>
            )}

            <div className={"col-span-2 p-3"}>
              <h3 className={"font-semibold text-lg mb-3"}>{openGraphTitle ?? post.title}</h3>
              {openGraphDescription && <p className="text-sm">{openGraphDescription}</p>}
            </div>
          </div>

          <div className="text-sm mt-4">
            <hr className="my-2" />
            <FontAwesomeIcon icon={faLink} /> {post.url}
          </div>
        </Card>
      </a>
    </div>
  );
};
