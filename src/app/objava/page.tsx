'use client';

import {Card} from "@/components/card";
import {faLink, faFile} from "@fortawesome/free-solid-svg-icons";
import {z} from "zod";

import {useState} from "react";
import useAxios from "@/hooks/useAxios";
import {AxiosError} from "axios";
import useAuth from "@/hooks/useAuth";
import {LoginNotice} from "@/components/login-notice";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import FormInput from "@/components/form-input";
import FormMarkdown from "@/components/form-markdown";
import MarkdownInstructions from "@/components/markdown-instructions";
import {useRouter} from "next/navigation";


enum PostType {
    POST = 0,
    LINK = 1,
}

const postSchema = z.discriminatedUnion('postType', [
    z.object({
        postType: z.literal(PostType.POST),
        title: z.string().min(1, "Naslov je obvezen!"),
        markdown: z.string().min(1, "Vsebina je obvezna!"),
    }),
    z.object({
        postType: z.literal(PostType.LINK),
        title: z.string().min(1, "Naslov je obvezen!"),
        url: z.string().url("Tole pa ni veljaven URL naslov."),
    }),
]);

const PostForm = () => {
    const client = useAxios();
    const router = useRouter();

    const [form, setForm] = useState({
        postType: PostType.POST,
        title: '',
        markdown: '',
        url: '',
    })
    const [errors, setErrors] = useState(postSchema.safeParse(form));
    const [isLoading, setIsLoading] = useState(false);


    function submit(event) {
        event.preventDefault();

        client.post(`/api/posts`, postSchema.safeParse(form).data).then((response) => response.data.data).then((post: any) => {
                router.push('/guna/' + post.slug);
            },
            (error: AxiosError) => {
                setIsLoading(false);
                alert(error.message);
            }
        )
    }

    function onFormChange(change, value) {
        setForm((prev) => {
            prev[change] = value;
            setErrors(postSchema.safeParse(prev));
            return {...prev};
        })
    }

    return <div className="grid grid-cols-1 gap-3 container max-w-[700px] pt-3">
        <Card>
            <h1 className={'text-3xl font-bold mb-6 text-center'}>Objavi prispevek</h1>

            <hr className="my-2"/>

            <div className="flex flex-row mb-6">
                <button onClick={() => onFormChange('postType', PostType.POST)}
                        className={`btn mr-3 ${form.postType === PostType.POST ? 'btn-primary' : 'btn-primary-outline'}`}>
                    <FontAwesomeIcon icon={faFile}
                                     className="mr-2"/> Prispevek
                </button>
                <button onClick={() => onFormChange('postType', PostType.LINK)}
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
                               disabled={isLoading}
                               value={form.url}/>

                </>)}


                {form.postType === PostType.POST && (<>
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
                            disabled={!errors.success || isLoading}>Objavi
                    </button>
                </div>

            </form>

        </Card>
    </div>
}

export default function Submit() {
    const {isLoggedIn} = useAuth();

    return (
        <div>
            <main className={'grid grid-cols-1 gap-3'}>
                {!isLoggedIn && <LoginNotice/>}
                {isLoggedIn && <PostForm/>}
            </main>
        </div>
    );
}

