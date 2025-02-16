import Link from 'next/link'
import Logo from "./logo";

export default function Navbar() {
    return (
        <>
            <nav className={'bg-white w-full border-b border-black px-3 flex flex-row justify-between items-center'}
                 role="navigation">
                <div className={'py-5 flex flex-row justify-between items-center w-full container'}>
                    <Link href="/" className={'btn-logo flex flex-row items-baseline'}>
                        <Logo/>
                    </Link>
                </div>
            </nav>
        </>
    )
}