'use client';

import {Card} from "@/components/card";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faGithub} from "@fortawesome/free-brands-svg-icons/faGithub";
import Shimmer from "@/components/shimmer";
import {useContext, useEffect, useState} from "react";
import {useRouter} from "next/navigation";
import useUserApi from "@/hooks/useUserApi";
import {AuthContext} from "@/hooks/auth-provider";

enum State {
    CHECKING,
    IDLE
}

export default function Login() {
    const [state, setState] = useState(State.CHECKING);
    const {loginUser} = useContext(AuthContext);
    const {checkLogin} = useUserApi();


    useEffect(() => {
        checkLogin(() => setState(State.IDLE));
    }, []);

    return (
        <div>
            <main className={'grid grid-cols-1 gap-3'}>
                <div className="grid grid-cols-1 gap-3 container max-w-[700px] pt-3">
                    <Card>
                        <div className="text-center py-6">
                            {state === State.CHECKING ? <>
                                <div className="mb-2"><Shimmer height={'2rem'}/></div>
                                <div className="mb-2"><Shimmer height={'1rem'}/></div>
                                <div className="mb-2"><Shimmer height={'3rem'}/></div>
                            </> : null}

                            {state === State.IDLE ? <>
                                <h1 className={'text-3xl font-bold mb-6'}>Prijava</h1>
                                <p className={'mb-6'}>Trenutno podpiramo prijavo le prek:</p>
                                <a href={`${process.env.NEXT_PUBLIC_API_URL}/api/auth/github/redirect`}>
                                    <button className={'btn btn-primary-outline'}>
                                        <FontAwesomeIcon className={'mr-2'} icon={faGithub}></FontAwesomeIcon>GitHub
                                    </button>
                                </a>

                                <hr className="my-10"/>

                                <h2 className="text-xl font-bold mb-6">Še nimaš računa?</h2>

                                <a href="/registracija">
                                    <button className="btn btn-sm btn-primary">Registriraj se</button>
                                </a>
                            </> : null}
                        </div>
                    </Card>
                </div>
            </main>
        </div>
    );
}

