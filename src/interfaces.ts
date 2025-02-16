export interface Post {
    id: string;
    slug: string;
    title: string
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