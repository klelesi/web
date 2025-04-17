'use client';

import FormMarkdown from "@/components/form-markdown";
import {z} from "zod";
import {FormEvent, useContext, useState} from "react";
import useClientAxios from "@/hooks/useClientAxios";
import {Comment, Post} from "@/interfaces";
import {AuthContext} from "@/hooks/auth-provider";
import {NotificationCard} from "@/components/notification-card";
import { LoginNotificationCard } from "@/components/login-notification-card";

const commentForm = z.object({
    markdown: z.string().min(1),
})

export function CommentForm({post, comment, parentId, onSuccess}: {
    post: Post,
    comment?: Comment | null,
    parentId?: string | null,
    onSuccess: (comment: Comment) => void
}) {
    const client = useClientAxios();
    const [form, setForm] = useState({markdown: comment?.markdown ?? ''});
    const [isLoading, setIsLoading] = useState(false);
    const {currentUser} = useContext(AuthContext);

    function onChange(prop: string, value: string | number) {
        setForm((prev) => {
            const copy = {...prev};
            // @ts-expect-error: setting a prop via string type
            copy[prop] = value;
            return copy;
        })
    }

    function submit(event: FormEvent<HTMLFormElement>) {
        event.preventDefault();
        setIsLoading(true);

        if (!comment) {
            client.post('/comments', {
                postId: post.id,
                markdown: form.markdown,
                parentId: parentId,
            }).then((response) => {
                setIsLoading(false);
                setForm({markdown: ''});

                if (onSuccess) {
                    onSuccess(response.data.data);
                }
            })
        } else {
            client.put(`/comments/${comment.id}`, {
                markdown: form.markdown,
            }).then((response) => {
                setIsLoading(false);
                setForm({markdown: ''});

                if (onSuccess) {
                    onSuccess(response.data.data);
                }
            })
        }
    }

    return <div>
        {!currentUser ? <LoginNotificationCard/> : null}

        {currentUser ? <>
            <form action="" onSubmit={(event) => submit(event)}>
                <FormMarkdown label={''} name={'markdown'} value={form.markdown} onChange={onChange}
                              rows={5}
                              disabled={isLoading}/>
                <div className="mt-2 text-right">
                    <button type={'submit'} disabled={isLoading || !commentForm.safeParse(form).success}
                            className="btn btn-primary">{comment ? 'Posodobi komentar' : 'Objavi komentar'}
                    </button>
                </div>
            </form>
        </> : null}
    </div>
}