import { Post } from "@/interfaces";
import { NotificationCard } from "@/components/notification-card";
import { Metadata } from "next";
import { ShowPost } from "@/components/show-post";

export const revalidate = 0;

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

const MissingPost = () => {
  return <NotificationCard title={"Opala. Ta prispevek ne obstaja!"} body={"Mogoče je nekoč obstajal, mogoče nikoli ni obstajal. Napaka 404."} />;
};
