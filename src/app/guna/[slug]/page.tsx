'use client';

import {Card} from "@/components/card";
import useAxios from "@/hooks/useAxios";
import {use, useEffect, useState} from "react";
import Shimmer from "@/components/shimmer";
import {useRouter} from "next/navigation";
import {UnsafeHTML} from "@/components/unsafe-html";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faLink} from "@fortawesome/free-solid-svg-icons";

enum State {
    LOADING,
    SHOWING
}
interface ViewState {
    state: State,
    data: any,
}


const MarkdownPost = ({post}) => {
    return <div className={'flex flex-col'}>

        <h1 className={'text-5xl font-semibold mb-6'}>{post.title}</h1>

        <div className={'prose'}>
            <UnsafeHTML html={post.html}></UnsafeHTML>
        </div>
    </div>
}

const LinkPost = ({post}) => {
    return <div className={'flex flex-col'}>

        <h1 className={'text-5xl font-semibold mb-6'}>{post.title}</h1>

        <a href={post.url} title={post.urlMeta['openGraph']['og:title']} rel={'noreferrer nofollow'}>
        <Card>
            <div className="grid grid-cols-3">
                <div className={'flex justify-center items-center'}>
                    <img src={post.urlMeta['openGraph']['og:image']} alt="" className={'w-full'}/>
                </div>

                <div className={'col-span-2 p-3'}>
                    <h3 className={'font-semibold text-lg mb-3'}>{post.urlMeta['openGraph']['og:title']}</h3>

                    <p className="text-sm">{post.urlMeta['openGraph']['og:description']}</p>
                </div>
            </div>

            <div className="text-sm">
                <FontAwesomeIcon icon={faLink} /> {post.url}
            </div>
        </Card>
        </a>

    </div>
}

export default function Post({params}){
    const slug = use(params).slug;
    const client = useAxios();

    const [data, setData] = useState<ViewState>({
        state: State.LOADING,
        data: null,
    })

    useEffect(() => {
        client.get('/api/posts/' + slug).then(response => response.data).then((data) => {
            setData({state: State.SHOWING, data: data.data});
        })
    }, []);



    return <div className="grid grid-cols-1 gap-3 container max-w-[700px] pt-3">
        <Card>
            {data.state === State.LOADING && (<Shimmer height={'5rem'}/>)}

            {data.state === State.SHOWING && data.data.postType == 0 &&(<MarkdownPost post={data.data}/>)}
            {data.state === State.SHOWING && data.data.postType == 1 &&(<LinkPost post={data.data}/>)}
        </Card>
    </div>
}


