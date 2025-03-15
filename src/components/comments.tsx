'use client';

import {Comment, Post} from "@/interfaces";
import {Card} from "@/components/card";
import {CommentInput} from "@/components/comment-input";
import {CommentItem} from "@/components/comment-item";
import {useState} from "react";

export function Comments({post}: { post: Post }) {
    const [storedPost, setStoredPost] = useState<Post>(post);


    const addComment = (comment: Comment) => {
        setStoredPost((prev) => {
            const copy: Post = {...prev};
            copy.numberOfComments += 1;
            copy.comments = [comment, ...prev.comments];
            return copy;
        })
    }

    return <Card>
        <div className="mb-4">
            <CommentInput onSuccess={(comment) => addComment(comment)} post={storedPost} parentId={null}/>
        </div>

        <h2 className={'text-2xl font-bold mb-4'}>Komentarji ({storedPost.numberOfComments})</h2>

        <div className="grid grid-cols-1 gap-6">
            {storedPost.comments.map((comment: Comment) => {
                return <CommentItem key={comment.id} comment={comment} post={storedPost}/>
            })}
        </div>
    </Card>
}