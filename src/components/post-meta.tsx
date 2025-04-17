import { humanReadableDate } from "@/utils";

export const PostMeta = ({ author, createdAt }: { author: { name: string; username: string }; createdAt: string }) => {
  return (
    <div className={"text-sm tracking-tight"}>
      <span className={'font-semibold'} title={author.name}>@{author.username}</span> - <span className="text-dark-gray ">{humanReadableDate(createdAt)}</span>
    </div>
  );
};
