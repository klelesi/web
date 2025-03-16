import {parseISO} from "date-fns/fp/parseISO";
import {isToday} from "date-fns/isToday";
import {isYesterday} from "date-fns/isYesterday";
import {format} from "date-fns";
import {Auth, Post} from "@/interfaces";

export const getNumberOfCommentsText = (numberOfComments: number) => {
    let text = 'komentarjev';

    if (numberOfComments == 1) {
        text = 'komentar';
    } else if (numberOfComments == 2) {
        text = 'komentarja';
    }

    return `${numberOfComments} ${text}`
}

export const humanReadableDate = (dateISO: string) => {
    const cleanedCreatedAt = dateISO.replace(/\.\d+Z$/, 'Z');
    const date: Date = parseISO(cleanedCreatedAt) as Date;

    let formatString = "dd.MM.y 'ob' HH:mm";

    if (isToday(date)) {
        formatString = "'danes ob' HH:mm";
    } else if (isYesterday(date)) {
        formatString = "'včeraj ob' HH:mm";
    }

    return format(date, formatString);
}

export const isCurrentUserAuthor = (auth: Auth | null, post: Post) => {
    return auth && auth.id == post.author.id;
}