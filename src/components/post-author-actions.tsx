'use client';

import {isCurrentUserAuthor} from "@/utils";
import {useContext} from "react";
import {AuthContext} from "@/components/auth-provider";
import {Post} from "@/interfaces";

export default function PostAuthorActions({item}: { item: Post }) {
    const {currentUser} = useContext(AuthContext);

    if (currentUser && isCurrentUserAuthor(currentUser, item)) {
        return <div className="flex flex-row">
            <a href={`/objava?id=${item.id}`}>
                <button className="btn-sm btn-primary-outline">Uredi</button>
            </a>
        </div>;
    }

    return null;
}