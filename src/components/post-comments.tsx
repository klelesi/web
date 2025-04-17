'use client';

import {Comment, Post} from "@/interfaces";
import {Card} from "@/components/card";
import {CommentForm} from "@/components/comment-form";
import {CommentItem} from "@/components/comment-item";
import {useState} from "react";
import {NotificationCard} from "@/components/notification-card";

const NewCommentSection = ({post, onCommentAdded}: { post: Post, onCommentAdded: (comment: Comment) => void }) => {
    if (post.lockedAt) {
        return <>
            <NotificationCard title={'Prispevek je zaklenjen!'} body={"Komentiranje ni mogoče."}/>
        </>
    }

    return <>
        <h5 className={'text-xl font-bold my-2'}>Nov komentar</h5>
        <CommentForm onSuccess={(comment) => onCommentAdded(comment)} post={post}/>
    </>
}

const CommentsSection = ({post}: { post: Post }) => {
    return <>
        <h2 className={'text-2xl font-bold mb-4 mt-6'}>Komentarji ({post.numberOfComments})</h2>

        {!post.lockedAt && post.comments.length === 0 ? <NotificationCard title={'Oh. Na tem prispevku ni' +
            ' komentarjev.'} body={'Bodi faca in napiši prvega.'}/> : null}

        <div className="grid grid-cols-1 gap-3">
            {post.comments.map((comment: Comment) => {
                return <CommentItem key={comment.id} comment={comment} post={post}/>
            })}
        </div>
    </>
}

export function PostComments({post}: { post: Post }) {
    const [localPost, setLocalPost] = useState<Post>(post);

    const addComment = (comment: Comment) => {
        setLocalPost((prev) => {
            return {...prev, numberOfComments: (prev.numberOfComments + 1), comments: [comment, ...prev.comments]};
        })
    }

    return <Card>
        {localPost.comments.length === 0 ? <>
            <CommentsSection post={localPost}/>
            <NewCommentSection onCommentAdded={(comment) => addComment(comment)} post={localPost}/>
        </> : <>
            <NewCommentSection onCommentAdded={(comment) => addComment(comment)} post={localPost}/>
            <CommentsSection post={localPost}/>
        </>}
    </Card>
}

