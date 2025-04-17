'use client';

import React, {useEffect, useState} from 'react';
import {useIntersectionObserver} from 'react-intersection-observer-hook';
import PostList from "@/components/post-list";
import {PaginatedApiResult, Post} from "@/interfaces.js";
import Shimmer from "@/components/shimmer";
import usePostApi from "@/hooks/usePostApi";

enum State {
    HIDDEN,
    LOADING,
    RESOLVED,
}

export const NextPage = ({cursor}: { cursor: string | null }) => {
    const [ref, {entry}] = useIntersectionObserver();
    const [data, setData] = useState<PaginatedApiResult<Post>>({data: [], meta: {nextCursor: null}});
    const isVisible = entry && entry.isIntersecting;
    const [state, setState] = useState(State.HIDDEN);
    const {getFeed} = usePostApi();

    useEffect(() => {
        if (isVisible && state === State.HIDDEN) {
            setState(State.LOADING);

            getFeed({cursor}).then((response) => {
                setData(response.data);
                setState(State.RESOLVED);
            })
        }
    }, [isVisible, cursor, state]);

    if (!cursor) {
        return;
    }

    return <>
        <div ref={ref}></div>
        {state === State.LOADING && (<>
            <Shimmer height={'3rem'}/>
        </>)}
        {state === State.RESOLVED && (<>
            <PostList posts={data.data}></PostList><NextPage cursor={data.meta.nextCursor}/>
        </>)}
    </>
}