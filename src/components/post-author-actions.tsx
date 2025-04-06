'use client';

import {isCurrentUserAuthor} from "@/utils";
import {useContext, useState} from "react";
import {AuthContext} from "@/hooks/auth-provider";
import {Post} from "@/interfaces";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faTrash} from "@fortawesome/free-solid-svg-icons";
import usePostApi from "@/hooks/usePostApi";
import {useRouter} from "next/navigation";

enum ViewState {
    IDLE,
    RESOLVING,
}

export default function PostAuthorActions({item}: { item: Post }) {
    const [currentViewState, setCurrentViewState] = useState(ViewState.IDLE)
    const {currentUser} = useContext(AuthContext);
    const {deletePost} = usePostApi();
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

    if (currentUser && isCurrentUserAuthor(currentUser, item)) {
        return <div className="flex flex-row">
            <a
                disabled={currentViewState !== ViewState.IDLE} href={`/objava?id=${item.id}`} className={'mr-2'}>
                <button className="btn-sm btn-primary-outline">Uredi</button>
            </a>
            <button
                disabled={currentViewState !== ViewState.IDLE}
                onClick={() => deleteItem()}
                title={'Izbriši prispevek'} className="btn-sm btn-primary-outline"><FontAwesomeIcon icon={faTrash}/>
            </button>
        </div>;
    }

    return null;
}