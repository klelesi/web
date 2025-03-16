import {Card} from "@/components/card";
import {PostType} from "@/interfaces";
import {PostComments} from "@/components/post-comments";
import usePostAPI from "@/hooks/usePostAPI";
import {MarkdownPost} from "@/components/posts/markdown-post";
import {LinkPost} from "@/components/posts/link-post";

export default async function Post({params}) {
    const {slug} = await params;
    const {getPost} = usePostAPI();
    const post = (await getPost(slug)).data.data;

    return <div className="grid grid-cols-1 gap-3 container max-w-[700px] pt-3">
        <Card>
            {post.postType == PostType.MARKDOWN ? <MarkdownPost post={post}/> : null}
            {post.postType == PostType.LINK ? <LinkPost post={post}/> : null}
        </Card>

        {post ? (<PostComments post={post}/>) : null}
    </div>
}


