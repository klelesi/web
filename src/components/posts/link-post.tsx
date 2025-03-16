import {PostMeta} from "@/components/post-meta";
import PostAuthorActions from "@/components/post-author-actions";
import {Card} from "@/components/card";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faLink} from "@fortawesome/free-solid-svg-icons";
import {Post} from "@/interfaces";

export const LinkPost = ({post}: { post: Post }) => {
    return <div className={'flex flex-col'}>
        <div className="flex flex-row justify-between items-center">
            <PostMeta author={post.author} createdAt={post.createdAt}/>
            <PostAuthorActions item={post}/>
        </div>

        <hr className={'my-2'}/>

        <h1 className={'text-5xl font-semibold mb-6'}>{post.title}</h1>

        <a href={post.url} title={post.urlMeta?.openGraph['og:title']} rel={'noreferrer nofollow'}>
            <Card>
                <div className="grid grid-cols-3">
                    <div className={'flex justify-center items-center'}>
                        <img src={post.urlMeta?.openGraph['og:image']} alt="" className={'w-full'}/>
                    </div>

                    <div className={'col-span-2 p-3'}>
                        <h3 className={'font-semibold text-lg mb-3'}>{post.urlMeta?.openGraph['og:title']}</h3>
                        <p className="text-sm">{post.urlMeta?.openGraph['og:description']}</p>
                    </div>
                </div>

                <div className="text-sm">
                    <FontAwesomeIcon icon={faLink}/> {post.url}
                </div>
            </Card>
        </a>
    </div>
}