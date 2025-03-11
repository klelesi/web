import {humanReadableDate} from "@/utils";

export const PostMeta = ({author, createdAt}: { author: { name: string }, createdAt: string }) => {
    return <div className={'text-dark-gray text-sm tracking-tight'}>
        {author.name} - {humanReadableDate(createdAt)}
    </div>
}