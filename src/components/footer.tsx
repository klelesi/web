import Link from "next/link";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faGithub } from "@fortawesome/free-brands-svg-icons/faGithub";

export default function Footer() {
    return (
        <>
            <footer className={'bg-white w-full border-t border-black'}>
                <div className={'py-1 text-center w-full container text-sm'}>
                    Klele.si | <Link className={'hover:text-red'} href={'/pravila'}>Pravila</Link> | <Link className={'hover:text-red'} href={'https://github.com/klelesi'}><FontAwesomeIcon icon={faGithub}/></Link>
                </div>
            </footer>
        </>
    )
}