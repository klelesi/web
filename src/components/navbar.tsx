'use client';

import Link from 'next/link'
import Logo from "./logo";
import {useContext} from "react";
import {AuthContext} from "@/hooks/auth-provider";

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
                        {currentUser && (<>
                            <Link className={'btn btn-primary btn-sm mr-4'} href={'/objava'}>Objavi prispevek</Link>
                            <Link className={'btn btn-link btn-sm'} href={'/profil'}>Profil</Link>
                            <button className={'btn btn-link btn-sm'} onClick={() => logoutUser()}>Odjava</button>
                        </>)}

                        {!currentUser && (<>
                            <Link className={'mx-2 btn btn-sm btn-primary-outline'} href={'/prijava'}>Prijava</Link>
                            <Link className={'mx-2 btn btn-sm btn-primary'} href={'/registracija'}>Registracija</Link>
                        </>)}
                    </div>
                </div>
            </nav>
        </>
    )
}