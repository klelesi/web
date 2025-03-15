import {Card} from "@/components/card";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faLink} from "@fortawesome/free-solid-svg-icons";
import {Post, PostType} from "@/interfaces";
import {PostMeta} from "@/components/post-meta";
import AuthorActions from "@/components/author-actions";
import {UnsafeHTML} from "@/components/unsafe-html";
import {Comments} from "@/components/comments";

const LinkPost = ({post}) => {
    return <div className={'flex flex-col'}>
        <div className="flex flex-row justify-between items-center">
            <PostMeta author={post.author} createdAt={post.createdAt}/>
            <AuthorActions item={post}/>
        </div>
        <hr className={'my-2'}/>

        <h1 className={'text-5xl font-semibold mb-6'}>{post.title}</h1>

        <a href={post.url} title={post.urlMeta['openGraph']['og:title']} rel={'noreferrer nofollow'}>
            <Card>
                <div className="grid grid-cols-3">
                    <div className={'flex justify-center items-center'}>
                        <img src={post.urlMeta['openGraph']['og:image']} alt="" className={'w-full'}/>
                    </div>

                    <div className={'col-span-2 p-3'}>
                        <h3 className={'font-semibold text-lg mb-3'}>{post.urlMeta['openGraph']['og:title']}</h3>

                        <p className="text-sm">{post.urlMeta['openGraph']['og:description']}</p>
                    </div>
                </div>

                <div className="text-sm">
                    <FontAwesomeIcon icon={faLink}/> {post.url}
                </div>
            </Card>
        </a>
    </div>
}

const MarkdownPost = ({post}) => {
    return <div className={'flex flex-col'}>
        <div className="flex flex-row justify-between items-center">
            <PostMeta author={post.author} createdAt={post.createdAt}/>
            <AuthorActions item={post}/>
        </div>

        <hr className={'my-2'}/>

        <h1 className={'text-5xl font-semibold mb-6'}>{post.title}</h1>

        <div className={'prose'}>
            <UnsafeHTML html={post.html}></UnsafeHTML>
        </div>
    </div>
}

export default async function Post({params}) {
    const {slug} = await params;
    const post: Post = (await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/posts/${slug}`).then(response => response.json())).data;

    return <div className="grid grid-cols-1 gap-3 container max-w-[700px] pt-3">
        <Card>
            {post.postType == PostType.MARKDOWN ? <MarkdownPost post={post}/> : null}
            {post.postType == PostType.LINK ? <LinkPost post={post}/> : null}
        </Card>

        <Comments post={post}/>
    </div>
}


