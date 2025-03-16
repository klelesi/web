'use client';

import useAuth from "@/hooks/useAuth";
import {isAuthor} from "@/utils";

export default function AuthorActions({item}) {
    const {auth, isLoggedIn} = useAuth();

    if(isLoggedIn && isAuthor(auth, item)){
        return <div className="flex flex-row">
            <a href={`/objava?id=${item.id}`}>
                <button className="btn-sm btn-primary-outline">Uredi</button>
            </a>
        </div> ;
    }

    return null;
}