import Shimmer from "./shimmer";
import {ChangeEvent, useState} from "react";
import {UnsafeHTML} from "@/components/unsafe-html";
import useClientAxios from "@/hooks/useClientAxios";
import {Card} from "@/components/card";
import { MarkdownPost, Post } from "@/interfaces";

export default function FormMarkdown(props: {
    label: string,
    name: string,
    value: string,
    onChange: (prop: string, value: string | number) => void,
    error?: string,
    autocomplete?: string,
    disabled: boolean,
    rows?: number
}) {
    const client = useClientAxios();

    const [inPreview, setInPreview] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [previewHtml, setPreviewHtml] = useState('');

    const showPreview = () => {
        setInPreview(true);
        setIsLoading(true);

        client.post(`/markdown`, {markdown: props.value}).then((response) => response.data.data as MarkdownPost).then((res: MarkdownPost) => {
                setPreviewHtml(res.html!);
                setIsLoading(false);
            }
        )
    }

    const hidePreview = () => {
        setInPreview(false);
        setIsLoading(false);
    }

    const onFormInputChange = (event: ChangeEvent) => {
        // @ts-expect-error: wrong type for target
        props.onChange(props.name, event.target.value);
        event.preventDefault();
        setPreviewHtml('');
    }

    return (
        <div>
            <label><span className="block text-sm leading-normal tracking-wide text-normal mb-1">{props.label}</span>
                {
                    inPreview ? (
                            isLoading ? <Shimmer height={'5rem'}/> : <Card>
                                <div className="prose">
                                    <UnsafeHTML html={previewHtml}/>
                                </div>
                            </Card>
                        ) :
                        <textarea
                            className={'w-full block border p-2 ' + (props.error ? ' text-error border-error bg-error-washed' : ' text-black border-black ')}
                            rows={props.rows ?? 18}
                            disabled={props.disabled}
                            value={props.value}
                            onChange={onFormInputChange}
                            placeholder={''}/>
                }

            </label>

            <p className="text-error mt-2">{props.error}</p>

            <div className="mt-4">
                <div className={'mr-2 flex flex-row items-center'}>
                    {!inPreview ? <button type={'button'} className="btn btn-sm btn-primary-outline mr-2"
                                          onClick={() => showPreview()}
                                          disabled={props.value.trim().length === 0}>Predogled
                        </button> :
                        <button type={'button'} className="btn btn-sm btn-primary-outline mr-2"
                                onClick={() => hidePreview()}>Uredi</button>}
                    <p className="text-sm text-black opacity-50">Uporabljamo Markdown.</p>
                </div>
            </div>

        </div>
    )
}