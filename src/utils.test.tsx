import { expect, test } from "vitest";
import { getNumberOfCommentsText, humanReadableDate, isCurrentUserAuthor, isLocked, resolveUpvoteDownvoteState } from "@/utils";
import { Auth, Interaction, Post } from "@/interfaces";
import { UpvoteDownvoteState } from "@/components/upvote-downvote";

test("Utils: get number of comments text", () => {
  expect(getNumberOfCommentsText(0)).equals("0 komentarjev");
  expect(getNumberOfCommentsText(1)).equals("1 komentar");
  expect(getNumberOfCommentsText(2)).equals("2 komentarja");
  expect(getNumberOfCommentsText(3)).equals("3 komentarji");
  expect(getNumberOfCommentsText(4)).equals("4 komentarji");
  expect(getNumberOfCommentsText(5)).equals("5 komentarjev");
  expect(getNumberOfCommentsText(10)).equals("10 komentarjev");
  expect(getNumberOfCommentsText(101)).equals("101 komentar");
  expect(getNumberOfCommentsText(102)).equals("102 komentarja");
  expect(getNumberOfCommentsText(103)).equals("103 komentarji");
  expect(getNumberOfCommentsText(1000)).equals("1000 komentarjev");
  expect(getNumberOfCommentsText(1001)).equals("1001 komentar");
  expect(getNumberOfCommentsText(84512)).equals("84512 komentarjev");
});

test("Utils: is current user author", () => {
  const auth1: Auth = { id: "12345", email: "john.doe@example.com", name: "John Doe", username: "john.doe" };
  const auth2: Auth = { id: "54121", email: "jane.doe@example.com", name: "Jane Doe", username: "john.doe" };
  const post: Post = { author: auth1 } as unknown as Post;

  expect(isCurrentUserAuthor(auth1, post)).equals(true);
  expect(isCurrentUserAuthor(auth2, post)).equals(false);
  expect(isCurrentUserAuthor(null, post)).equals(false);
});

test("Utils: returns human readable date", () => {
  const today = humanReadableDate(new Date().toISOString());
  expect(today).toContain("danes ob");

  const yesterday = new Date();
  yesterday.setDate(new Date().getDate() - 1);
  expect(humanReadableDate(yesterday.toISOString())).toContain("včeraj ob");
});

test("Utils: checks locked", () => {
  expect(isLocked({ lockedAt: null } as unknown as Post)).equals(false);
  expect(isLocked({ lockedAt: "2024-10-10 10:10:00" } as unknown as Post)).equals(true);
});

test("Utils: resolves interactions for upvote/downvote state", () => {
  //  Default is indifferent
  expect(resolveUpvoteDownvoteState([])).equals(UpvoteDownvoteState.INDIFFERENT);

  expect(resolveUpvoteDownvoteState([{ type: "view" } as unknown as Interaction])).equals(UpvoteDownvoteState.INDIFFERENT);
  expect(resolveUpvoteDownvoteState([{ type: "upvote" } as unknown as Interaction])).equals(UpvoteDownvoteState.UPVOTE);
  expect(resolveUpvoteDownvoteState([{ type: "downvote" } as unknown as Interaction])).equals(UpvoteDownvoteState.DOWNVOTE);

  //  First interaction is the fallback, if multiple interactions are present
  expect(resolveUpvoteDownvoteState([{ type: "downvote" } as unknown as Interaction, { type: "upvote" } as unknown as Interaction])).equals(
    UpvoteDownvoteState.DOWNVOTE,
  );
  expect(resolveUpvoteDownvoteState([{ type: "upvote" } as unknown as Interaction, { type: "downvote" } as unknown as Interaction])).equals(
    UpvoteDownvoteState.UPVOTE,
  );
});
