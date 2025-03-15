'use client';

import {Comment} from "@/interfaces";
import {useState} from "react";
import {Card} from "@/components/card";
import {PostMeta} from "@/components/post-meta";
import {UnsafeHTML} from "@/components/unsafe-html";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faComments} from "@fortawesome/free-solid-svg-icons";
import {CommentInput} from "@/components/comment-input";
import Post from "@/app/guna/[slug]/page";
import AuthorActions from "@/components/author-actions";
import useAuth from "@/hooks/useAuth";
import {isAuthor} from "@/utils";

export function CommentItem({comment, post}: { comment: Comment, post: Post }) {
    const {auth} = useAuth();
    const [isShowing, setIsShowing] = useState(false);
    const [storedComment, setStoredComment] = useState(comment);
    const [isEditing, setIsEditing] = useState(false);

    function addComment(comment: Comment) {
        if(storedComment){
            setIsShowing(false);
            setIsEditing(false);
            setStoredComment({...storedComment, markdown: comment.markdown, html: comment.html});

        } else {
            setIsShowing(false);
            setIsEditing(false);
            setStoredComment({...storedComment, comments: [comment, ...storedComment.comments]})
        }
    }

    return <Card>
        <div className="mb-2 flex flex-row justify-between items-center">
            <PostMeta author={storedComment.author} createdAt={storedComment.createdAt}/>

            {isAuthor(auth, storedComment) && !isEditing ? <button onClick={() => setIsEditing(true)} className={'btn' +
                ' btn-sm' +
                ' btn-primary-outline'}>Uredi</button> : null}
        </div>
        <UnsafeHTML html={storedComment.html}/>
        <div className="mt-2">
            {!isShowing ? <button className="btn btn-sm btn-primary-outline" onClick={() => setIsShowing(true)}>
                <FontAwesomeIcon icon={faComments} className={'mr-2'}/>
                Odgovori</button> : null}

            {(isShowing || isEditing) ? <div className="mb-4">
                <CommentInput comment={isEditing ? storedComment : null} post={post} parentId={storedComment.id} onSuccess={(success) => addComment(success)}/>
            </div> : null}
        </div>

        {storedComment.comments.length > 0 ? <div className={'pl-4 mt-3'}>
            <div className="grid grid-cols-1 gap-6">
                {storedComment.comments.map((subComment: Comment) => {
                    return <CommentItem key={subComment.id} comment={subComment} post={post}/>
                })}
            </div>
        </div>: null}
    </Card>;
}