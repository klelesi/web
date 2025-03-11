
export enum PostType {
    MARKDOWN = 0,
    LINK = 1,
}

export interface Post {
    id: string;
    slug: string;
    postType: PostType,
    title: string,
    url?:string,
    urlHost?: string,
    numberOfComments: number;
    author: {
        name: string;
    }
    createdAt: string;
    updatedAt: string;
}

export interface PaginatedResult<T> {
    data: T[],
    meta: {
        nextCursor: string | null;
    }
}