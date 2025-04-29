"use client";

import { Comment, Post } from "@/interfaces";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowUp } from "@fortawesome/free-solid-svg-icons/faArrowUp";
import { faArrowDown } from "@fortawesome/free-solid-svg-icons/faArrowDown";
import { useContext, useEffect, useRef, useState } from "react";
import { AuthContext } from "@/hooks/auth-provider";
import { NotificationCard } from "@/components/notification-card";
import Link from "next/link";
import useUserInteractionApi from "@/hooks/useUserInteractionApi";

export enum UpvoteDownvoteState {
  INDIFFERENT,
  UPVOTE,
  DOWNVOTE,
}

export const UpvoteDownvote = ({
  item,
  initialState = UpvoteDownvoteState.INDIFFERENT,
}: {
  item: Post | Comment;
  initialState?: UpvoteDownvoteState;
}) => {
  const ref = useRef<HTMLDialogElement | null>(null);
  const { currentUser } = useContext(AuthContext);
  const { upvotePost, removeUpvotePost, downvotePost, removeDownvotePost } = useUserInteractionApi();
  const [currentState, setCurrentState] = useState(initialState);
  const [score, setScore] = useState(item.score);

  useEffect(() => {
    setCurrentState(initialState);
  }, [initialState]);

  const upvote = () => {
    if (!currentUser) {
      show();
      return;
    }

    if (currentState === UpvoteDownvoteState.UPVOTE) {
      setScore((prev) => prev - 1);
      setCurrentState(UpvoteDownvoteState.INDIFFERENT);
      removeUpvotePost({ postId: item.id }).then(() => {});
    } else {
      if (currentState === UpvoteDownvoteState.DOWNVOTE) {
        setScore((prev) => prev + 2);
      } else {
        setScore((prev) => prev + 1);
      }
      setCurrentState(UpvoteDownvoteState.UPVOTE);
      upvotePost({ postId: item.id }).then(() => {});
    }
  };

  const downvote = () => {
    if (!currentUser) {
      show();
      return;
    }

    if (currentState === UpvoteDownvoteState.DOWNVOTE) {
      setScore((prev) => prev + 1);
      setCurrentState(UpvoteDownvoteState.INDIFFERENT);
      removeDownvotePost({ postId: item.id }).then(() => {});
    } else {
      if (currentState === UpvoteDownvoteState.UPVOTE) {
        setScore((prev) => prev - 2);
      } else {
        setScore((prev) => prev - 1);
      }
      setCurrentState(UpvoteDownvoteState.DOWNVOTE);
      downvotePost({ postId: item.id }).then(() => {});
    }
  };

  const show = () => {
    if (ref) {
      ref.current?.showModal();
    }
  };

  const hide = () => {
    if (ref) {
      ref.current?.close();
    }
  };

  return (
    <>
      <div className="flex flex-col items-center align-center">
        <button
          className={"btn btn-sm btn-link " + (currentState === UpvoteDownvoteState.UPVOTE ? "text-red" : "")}
          title={"Glasuj za"}
          onClick={() => upvote()}
        >
          <FontAwesomeIcon icon={faArrowUp} />
        </button>
        <span className="font-semibold font-sans leading-none py-1">{score}</span>
        <button
          className={"btn btn-sm btn-link " + (currentState === UpvoteDownvoteState.DOWNVOTE ? "text-blue" : "")}
          title={"Glasuj proti"}
          onClick={() => downvote()}
        >
          <FontAwesomeIcon icon={faArrowDown} />
        </button>
      </div>
      <dialog ref={ref}>
        <NotificationCard
          title={"Joj. Za tole se moraš prijaviti."}
          body={"Glasovanje je omogočeno samo prijavljenim uporabnikom."}
          action={
            <div className="flex flex-row justify-center">
              <button className="btn btn-primary-outline mr-2" onClick={() => hide()}>
                Prekliči
              </button>
              <Link href={"/prijava"}>
                <button className="btn btn-primary">Prijava</button>
              </Link>
            </div>
          }
        />
      </dialog>
    </>
  );
};
