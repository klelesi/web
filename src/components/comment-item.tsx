'use client';

import {Comment} from "@/interfaces";
import {useContext, useState} from "react";
import {Card} from "@/components/card";
import {PostMeta} from "@/components/post-meta";
import {UnsafeHTML} from "@/components/unsafe-html";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faComments} from "@fortawesome/free-solid-svg-icons";
import {CommentForm} from "@/components/comment-form";
import Post from "@/app/guna/[slug]/page";
import {isCurrentUserAuthor} from "@/utils";
import {AuthContext} from "@/components/auth-provider";

enum State {
    IDLE,
    EDITING,
    RESPONDING,
}

export function CommentItem({comment, post}: { comment: Comment, post: Post }) {
    const {currentUser} = useContext(AuthContext);
    const [localComment, setLocalComment] = useState(comment);
    const [currentState, setCurrentState] = useState(State.IDLE);

    /*  const [isEditing, setIsEditing] = useState(false);
      const [isShowing, setIsShowing] = useState(false);*/

    function updateComment(comment: Comment) {
        if (localComment) {
            setLocalComment({...localComment, markdown: comment.markdown, html: comment.html});

        } else {
            setLocalComment({...localComment, comments: [comment, ...localComment.comments]})
        }

        setCurrentState(State.IDLE);
    }

    return <Card>
        <div className="mb-2 flex flex-row justify-between items-center">
            <PostMeta author={localComment.author} createdAt={localComment.createdAt}/>

            {currentState === State.IDLE && isCurrentUserAuthor(currentUser, localComment) ?
                <button onClick={() => setCurrentState(State.EDITING)} className={'btn' +
                    ' btn-sm' +
                    ' btn-primary-outline'}>Uredi</button> : null}
        </div>

        {currentState !== State.EDITING ? <div className="prose">
            <UnsafeHTML html={localComment.html}/>
        </div> : null}

        {currentState === State.IDLE ?
            <button className="btn btn-sm btn-primary-outline mt-2" onClick={() => setCurrentState(State.RESPONDING)}>
                <FontAwesomeIcon icon={faComments} className={'mr-2'}/>
                Odgovori</button> : null}

        {(currentState === State.EDITING || currentState === State.RESPONDING) ? <div className="mb-4">

            {currentState === State.RESPONDING ? <h5 className={'text-xl font-bold my-2'}>Tvoj komentar</h5>
                : null}

            <CommentForm comment={currentState === State.EDITING ? localComment : null}
                         post={post}
                         parentId={localComment.id}
                         onSuccess={(success) => updateComment(success)}/>
        </div> : null}

        {localComment.comments.length > 0 ? <div className={'pl-4 mt-3'}>
            <div className="grid grid-cols-1 gap-3">
                {localComment.comments.map((subComment: Comment) => {
                    return <CommentItem key={subComment.id} comment={subComment} post={post}/>
                })}
            </div>
        </div> : null}
    </Card>;
}


/**
 *
 * <div className="mt-2">
 *             {!isShowing ? <button className="btn btn-sm btn-primary-outline" onClick={() => setIsShowing(true)}>
 *                 <FontAwesomeIcon icon={faComments} className={'mr-2'}/>
 *                 Odgovori</button> : null}
 *
 *             {(isShowing || isEditing) ? <div className="mb-4">
 *                 <CommentForm comment={isEditing ? localComment : null} post={post} parentId={localComment.id}
 *                              onSuccess={(success) => addComment(success)}/>
 *             </div> : null}
 *         </div>
 */