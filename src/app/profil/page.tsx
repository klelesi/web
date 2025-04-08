'use client';

import {Card} from "@/components/card";
import {useEffect, useState} from "react";
import {AxiosError} from "axios";
import {Loader} from "@/components/loader";
import {ShowError} from "@/components/show-error";
import useUserApi from "@/hooks/useUserApi";
import {Auth} from "@/interfaces";
import {z} from "zod";
import FormInput from "@/components/form-input";

enum State {
    LOADING,
    SAVING,
    IDLE,
    ERROR,
}

const schema = z.object({
    name: z.string().min(1, "Ime je obvezno!"),
});

export default function Profile() {
    const {getProfile, updateProfile} = useUserApi();
    const [state, setState] = useState(State.LOADING);
    const [profile, setProfile] = useState<Auth | null>(null);
    const [form, setForm] = useState<{ name: string }>({name: ''})
    const [error, setError] = useState<AxiosError | undefined>();
    const [validation, setValidation] = useState(schema.safeParse(form));

    function onFormChange(change: string, value: string | number) {
        setForm((prev) => {
            // @ts-expect-error: setting a prop via string type
            prev[change] = value;
            setValidation(schema.safeParse(prev));
            return {...prev};
        })
    }

    useEffect(() => {
        getProfile().then((response) => response.data.data).then((profile) => {
                setProfile(profile as { id: string, name: string, email: string, username: string });
                const newForm = {name: profile.name};
                setForm(() => newForm);
                setValidation(schema.safeParse(newForm));
                setState(State.IDLE);
            },
            (error: AxiosError) => {
                setError(error);
                setState(State.ERROR);
            }
        )
    }, []);

    function update() {
        setState(State.SAVING);
        updateProfile(form).then((response) => response.data.data).then((profile) => {
                setProfile(profile as { id: string, name: string, email: string, username: string });
                const newForm = {name: profile.name};
                setForm(() => newForm);
                setValidation(schema.safeParse(newForm));
                setState(State.IDLE);
            },
            (error: AxiosError) => {
                setError(error);
                setState(State.ERROR);
            }
        )
    }

    return (
        <div>
            <main className={'grid grid-cols-1 gap-3'}>
                <div className="grid grid-cols-1 gap-3 container max-w-[700px] pt-3">
                    <Card>
                        <div className=" py-6">
                            <h1 className={'text-3xl font-bold mb-6 text-center'}>Profil</h1>

                            {state === State.LOADING && <Loader/>}

                            {state === State.ERROR && (<ShowError error={error as AxiosError}/>)}

                            {(state === State.IDLE || state === State.SAVING) && (
                                <div className={'grid grid-cols-1 gap-3'}>
                                    <label>
                                        Email
                                        <input type="text" disabled={true} value={profile?.email}/>
                                    </label>

                                    <label>
                                      Uporabniško ime
                                      <input type="text" disabled={true} value={profile?.username}/>
                                    </label>

                                    <FormInput label={'Ime'} type={'text'} name={'name'} value={form.name}
                                               error={validation.error?.flatten().fieldErrors.name?.join(' ')}
                                               onChange={(prop, value) => onFormChange(prop, value)}
                                               disabled={state === State.SAVING}/>

                                    <hr className="mt-10 mb-2"/>

                                    <div className="text-right">
                                        <button className="btn btn-primary" type="submit"
                                                onClick={() => update()}
                                                disabled={!validation.success || state === State.SAVING}>Posodobi
                                        </button>
                                    </div>

                                </div>)}
                        </div>
                    </Card>
                </div>
            </main>
        </div>
    );
}

