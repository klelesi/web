import {parseISO} from "date-fns/fp/parseISO";
import {format} from "date-fns";

export const PostMeta = ({author, createdAt}: { author: { name: string }, createdAt: string }) => {
    const cleanedCreatedAt = createdAt.replace(/\.\d+Z$/, 'Z');
    const date = parseISO(cleanedCreatedAt);

    return <div className={'text-dark-gray'}>
        {author.name} - {format(date, "dd.MM.y 'ob' HH:mm")}
    </div>
}