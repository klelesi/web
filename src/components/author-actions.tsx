'use client';

import {isAuthor} from "@/utils";
import {useContext} from "react";
import {AuthContext} from "@/components/auth-provider";

export default function AuthorActions({item}) {
    const {currentUser} = useContext(AuthContext);

    if(currentUser && isAuthor(currentUser, item)){
        return <div className="flex flex-row">
            <a href={`/objava?id=${item.id}`}>
                <button className="btn-sm btn-primary-outline">Uredi</button>
            </a>
        </div> ;
    }

    return null;
}