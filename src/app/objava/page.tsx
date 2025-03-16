'use client';

import {Card} from "@/components/card";
import {faLink, faFile} from "@fortawesome/free-solid-svg-icons";
import {z} from "zod";
import {FormEvent, useContext, useEffect, useState} from "react";
import useClientAxios from "@/hooks/useClientAxios";
import {AxiosError} from "axios";
import {LoginNotice} from "@/components/login-notice";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import FormInput from "@/components/form-input";
import FormMarkdown from "@/components/form-markdown";
import MarkdownInstructions from "@/components/markdown-instructions";
import {useRouter, useSearchParams} from "next/navigation";
import {Post, PostType} from "@/interfaces";
import Shimmer from "@/components/shimmer";
import {isCurrentUserAuthor} from "@/utils";
import {AccessDeniedNotice} from "@/components/access-denied-notice";
import {AuthContext} from "@/hooks/auth-provider";
import {Suspense} from 'react'


const postSchema = z.discriminatedUnion('postType', [
    z.object({
        postType: z.literal(PostType.MARKDOWN),
        title: z.string().min(1, "Naslov je obvezen!"),
        markdown: z.string().min(1, "Vsebina je obvezna!"),
    }),
    z.object({
        postType: z.literal(PostType.LINK),
        title: z.string().min(1, "Naslov je obvezen!"),
        url: z.string().url("Tole pa ni veljaven URL naslov."),
    }),
]);

const PostForm = ({post}: { post?: Post | null }) => {
    const client = useClientAxios();
    const router = useRouter();

    const postForm = post ? {
        postType: post.postType,
        title: post.title,
        markdown: post.markdown ?? '',
        url: post.url ?? ''
    } : {
        postType: PostType.MARKDOWN,
        title: '',
        markdown: '',
        url: '',
    }

    const [form, setForm] = useState(postForm)
    const [errors, setErrors] = useState(postSchema.safeParse(form));
    const [isLoading, setIsLoading] = useState(false);

    function submit(event: FormEvent<HTMLFormElement>) {
        setIsLoading(true);
        event.preventDefault();

        client.post(`/api/posts`, postSchema.safeParse(form).data).then((response) => response.data.data as Post).then((post: Post) => {
                router.push(post.slug);
            },
            (error: AxiosError) => {
                setIsLoading(false);
                alert(error.message);
            }
        )
    }

    function onFormChange(change: string, value: string | number) {
        setForm((prev) => {
            // @ts-expect-error: setting a prop via string type
            prev[change] = value;
            setErrors(postSchema.safeParse(prev));
            return {...prev};
        })
    }

    return <Card>
        <h1 className={'text-3xl font-bold mb-6 text-center'}>{post ? 'Posodobi prispevek' : 'Objavi prispevek'}</h1>

        <hr className="my-2"/>

        <div className="flex flex-row mb-6">
            <button onClick={() => onFormChange('postType', PostType.MARKDOWN)}
                    disabled={!!post}
                    className={`btn mr-3 ${form.postType === PostType.MARKDOWN ? 'btn-primary' : 'btn-primary-outline'}`}>
                <FontAwesomeIcon icon={faFile}
                                 className="mr-2"/> Prispevek
            </button>
            <button onClick={() => onFormChange('postType', PostType.LINK)}
                    disabled={!!post}
                    className={`btn ${form.postType === PostType.LINK ? 'btn-primary' : 'btn-primary-outline'}`}>
                <FontAwesomeIcon icon={faLink} className="mr-2"/>Povezava
            </button>
        </div>

        <form onSubmit={(event) => submit(event)}>
            <FormInput type={'text'} label={'Naslov prispevka:'}
                       name="title"
                       onChange={onFormChange}
                       error={errors.error?.flatten().fieldErrors.title?.join(' ')}
                       autocomplete="off"
                       disabled={isLoading}
                       value={form.title}/>

            {form.postType === PostType.LINK && (<>
                <FormInput type={'text'} label={'URL povezava:'}
                           name="url"
                           onChange={onFormChange}
                           error={errors.error?.flatten().fieldErrors.url?.join(' ')}
                           autocomplete="off"
                           disabled={isLoading || !!post}
                           value={form.url}/>

            </>)}


            {form.postType === PostType.MARKDOWN && (<>
                <div className="mb-4">

                    <FormMarkdown label="Vsebina:" name="markdown" value={form.markdown}
                                  onChange={onFormChange}
                                  error={errors.error?.flatten().fieldErrors.markdown?.join(' ')}

                                  disabled={isLoading}/>
                </div>

                <MarkdownInstructions/></>)}


            <hr className="mt-10 mb-2"/>

            <div className="text-right">
                <button className="btn btn-primary" type="submit"
                        disabled={!errors.success || isLoading}>{post ? 'Posodobi' : 'Objavi'}
                </button>
            </div>

        </form>

    </Card>
}

enum ViewState {
    LOADING,
    NOT_LOGGED_IN,
    ACCESS_DENIED,
    NEW_POST,
    EDIT_POST,
}

function SubmitPost() {
    const {currentUser} = useContext(AuthContext);
    const params = useSearchParams()
    const id: string | null = params.get('id');
    const client = useClientAxios();
    const [post, setPost] = useState(null);
    const [currentViewState, setCurrentViewState] = useState(ViewState.LOADING);

    useEffect(() => {
        if (!currentUser) {
            setCurrentViewState(ViewState.NOT_LOGGED_IN);
        } else {
            if (!id) {
                setCurrentViewState(ViewState.NEW_POST);
            } else {
                client.get(`${process.env.NEXT_PUBLIC_API_URL}/api/posts/${id}`).then(response => response.data).then((response) => {
                    if (isCurrentUserAuthor(currentUser, response.data)) {
                        setCurrentViewState(ViewState.EDIT_POST);
                        setPost(response.data);
                    } else {
                        setCurrentViewState(ViewState.ACCESS_DENIED);
                    }
                });
            }
        }

    }, [id, currentUser]);

    return (<main className={'grid grid-cols-1 gap-3'}>
        <div className="grid grid-cols-1 gap-3 container max-w-[700px] pt-3">
            {currentViewState === ViewState.LOADING ? <Shimmer width={'100%'} height={'4rem'}/> : null}
            {currentViewState === ViewState.NOT_LOGGED_IN ? <LoginNotice/> : null}
            {currentViewState === ViewState.NEW_POST ? <PostForm/> : null}
            {currentViewState === ViewState.EDIT_POST ? <PostForm post={post}/> : null}
            {currentViewState === ViewState.ACCESS_DENIED ? <AccessDeniedNotice/> : null}
        </div>
    </main>);
}

export default function Wrapper() {

    return <Suspense>
        <SubmitPost/>
    </Suspense>
}
