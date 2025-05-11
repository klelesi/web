import { parseISO } from "date-fns/fp/parseISO";
import { isToday } from "date-fns/isToday";
import { isYesterday } from "date-fns/isYesterday";
import { format } from "date-fns";
import { Auth, Comment, Interaction, Post } from "@/interfaces";
import { UpvoteDownvoteState } from "@/components/upvote-downvote";

export const getNumberOfCommentsText = (numberOfComments: number): string => {
  let text = "komentarjev";
  let base = numberOfComments;

  if (base > 100) {
    base = base % 100;
  }

  if (base == 1) {
    text = "komentar";
  } else if (base == 2) {
    text = "komentarja";
  } else if (base == 3) {
    text = "komentarji";
  } else if (base == 4) {
    text = "komentarji";
  }

  return `${numberOfComments} ${text}`;
};

export const humanReadableDate = (dateISO: string): string => {
  const cleanedCreatedAt = dateISO.replace(/\.\d+Z$/, "Z");
  const date: Date = parseISO(cleanedCreatedAt) as Date;

  let formatString = "dd.MM.y 'ob' HH:mm";

  if (isToday(date)) {
    formatString = "'danes ob' HH:mm";
  } else if (isYesterday(date)) {
    formatString = "'včeraj ob' HH:mm";
  }

  return format(date, formatString);
};

export const isCurrentUserAuthor = (auth: Auth | null, item: Post | Comment) => {
  return !!(auth && auth.id === item.author.id);
};

export const isLocked = (item: Post | Comment) => {
  return !!item.lockedAt;
};

export const resolveUpvoteDownvoteState = (interactions: Interaction[] | undefined) => {
  if (!interactions || interactions.length === 0) {
    return UpvoteDownvoteState.INDIFFERENT;
  }

  const validInteractions = interactions.filter((item) => ["upvote", "downvote"].includes(item.type));

  if (validInteractions.length > 0) {
    const firstInteraction = validInteractions[0];

    if (firstInteraction.type === "upvote") {
      return UpvoteDownvoteState.UPVOTE;
    } else if (firstInteraction.type === "downvote") {
      return UpvoteDownvoteState.DOWNVOTE;
    }
  }

  return UpvoteDownvoteState.INDIFFERENT;
};
