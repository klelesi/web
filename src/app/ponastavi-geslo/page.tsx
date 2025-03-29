'use client';

import {Card} from "@/components/card";
import {FormEvent, Suspense, useEffect, useState} from "react";
import useUserApi from "@/hooks/useUserApi";
import FormInput from "@/components/form-input";
import {AxiosError} from "axios";
import {z, ZodError} from "zod";
import {useSearchParams} from "next/navigation";
import {ValidationErrorResponse} from "@/interfaces";

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

interface Form {email: string, password: string, passwordConfirmation: string, token: string}

function Page() {
    const [state, setState] = useState(State.IDLE);
    const [form, setForm] = useState<Form>({email: '', password: '', passwordConfirmation: '', token: ''});
    const [validation, setValidation] = useState<ZodError<Form> | null>(null);
    const [serverError, setServerError] = useState<ValidationErrorResponse|null>(null);
    const {passwordReset} = useUserApi();
    const params = useSearchParams()
    const token: string | null = params.get('token');

    const onSubmit = (event: FormEvent) => {
        event.preventDefault();
        if (validate(form)) {
            setState(State.SAVING);

            passwordReset(form).then(() => {
                setState(State.SUCCESS);
            }, (error: AxiosError) => {
                if (error.response) {
                    setServerError(error.response.data as ValidationErrorResponse);
                }
                setState(State.IDLE);
            });
        }
    }

    useEffect(() => {
        setForm({...form, token: token ?? ''})
    }, [token]);

    const validate = (data: Form) => {
        try {
            schema.parse(data);
            setValidation(null);
        } catch (e) {
            setValidation(e as ZodError);
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

                                    <FormInput label={'Geslo:'} type={'password'} name={'password'}
                                               value={form.password}
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
                                        <p className="text-red mb-2">{serverError?.errors?.token?.join(". ")}</p>
                                        <button className="btn btn-primary"
                                                disabled={!!validation || serverError != null || state === State.SAVING}>Shrani
                                            geslo
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

export default function Wrapper() {

    return <Suspense>
        <Page/>
    </Suspense>
}