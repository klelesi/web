import PostList from "@/components/post-list";
import {Post} from "@/interfaces.js";

const posts: Post[] = [
    {
        id: 'place/2024',
        title: "Plače slovenskih razvijalcev 2024",
        slug: '/place/2024',
        author: {
            name: 'Miha Medven',
        },
        createdAt: '2024-10-21 08:00',
    },
    {
        id: 'place/2023',
        title: "Plače slovenskih razvijalcev 2023",
        slug: '/place/2023',
        content: "",
        postType: 0,
        author: {
            name: 'Miha Medven',
        },
        createdAt: '2023-11-13 11:00',
    },
    {
        id: 'place/2022',
        title: "Plače slovenskih razvijalcev 2022",
        slug: '/place/2022',
        content: "",
        postType: 0,
        author: {
            name: 'Miha Medven',
        },
        createdAt: '2022-11-12 10:00',
    },
    {
        id: 'place/2021',
        title: "Plače slovenskih razvijalcev 2021",
        slug: '/place/2021',
        content: "",
        postType: 0,
        author: {
            name: 'Miha Medven',
        },
        createdAt: '2021-10-18 10:00',
    }
] as Post[];

export default async function Place() {

    return (
        <div>
            <main className={'grid grid-cols-1 gap-3'}>
                <div className="grid grid-cols-1 gap-3 container max-w-[700px] pt-3">
                    <PostList posts={posts} config={{hideActions: true}}></PostList>
                </div>
            </main>
        </div>
    );
}

