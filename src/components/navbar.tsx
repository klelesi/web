'use client';

import Link from 'next/link'
import Logo from "./logo";
import {useContext} from "react";
import {AuthContext} from "@/components/auth-provider";

export default function Navbar() {
    const {currentUser, logoutUser } = useContext(AuthContext);

    return (
        <>
            <nav className={'bg-white w-full border-b border-black px-3 flex flex-row justify-between items-center'}
                 role="navigation">
                <div className={'py-5 flex flex-row justify-between items-center w-full container'}>
                    <Link href="/" className={'btn-logo flex flex-row items-baseline'}>
                        <Logo/>
                    </Link>

                    <div className="flex flex-row items-center font-semibold">
                        <Link className={'mx-2 hover:underline'} href={'/place'}>Plače</Link>
                        <Link className={'mx-2 hover:underline'} href={'https://blog.klele.si'}>Devlog</Link>

                        {currentUser && (<>
                            <Link className={'mx-2 btn-primary btn'} href={'/objava'}>Objavi prispevek</Link>
                            <Link className={'mx-2 hover:underline'} href={'/profil'}>Profil</Link>
                            <button className={'mx-2 btn btn-sm btn-primary-outline'} onClick={() => logoutUser()}>Odjava
                            </button>
                        </>)}

                        {!currentUser && (<>
                            <Link className={'mx-2 btn btn-sm btn-primary-outline'} href={'/prijava'}>Prijava</Link>
                        </>)}
                    </div>
                </div>
            </nav>
        </>
    )
}