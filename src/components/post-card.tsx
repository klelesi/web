import {Card} from "@/components/card";
import {PostMeta} from "@/components/post-meta";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faComments, faLink} from "@fortawesome/free-solid-svg-icons";
import {Post, PostType} from "@/interfaces";
import {getNumberOfCommentsText} from "@/utils";

export interface PostCardConfig {
    hideActions: boolean;
}

export const PostCard = ({post, config = {hideActions: false}}: { post: Post, config?: PostCardConfig }) => {
    return (<Card>
        <div className="grid grid-cols-1 gap-2">
            <a href={`${post.slug}`} className={'hover:text-red'}>
                <h3 className="text-xl md:text-2xl font-bold traciking-tight leading-tight flex">
                    {post.title}
                </h3>
            </a>

            <PostMeta author={post.author} createdAt={post.createdAt}/>

            {!config.hideActions && (<div className="flex flex-row items-center">
                <a href={`${post.slug}`} className={'mr-3'}>
                    <button className={'btn btn-sm btn-primary-outline'}>
                        <FontAwesomeIcon icon={faComments} className={'mr-3'}/>
                        {getNumberOfCommentsText(post.numberOfComments)}
                    </button>
                </a>

                {post.postType === PostType.LINK && (<>
                    <a href={post.url} rel={'noreferrer nofollow'} className={'text-sm text-dark-gray hover:text-red'}>
                        <FontAwesomeIcon icon={faLink}/> {post.urlHost}
                    </a>
                </>)}
            </div>)}
        </div>
    </Card>);
}