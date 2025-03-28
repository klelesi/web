'use client';

import {Card} from "@/components/card";
import Shimmer from "@/components/shimmer";
import {useContext, useEffect, useState} from "react";
import useUserApi from "@/hooks/useUserApi";
import FormInput from "@/components/form-input";
import {AxiosError} from "axios";
import {z, ZodError} from "zod";
import {AuthContext} from "@/hooks/auth-provider";
import {useRouter, useSearchParams} from "next/navigation";

const schema = z.object({
    email: z.string().email('Email mora imeti vsaj @ in zgledati kot email.'),
    password: z.string().min(8, 'Geslo mora biti vsaj 8 znakov.'),
    passwordConfirmation: z.string(),
}).refine((data) => data.password === data.passwordConfirmation, {
    message: 'Obe gesli se morata ujemati.',
    path: ['passwordConfirmation'],
});

enum State {
    IDLE,
    SAVING,
    SUCCESS,
}

function SuccessState() {
    return <div className={'py-6 text-center'}>
        <h2 className={'text-3xl font-bold mb-6'}>Geslo je nastavljeno!</h2>

        <p className={'mb-3'}>Sedaj se lahko prijaviš z novim geslom.</p>

        <a className={'mt-6 block'} href="/prijava">
            <button className="btn btn-sm btn-primary-outline"
                    >Prijavi se
            </button>
        </a>
    </div>
}

export default function Page() {
    const [state, setState] = useState(State.IDLE);
    const [form, setForm] = useState({email: '', password: '', passwordConfirmation: '', token: ''});
    const [validation, setValidation] = useState<ZodError | null>(null);
    const [serverError, setServerError] = useState(null);
    const {passwordReset} = useUserApi();
    const params = useSearchParams()
    const token: string | null = params.get('token');

    const onSubmit = (event: SubmitEvent) => {
        event.preventDefault();
        if (validate(form)) {
            setState(State.SAVING);

            passwordReset(form).then((response) => {
                setState(State.SUCCESS);
                console.log('SUCCESS');
            }, (error: AxiosError) => {
                setServerError(error.response.data);
                setState(State.IDLE);
            });
        }
    }

    useEffect(() => {
        setForm({...form, token: token ?? ''})
    }, [token]);

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
                            {state === State.SUCCESS && (<SuccessState/>)}

                            {state !== State.SUCCESS && (<>
                                <h1 className={'text-3xl font-bold mb-6 text-center'}>Ponastavi geslo</h1>

                                <form onSubmit={(event) => onSubmit(event)}>
                                    <FormInput label={"Email:"} type={'email'}
                                               error={validation?.format().email?._errors.join(". ") ?? serverError?.errors?.email?.join(". ")}
                                               name={'email'} value={form.email}
                                               onChange={(prop, value) => onFormChange(prop, value)}
                                               disabled={state === State.SAVING}/>

                                    <FormInput label={'Geslo:'} type={'password'} name={'password'} value={form.password}
                                               error={validation?.format().password?._errors.join(". ")}
                                               autocomplete={'new-password'}
                                               onChange={(prop, value) => onFormChange(prop, value)}
                                               disabled={state === State.SAVING}/>

                                    <FormInput label={'Ponovi geslo:'} type={'password'} name={'passwordConfirmation'}
                                               error={validation?.format().passwordConfirmation?._errors.join(". ")}
                                               value={form.passwordConfirmation}
                                               onChange={(prop, value) => onFormChange(prop, value)}
                                               disabled={state === State.SAVING}/>


                                    <div className={'text-center mt-10'}>
                                        <p className="text-red mb-2">{ serverError?.errors?.token?.join(". ")}</p>
                                        <button className="btn btn-primary"
                                                disabled={!!validation || serverError || state === State.SAVING}>Shrani geslo
                                        </button>
                                    </div>

                                </form>
                            </>)}
                        </div>
                    </Card>
                </div>
            </main>
        </div>
    );
}

