export enum PostType {
    MARKDOWN = 0,
    LINK = 1,
}

export interface Auth {
    id: string;
    email: string;
    name: string;
}

export interface Post {
    id: string;
    slug: string;
    postType: PostType,
    title: string,
    markdown?: string,
    url?: string,
    urlHost?: string,
    numberOfComments: number;
    author: {
        id: string;
        name: string;
    }
    comments: Comment[],
    createdAt: string;
    updatedAt: string;
}

export interface Comment {
    id: string,
    author: {
        id: string;
        name: string;
    }
    html: string;
    markdown?: string,
    comments: Comment[],
    createdAt: string;
    updatedAt: string;
}

export interface PaginatedResult<T> {
    data: T[],
    meta: {
        nextCursor: string | null;
    }
}