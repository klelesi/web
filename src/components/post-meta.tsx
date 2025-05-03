"use client";

import { humanReadableDate } from "@/utils";
import { Post } from "@/interfaces";
import { useContext } from "react";
import { AuthContext } from "@/hooks/auth-provider";

export const PostMeta = ({ author, createdAt, post, isEdited = false }: { author: { id?: string; name: string; username: string }; createdAt: string; post?: Post, isEdited?: boolean }) => {
  const { currentUser } = useContext(AuthContext);

  const isPostAuthor = post && post.author.id === author.id;
  const isCurrentUserAuthor = currentUser && currentUser.id === author.id;

  return (
    <div className={"text-sm tracking-tight flex flex-row"}>
      <span className={"font-semibold " + (isCurrentUserAuthor && 'text-red')} title={author.name}>
        @{author.username}
      </span>
      <span className="mx-2">-</span>
      <span className="text-dark-gray ">{humanReadableDate(createdAt)} {isEdited && (<span title={'Posodobljeno'}>(*)</span>)}</span>
      {isPostAuthor && <div className="font-bold text-sm tracking-tight bg-blue px-2 ml-2 text-white">avtor</div>}
    </div>
  );
};
