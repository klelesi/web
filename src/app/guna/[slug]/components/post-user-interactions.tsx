'use client';
import {useContext, useEffect} from "react";
import {Post} from "@/interfaces";
import {AuthContext} from "@/hooks/auth-provider";
import useUserInteractionApi from "@/hooks/useUserInteractionApi";

export default function PostUserInteractions({post}: { post: Post }) {
    const {currentUser} = useContext(AuthContext);
    const {storeView} = useUserInteractionApi();

    useEffect(() => {
        if (currentUser) {
            storeView({postId: post.id}).then(() => {
            });
        }
    }, [currentUser]);

    return <></>
}