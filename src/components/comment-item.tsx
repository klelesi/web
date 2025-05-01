'use client';

import {Comment, Post} from "@/interfaces";
import {useContext, useState} from "react";
import {Card} from "@/components/card";
import {PostMeta} from "@/components/post-meta";
import {UnsafeHTML} from "@/components/unsafe-html";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faComments, faTrash} from "@fortawesome/free-solid-svg-icons";
import {CommentForm} from "@/components/comment-form";
import {isCurrentUserAuthor} from "@/utils";
import {AuthContext} from "@/hooks/auth-provider";
import {ReportContentDialog} from "@/components/report-content-dialog";
import usePostApi from "@/hooks/usePostApi";

enum State {
    IDLE,
    EDITING,
    RESPONDING,
}

export function CommentItem({comment, post}: { comment: Comment, post: Post }) {
    const {currentUser, permissions} = useContext(AuthContext);
    const [localComment, setLocalComment] = useState(comment);
    const [currentState, setCurrentState] = useState(State.IDLE);
    const {deleteComment, unlockComment,
        lockComment} = usePostApi();

    function updateComment(comment: Comment) {
        if (currentState === State.EDITING) {
            setLocalComment({...localComment, markdown: comment.markdown, html: comment.html});
        } else if (currentState === State.RESPONDING) {
            setLocalComment((prev) => {
                return {...prev, comments: [comment, ...prev.comments]}
            })
        }

        setCurrentState(State.IDLE);
    }

    const toggleLock = () => {
        if (comment.lockedAt) {
            unlockComment(comment.id).then(() => {
                window.location.href = window.location.href;
            });
        } else {
            lockComment(comment.id).then(() => {
                window.location.href = window.location.href;
            });
        }
    }

    function isLocked() {
        return post.lockedAt || comment.lockedAt;
    }

    const deleteItem = () => {
        if (!confirm("Res želiš izbrisati komentar?")) {
            return;
        }

        deleteComment(comment.id).then(() => {
            window.location.href = window.location.href;
        })
    }

    function hasPermission(permission: string) {
        return permissions.includes(permission);
    }

    return <div>
        {!comment.deletedAt && (<div id={comment.id} className="mb-2 flex flex-row justify-between items-center">
            <PostMeta author={localComment.author} createdAt={localComment.createdAt}/>

            <div className="flex flex-row">
                {(currentState === State.IDLE && isCurrentUserAuthor(currentUser, localComment) && !isLocked()) ?
                    <button onClick={() => setCurrentState(State.EDITING)} className={'btn' +
                        ' btn-sm' +
                        ' btn-primary-outline mr-2'}>Uredi</button> : null}

                {(currentState === State.IDLE && isCurrentUserAuthor(currentUser, localComment)) ?
                    <button onClick={() => deleteItem()} className={'btn' +
                        ' btn-sm' +
                        ' btn-primary-outline mr-2'}><FontAwesomeIcon icon={faTrash}/></button> : null}

                {hasPermission('lock content') && (<>
                    <button
                        onClick={() => toggleLock()}
                        className="btn-sm btn-primary-outline mr-2">{comment.lockedAt ? 'Odkleni' : 'Zakleni'}           </button>
                </>)}
            </div>
        </div>)}

        {currentState !== State.EDITING ? <div className="prose">
            <UnsafeHTML html={localComment.html}/>
        </div> : null}

        {(currentState === State.IDLE) ?
            <div className={'mt-2 flex flex-row items-center'}>
                {!isLocked() && (<button className="btn btn-sm btn-primary-outline mr-3"
                                         onClick={() => setCurrentState(State.RESPONDING)}>
                    <FontAwesomeIcon icon={faComments} className={'mr-2'}/>
                    Odgovori
                </button>)}
                {!comment.deletedAt && (<ReportContentDialog comment={comment}/>)}

                {comment.lockedAt && (<p className={'text-sm italic ml-3'}>Komentar je zaklenjen.</p>)}

            </div> : null}


        {(currentState === State.EDITING || currentState === State.RESPONDING) ? <div className="mb-4">

            {currentState === State.RESPONDING ? <h5 className={'text-xl font-bold my-2'}>Tvoj komentar</h5>
                : null}

            <CommentForm comment={currentState === State.EDITING ? localComment : null}
                         post={post}
                         parentId={localComment.id}
                         onSuccess={(success) => updateComment(success)}
                         onClose={() => setCurrentState(State.IDLE)}/>
        </div> : null}

        <hr className="my-4"/>

        {localComment.comments.length > 0 ? <div className={'pl-6 mt-8'}>
            <div className="grid grid-cols-1 gap-3">
                {localComment.comments.map((subComment: Comment) => {
                    return <CommentItem key={subComment.id} comment={subComment} post={post}/>
                })}
            </div>
        </div> : null}
    </div>;
}
