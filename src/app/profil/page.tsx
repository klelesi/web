'use client';

import {Card} from "@/components/card";
import {useEffect, useState} from "react";
import useAxios from "@/hooks/useAxios";
import {AxiosError} from "axios";
import {Loader} from "@/components/loader";
import {ShowError} from "@/components/show-error";

enum State {
    LOADING,
    SHOWING,
    ERROR,
}

export default function Profile() {
    const client = useAxios();
    const [state, setState] = useState(State.LOADING);
    const [profile, setProfile] = useState<{id:string, name: string, email:string}|undefined>();
    const [error, setError] = useState<AxiosError|undefined>();

    useEffect(() => {
        client.get(`/api/user`).then((response) => response.data.data).then((profile) => {
                setProfile(profile as {id:string, name: string, email:string});
                setState(State.SHOWING);
            },
            (error: AxiosError) => {
                setError(error);
                setState(State.ERROR);
            }
        )
    }, []);

    return (
        <div>
            <main className={'grid grid-cols-1 gap-3'}>
                <div className="grid grid-cols-1 gap-3 container max-w-[700px] pt-3">
                    <Card>
                        <div className=" py-6">
                            <h1 className={'text-3xl font-bold mb-6 text-center'}>Profil</h1>

                            {state === State.LOADING && <Loader/>}

                            {state === State.ERROR && (<ShowError error={error as AxiosError}/>)}

                            {state === State.SHOWING && (<div className={'grid grid-cols-1 gap-3'}>
                                <label>
                                    Id
                                    <input type="text" disabled={true} value={profile?.id}/>
                                </label>

                                <label>
                                    Ime
                                    <input type="text" disabled={true} value={profile?.name}/>
                                </label>

                                <label>
                                    Email
                                    <input type="text" disabled={true} value={profile?.email}/>
                                </label>
                            </div>)}
                        </div>
                    </Card>
                </div>
            </main>
        </div>
    );
}

