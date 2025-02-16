'use client';

import React, {useEffect, useState} from 'react';
import {useIntersectionObserver} from 'react-intersection-observer-hook';
import PostList from "@/components/post-list";
import {PaginatedResult, Post} from "@/interfaces.js";

enum State {
    HIDDEN,
    LOADING,
    RESOLVED,
}

export const NextPage = ({cursor}: { cursor: string | null }) => {
    const [ref, {entry}] = useIntersectionObserver();
    const [data, setData] = useState<PaginatedResult<Post>>({data: [], meta: {nextCursor: null}});
    const isVisible = entry && entry.isIntersecting;
    const [state, setState] = useState(State.HIDDEN);

    useEffect(() => {
        if (isVisible && state === State.HIDDEN) {
            setState(State.LOADING);

            fetch(process.env.NEXT_PUBLIC_API_URL + '/api/feed?cursor=' + cursor).then((response => response.json())).then((data) => {
                setData(data);
                setState(State.RESOLVED);
            })
        }
    }, [isVisible, cursor, state]);

    if (!cursor) {
        return;
    }

    return <div ref={ref}>
        {state === State.RESOLVED && (<>
            <PostList posts={data.data}></PostList><NextPage cursor={data.meta.nextCursor}/>
        </>)}
    </div>
}