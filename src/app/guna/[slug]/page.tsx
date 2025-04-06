import { Post, PostType } from "@/interfaces";
import { NotificationCard } from "@/components/notification-card";
import { Metadata } from "next";
import { Card } from "@/components/card";
import { MarkdownPost } from "@/components/markdown-post";
import { LinkPost } from "@/components/link-post";
import { ReportContentDialog } from "@/components/report-content-dialog";
import { PostComments } from "@/components/post-comments";
import PostUserInteractions from "@/components/post-user-interactions";
import { isLocked } from "@/utils";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faLock } from "@fortawesome/free-solid-svg-icons";

export const revalidate = 1;

type Params = {
  params: Promise<{ slug: string }>;
};

const fetchPost = async (slug: string): Promise<Post> => {
  return await (await fetch(`${process.env.NEXT_PUBLIC_API_URL}/posts/${slug}`)).json().then((res) => res.data);
};

export async function generateMetadata({ params }: Params): Promise<Metadata> {
  const { slug } = await params;

  try {
    const post = await fetchPost(slug);

    return {
      title: `${post.title} | Klele.si`,
    };
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
  } catch (_) {}

  return {
    title: "Prispevek ne obstaja | Klele.si",
  };
}

export default async function Page({ params }: Params) {
  const { slug } = await params;
  let post = null;

  try {
    post = await fetchPost(slug);
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
  } catch (_) {}

  return (
    <div className="grid grid-cols-1 gap-3 container w-page">
      <>{post ? <ShowPost post={post} /> : <MissingPost />}</>
    </div>
  );
}

const ShowPost = ({ post }: { post: Post }) => {
  return (
    <>
      <Card>
        <>
          {post.postType == PostType.MARKDOWN ? <MarkdownPost post={post} /> : null}
          {post.postType == PostType.LINK ? <LinkPost post={post} /> : null}
        </>

        <div className="mt-6 flex flex-row justify-between items-center">
          {isLocked(post) && (
            <p className={"text-sm italic"}>
              <FontAwesomeIcon icon={faLock} className={"mr-2"} />
              Prispevek je zaklenjen.
            </p>
          )}

          <ReportContentDialog post={post} />
        </div>
      </Card>

      <PostComments post={post} />

      <PostUserInteractions post={post} />
    </>
  );
};

const MissingPost = () => {
  return <NotificationCard title={"Opala. Ta prispevek ne obstaja!"} body={"Mogoče je nekoč obstajal, mogoče nikoli ni obstajal. Napaka 404."} />;
};
