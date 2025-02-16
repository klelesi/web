import {PostCard, PostCardConfig} from "@/components/post-card";
import {Post} from "@/interfaces.js";

export default function PostList({posts, config = {hideActions: false}}: {posts:Post[], config?: PostCardConfig}) {
    return <div className="grid grid-cols-1 gap-3 max-w-[700px]">
        {posts.map((post) => <PostCard key={post.id} post={post} config={config}/>)}
    </div>
}