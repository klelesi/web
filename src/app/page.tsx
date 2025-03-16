import Image from 'next/image'
import Logo from "@/components/logo";
import {Card} from "@/components/card";
import {PaginatedResult, Post} from "@/interfaces";
import {PostCard} from "@/components/post-card";
import {NextPage} from "@/components/next-page";
import {ReactNode} from "react";

export default async function Home() {
    const posts = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/feed`);
    const data: PaginatedResult<Post> = await posts.json();

    return (
        <div>
            <main className={'grid grid-cols-1 gap-3'}>
                <div className="w-full relative">
                    <Image
                        className={'h-[200px] object-cover'}
                        width={1920}
                        height={200}
                        src="/images/header_frontpage.png"
                        alt="Naslovna grafika v pixel artu, kjer nekdo sedi za računalnikom in pije kavo."
                    />
                    <div
                        className={'absolute top-0 left-0 right-0 bottom-0 text-center flex flex-col justify-center items-center'}>
                        <div className={'flex flex-col justify-center items-center'}>
                            <Logo/>
                            <h1 className={'text-black text-lg mt-2 tracking-tight'}>Kjer so dobre debate doma</h1>
                        </div>
                    </div>
                </div>
                <div className="grid grid-cols-1 gap-3 container max-w-[700px]">
                    {data.data.length === 0 && (<EmptyState>
                        <div className="prose"><p>Trenutno ni prispevkov.</p><p>Nerodno.</p></div>
                    </EmptyState>)}

                    {data.data.map((post) => <div key={post.id}><PostCard post={post}/></div>)}

                    {data.meta.nextCursor && (<NextPage cursor={data.meta.nextCursor}/>)}
                </div>
            </main>
        </div>
    );
}

function EmptyState({children}: {children: ReactNode}) {
    return <Card>
        <div className="text-center py-10 text-lg">
            {children}
        </div>
    </Card>
}

