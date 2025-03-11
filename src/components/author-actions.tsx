'use client';

import {useEffect} from "react";
import useAuth from "@/hooks/useAuth";

export default function AuthorActions({post}) {
    const {auth} = useAuth();

    if(auth && auth.id == post.author.id){
        return <div className="flex flex-row">
            <a href={`/objava?id=${post.id}`}>
                <button className="btn-sm btn-primary-outline">Uredi</button>
            </a>
        </div> ;
    }

    return null;
}