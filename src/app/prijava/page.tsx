'use client';

import {Card} from "@/components/card";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faGithub} from "@fortawesome/free-brands-svg-icons/faGithub";

export default function Login() {
    return (
        <div>
            <main className={'grid grid-cols-1 gap-3'}>
                <div className="grid grid-cols-1 gap-3 container max-w-[700px] pt-3">
                    <Card>
                        <div className="text-center py-6">
                            <h1 className={'text-3xl font-bold mb-6'}>Prijava</h1>
                            <p className={'mb-6'}>Trenutno podpiramo prijavo le prek:</p>
                            <a href={`${process.env.NEXT_PUBLIC_API_URL}/api/auth/github/redirect`}>
                                <button className={'btn btn-primary-outline'}>
                                    <FontAwesomeIcon className={'mr-2'} icon={faGithub}></FontAwesomeIcon>GitHub
                                </button>
                            </a>
                        </div>
                    </Card>
                </div>
            </main>
        </div>
    );
}

