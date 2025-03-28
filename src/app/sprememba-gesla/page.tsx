'use client';

import {Card} from "@/components/card";
import Shimmer from "@/components/shimmer";
import {useContext, useEffect, useState} from "react";
import useUserApi from "@/hooks/useUserApi";
import FormInput from "@/components/form-input";
import {AxiosError} from "axios";
import {z, ZodError} from "zod";
import {AuthContext} from "@/hooks/auth-provider";
import {useRouter} from "next/navigation";

const schema = z.object({
    email: z.string().email('Email mora imeti vsaj @ in zgledati kot email.'),
});

enum State {
    IDLE,
    SENDING,
    SUCCESS,
}

export default function Page() {
    const [state, setState] = useState(State.IDLE);
    const [form, setForm] = useState({email: ''})
    const [validation, setValidation] = useState<ZodError | null>(null);
    const [serverError, setServerError] = useState(null);
    const {passwordRequest} = useUserApi();


    const onSubmit = (event: SubmitEvent) => {
        event.preventDefault();
        if (validate(form)) {
            setState(State.SENDING);

            passwordRequest(form).then((response) => {
                setState(State.SUCCESS);
            }, (error: AxiosError) => {
                setServerError(error.response.data);
                setState(State.IDLE);
            });
        }
    }

    const validate = (data) => {
        try {
            schema.parse(data);
            setValidation(null);
        } catch (e) {
            setValidation(e);
            return false;
        }

        return true;
    }

    const onFormChange = (change: string, value: string | number | boolean) => {
        setForm((prev) => {
            // @ts-expect-error: setting a prop via string type
            prev[change] = value;
            validate(prev);
            return {...prev};
        })

        setServerError(null);
    }

    return (
        <div>
            <main className={'grid grid-cols-1 gap-3'}>
                <div className="grid grid-cols-1 gap-3 container max-w-[700px] pt-3">
                    <Card>
                        <div className="py-6">
                            {state === State.SUCCESS ? <>
                                <h1 className={'text-3xl font-bold mb-6 text-center'}>Prvi korak opravljen!</h1>

                                <div className="prose text-center">

                                    <p>Na <span className="font-bold">{form.email}</span> smo poslali ponastavitveni
                                        email.
                                    </p>

                                    <p>Naslednji korak je, da odpreš prejeti email, in tam klikneš na povezavo.</p>

                                    <p>Srečno!</p>

                                </div>

                            </> : null}

                            {[State.IDLE, State.SENDING].includes(state) ? <>
                                <h1 className={'text-3xl font-bold mb-6 text-center'}>Ponastavi geslo</h1>

                                <p className={'my-6 text-black text-center'}>Vnesi email in tja pridobi dodatna navodila
                                    kako si ponastaviš geslo.</p>

                                <form onSubmit={(event) => onSubmit(event)}>
                                    <FormInput label={"Email:"} type={'email'}
                                               error={validation?.format().email?._errors.join(". ") ?? serverError?.errors?.email?.join(". ")}
                                               name={'email'} value={form.email}
                                               onChange={(prop, value) => onFormChange(prop, value)}
                                               disabled={state === State.SENDING}/>


                                    <div className={'text-center mt-10'}>
                                        <button className="btn btn-primary"
                                                disabled={!!validation || serverError || state === State.SENDING}>Pošlji
                                            ponastavitev
                                        </button>
                                    </div>

                                </form>

                            </> : null}
                        </div>
                    </Card>
                </div>
            </main>
        </div>
    );
}

