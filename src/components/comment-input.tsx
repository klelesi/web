'use client';

import {LoginNotice} from "@/components/login-notice";
import Post from "@/app/guna/[slug]/page";
import FormMarkdown from "@/components/form-markdown";
import {z} from "zod";
import {useContext, useState} from "react";
import useAxios from "@/hooks/useAxios";
import {Comment} from "@/interfaces";
import {AuthContext} from "@/components/auth-provider";

const commentForm = z.object({
    markdown: z.string().min(1),
})

export function CommentInput({post, comment, parentId, onSuccess}: {
    post: Post,
    comment: Comment | null,
    parentId?: string | null,
    onSuccess: (comment: Comment) => (comment: Comment) => void
}) {
    const client = useAxios();
    const [form, setForm] = useState({markdown: comment?.markdown ?? ''});
    const [isLoading, setIsLoading] = useState(false);
    const {currentUser} = useContext(AuthContext);

    function onChange(prop, value) {
        setForm((prev) => {
            const copy = {...prev};
            copy[prop] = value;
            return copy;
        })
    }

    function submit(event) {
        event.preventDefault();
        setIsLoading(true);

        client.get('/sanctum/csrf-cookie').then(() => {
            if (!comment) {
                client.post('/api/comments', {
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
                client.put(`/api/comments/${comment.id}`, {
                    markdown: form.markdown,
                }).then((response) => {
                    setIsLoading(false);
                    setForm({markdown: ''});

                    if (onSuccess) {
                        onSuccess(response.data.data);
                    }
                })
            }

        });
    }

    return <div>
        {!currentUser ? <LoginNotice/> : null}

        {currentUser ? <>
            <form action="" onSubmit={(event) => submit(event)}>
                <FormMarkdown label={''} name={'markdown'} value={form.markdown} onChange={onChange}
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