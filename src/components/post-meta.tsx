import { humanReadableDate } from "@/utils";

export const PostMeta = ({ author, createdAt }: { author: { name: string; username: string }; createdAt: string }) => {
  return (
    <div className={"text-dark-gray text-sm tracking-tight"}>
      <span title={author.name}>@{author.username}</span> - {humanReadableDate(createdAt)}
    </div>
  );
};
