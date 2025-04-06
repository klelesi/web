'use client';

import {isCurrentUserAuthor} from "@/utils";
import {useContext, useState} from "react";
import {AuthContext} from "@/hooks/auth-provider";
import {Post} from "@/interfaces";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faTrash} from "@fortawesome/free-solid-svg-icons";
import usePostApi from "@/hooks/usePostApi";
import {useRouter} from "next/navigation";
import {boolean} from "zod";

enum ViewState {
    IDLE,
    RESOLVING,
}

export default function PostAuthorActions({item}: { item: Post }) {
    const [currentViewState, setCurrentViewState] = useState(ViewState.IDLE)
    const {currentUser, permissions} = useContext(AuthContext);
    const {deletePost, lockPost, unlockPost} = usePostApi();
    const router = useRouter();

    const deleteItem = () => {
        if (!confirm("Res želiš izbrisati prispevek?")) {
            return;
        }

        setCurrentViewState(ViewState.RESOLVING);

        deletePost(item.id).then(() => {
            setCurrentViewState(ViewState.IDLE);
            router.push('/');
        })
    }

    const toggleLock = () => {
        setCurrentViewState(ViewState.RESOLVING);

        if (item.lockedAt) {
            unlockPost(item.id).then(() => {
                setCurrentViewState(ViewState.IDLE);
                window.location.href = window.location.href;
            });
        } else {
            lockPost(item.id).then(() => {
                setCurrentViewState(ViewState.IDLE);
                window.location.href = window.location.href;
            });
        }
    }

    if (!currentUser) {
        return null;
    }

    function hasPermission(permission: string) {
        return permissions.includes(permission);
    }

    return <div className="flex flex-row">
        {isCurrentUserAuthor(currentUser, item) || hasPermission('moderate content') && (<>
            <a
                disabled={currentViewState !== ViewState.IDLE} href={`/objava?id=${item.id}`} className={'mr-2'}>
                <button className="btn-sm btn-primary-outline">Uredi</button>
            </a>
        </>)}

        {hasPermission('lock content') && (<>
            <button
                disabled={currentViewState !== ViewState.IDLE}
                onClick={() => toggleLock()}
                className="btn-sm btn-primary-outline mr-2">{item.lockedAt ? 'Odkleni' : 'Zakleni'}           </button>
        </>)}

        {isCurrentUserAuthor(currentUser, item) || hasPermission('delete content') && (<>
            <button
                disabled={currentViewState !== ViewState.IDLE}
                onClick={() => deleteItem()}
                title={'Izbriši prispevek'} className="btn-sm btn-primary-outline"><FontAwesomeIcon icon={faTrash}/>
            </button>
        </>)}
    </div>

    return null;
}