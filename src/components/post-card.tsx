import {Card} from "@/components/card";
import {PostMeta} from "@/components/post-meta";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faComments} from "@fortawesome/free-solid-svg-icons";
import {Post} from "@/interfaces.js";

export interface PostCardConfig {
    hideActions: boolean;
}

export const PostCard = ({post, config = {hideActions: false}}: {post:Post, config: PostCardConfig}) => {
    const commentButtonText = (numberOfComments: number) => {
        if (numberOfComments == 0 || numberOfComments >= 3) {
            return 'komentarjev'
        } else if (numberOfComments == 1) {
            return 'komentar';
        } else if (numberOfComments == 2) {
            return 'komentarja';
        }

        return 'komentarjev';
    }

    return (<Card>
        <div className="grid grid-cols-1 gap-2">
            <a href={post.slug} className={'hover:underline'}>
                <h3 className="text-2xl font-bold text-black">{post.title}</h3>
            </a>
            <PostMeta author={post.author} createdAt={post.createdAt}/>

            {!config.hideActions && (<div className="flex flex-row mt-4">
                <button className={'btn btn-sm btn-primary-outline'}>
                    <FontAwesomeIcon icon={faComments} className={'mr-3'}/>
                    {post.numberOfComments} {commentButtonText(post.numberOfComments)}
                </button>
            </div>)}

        </div>
    </Card>);
}