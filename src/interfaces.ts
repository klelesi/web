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
    numberOfComments: number;
    author: Author,
    comments: Comment[],
    createdAt: string;
    updatedAt: string;
    lockedAt: string;
    interactions?: Interaction[];
}

export interface Author {
    id: string;
    name: string;
}

export interface MarkdownPost extends Post {
    markdown: string,
    html: string,
}

export interface LinkPost extends Post {
    url: string,
    urlHost: string,
    urlMeta: {
        openGraph: { [key: string]: string }
        [key: string]: unknown
    },
}

export interface Interaction {
    type: 'view';
    interactableId?: string;
    createdAt: string;
    updatedAt: string;
}

export interface Comment {
    id: string,
    author: Author,
    html: string;
    markdown: string,
    comments: Comment[],
    lockedAt: string;
    createdAt: string;
    updatedAt: string;
    deletedAt: string;
}

export interface PaginatedApiResult<T> {
    data: T[],
    meta: {
        nextCursor: string | null;
    }
}

export interface ApiResult<T> {
    data: T,
}

export interface ValidationErrorResponse {
    message: string,
    errors: { [key: string]: string[] }
}
