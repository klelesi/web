import {Card} from "@/components/card";
import {PostMeta} from "@/components/post-meta";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faComments, faLink, faLock} from "@fortawesome/free-solid-svg-icons";
import {Post, PostType} from "@/interfaces";
import {getNumberOfCommentsText} from "@/utils";

export interface PostCardConfig {
    hideActions: boolean;
}

export const PostCard = ({post, config = {hideActions: false}}: { post: Post, config?: PostCardConfig }) => {
    return (
        <Card backgroundColor={(post.interactions && post.interactions.length >= 1) ? 'rgba(255,255,255,0.15)' : ''}>
            <div className="grid grid-cols-1 gap-2">
                <div className="flex flex-row justify-between">

                    <a href={`${post.slug}`} className={'hover:text-red'}>
                        <h3 className="text-xl md:text-2xl font-bold traciking-tight leading-tight flex items-center">
                            {post.title}
                        </h3>
                    </a>

                    {post.lockedAt && (<span title={'Prispevek je zaklenjen'}><FontAwesomeIcon icon={faLock} className={'text-sm mr-2'}/></span>)}
                </div>

                <PostMeta author={post.author} createdAt={post.createdAt}/>
                {!config.hideActions && (<div className="flex flex-row items-center">

                    <a href={`${post.slug}`} className={'mr-3'}>
                        <button className={'btn btn-sm btn-primary-outline'}>
                            <FontAwesomeIcon icon={faComments} className={'mr-3'}/>
                            {getNumberOfCommentsText(post.numberOfComments)}
                        </button>
                    </a>

                    {post.postType === PostType.LINK && (<>
                        <a href={post.url} rel={'noreferrer nofollow'}
                           className={'text-sm text-dark-gray hover:text-red'}>
                            <FontAwesomeIcon icon={faLink}/> {post.urlHost}
                        </a>
                    </>)}
                </div>)}
            </div>
        </Card>);
}