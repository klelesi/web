import {Card} from "@/components/card";
import {PostType} from "@/interfaces";
import {PostComments} from "@/components/post-comments";
import {MarkdownPost} from "@/app/guna/[slug]/components/markdown-post";
import {LinkPost} from "@/app/guna/[slug]/components/link-post";
import PostUserInteractions from "@/app/guna/[slug]/components/post-user-interactions";
import {ReportContentDialog} from "@/app/guna/[slug]/report-content-dialog";

export const revalidate = 1;

export default async function Post({params}: { params: Promise<{ slug: string }> }) {
    const {slug} = await params;
    const post = (await (await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/posts/${slug}`)).json()).data;

    return <div className="grid grid-cols-1 gap-3 container max-w-[700px] pt-3">
        <Card>
            {post.postType == PostType.MARKDOWN ? <MarkdownPost post={post}/> : null}
            {post.postType == PostType.LINK ? <LinkPost post={post}/> : null}

            <div className="mt-6 text-right">
                <ReportContentDialog post={post}/>
            </div>
        </Card>

        {post ? (<PostComments post={post}/>) : null}

        <PostUserInteractions post={post}/>
    </div>
}



