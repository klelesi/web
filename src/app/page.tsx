import Image from 'next/image'
import Logo from "@/components/logo";
import {Card} from "@/components/card";

export default async function Home() {
    //const posts = await fetch(process.env.NEXT_PUBLIC_API_URL + '/api/feed');
    //const data: PaginatedResult<Post> = await posts.json();

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
                <div className="grid grid-cols-1 gap-3 container max-w-[700px] prose">
                   <ComingSoon></ComingSoon>
                </div>
            </main>
        </div>
    );
}

function ComingSoon(){
    return <Card>
        <div className="text-center py-10">
            <h1 className={'text-3xl font-semibold text-center mb-6'}>Prihaja kmalu!</h1>

            <p>Trenutno v razvoju. Lahko slediš na <a href="https://github.com/klelesi">Github</a>, ali na <a href="https://blog.klele.si">blog.klele.si</a>.</p>

            <p className="text-sm">Če te zanimajo plače, obišči <a href="/place">plače</a>.</p>
        </div>
    </Card>
}

