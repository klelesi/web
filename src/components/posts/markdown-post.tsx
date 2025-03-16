import {PostMeta} from "@/components/post-meta";
import PostAuthorActions from "@/components/post-author-actions";
import {UnsafeHTML} from "@/components/unsafe-html";

export const MarkdownPost = ({post}) => {
    return <div className={'flex flex-col'}>
        <div className="flex flex-row justify-between items-center">
            <PostMeta author={post.author} createdAt={post.createdAt}/>
            <PostAuthorActions item={post}/>
        </div>

        <hr className={'my-2'}/>

        <h1 className={'text-5xl font-semibold mb-6'}>{post.title}</h1>

        <div className={'prose'}>
            <UnsafeHTML html={post.html}></UnsafeHTML>
        </div>
    </div>
}