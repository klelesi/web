import Image from "next/image";
import Logo from "@/components/logo";
import { PaginatedApiResult, Post } from "@/interfaces";
import { NextPage } from "@/components/next-page";
import React from "react";
import AuthEnhancer from "@/components/auth-enhancer";
import { NotificationCard } from "@/components/notification-card";

export const revalidate = 0;

const fetchFeed = async (): Promise<PaginatedApiResult<Post>> => {
  return await (await fetch(`${process.env.NEXT_PUBLIC_API_URL}/feed`)).json();
};

export default async function Page() {
  const paginatedResult = await fetchFeed();

  return (
    <div className={"grid grid-cols-1 gap-3 -mt-3"}>
      <div className="w-full relative">
        <Image
          className={"h-[200px] object-cover w-full"}
          width={1920}
          height={200}
          priority={true}
          src="/images/header_frontpage.png"
          alt="Naslovna grafika v pixel artu, kjer nekdo sedi za računalnikom in pije kavo."
        />
        <div className={"absolute top-0 left-0 right-0 bottom-0 text-center flex flex-col justify-center items-center"}>
          <div className={"flex flex-col justify-center items-center"}>
            <Logo />
            <h1 className={"text-black text-xl mt-2 tracking-tight"}>Kjer so dobre debate doma</h1>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-3 container w-page">
        {paginatedResult.data.length === 0 && <NotificationCard title={"Trenutno ni prispevkov."} body={"Mogoče je čas, da spišeš prvega."} />}

        <AuthEnhancer posts={paginatedResult.data} />

        {paginatedResult.meta.nextCursor && <NextPage cursor={paginatedResult.meta.nextCursor} />}
      </div>
    </div>
  );
}
