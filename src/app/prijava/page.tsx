'use client';

import {Card} from "@/components/card";
import Shimmer from "@/components/shimmer";
import {FormEvent, useContext, useEffect, useState} from "react";
import useUserApi from "@/hooks/useUserApi";
import FormInput from "@/components/form-input";
import {AxiosError} from "axios";
import {z, ZodError} from "zod";
import {AuthContext} from "@/hooks/auth-provider";
import {useRouter} from "next/navigation";
import {ValidationErrorResponse} from "@/interfaces";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faGithub } from "@fortawesome/free-brands-svg-icons/faGithub";


const schema = z.object({
    email: z.string().email('Email mora imeti vsaj @ in zgledati kot email.'),
    password: z.string().min(8, 'Geslo mora biti vsaj 8 znakov.'),
});

enum State {
    CHECKING,
    IDLE,
    LOGGING_IN,
}

interface Form {
    email: string,
    password: string
}

export default function Login() {
    const [state, setState] = useState(State.CHECKING);
    const {checkLogin, login} = useUserApi();
    const [form, setForm] = useState<Form>({email: '', password: ''})
    const [validation, setValidation] = useState<ZodError<Form> | null>(null);
    const [serverError, setServerError] = useState<ValidationErrorResponse | null>(null);
    const {loginUser} = useContext(AuthContext);
    const router = useRouter();

    useEffect(() => {
        checkLogin(() => setState(State.IDLE));
    }, []);

    const onSubmit = (event: FormEvent) => {
        event.preventDefault();
        if (validate(form)) {
            setState(State.LOGGING_IN);

            login(form).then((response) => {
                loginUser(response.data.data);
                router.push('/')
            }, (error: AxiosError) => {
                if (error.response) {
                    setServerError(error.response.data as ValidationErrorResponse);
                }
                setState(State.IDLE);
            });
        }
    }

    const validate = (data:Form) => {
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
                            {state === State.CHECKING ? <>
                                <div className="mb-2"><Shimmer height={'2rem'}/></div>
                                <div className="mb-2"><Shimmer height={'1rem'}/></div>
                                <div className="mb-2"><Shimmer height={'3rem'}/></div>
                            </> : null}

                            {[State.IDLE, State.LOGGING_IN].includes(state) ? <>
                                <h1 className={'text-3xl font-bold mb-6 text-center'}>Prijava</h1>

                                <form onSubmit={(event) => onSubmit(event)}>
                                    <FormInput label={"Email:"} type={'email'}
                                               error={validation?.format().email?._errors.join(". ") ?? serverError?.errors?.email?.join(". ")}
                                               name={'email'} value={form.email}
                                               onChange={(prop, value) => onFormChange(prop, value)}
                                               disabled={state === State.LOGGING_IN}/>
                                    <FormInput label={"Geslo:"} type={'password'} name={'password'}
                                               value={form.password}
                                               onChange={(prop, value) => onFormChange(prop, value)}
                                               error={validation?.format().password?._errors.join(". ") ?? serverError?.errors?.password?.join(". ")}
                                               disabled={state === State.LOGGING_IN}/>

                                    <div className={'text-center mt-10'}>
                                        <button className="btn btn-primary"
                                                disabled={!!validation || serverError != null || state === State.LOGGING_IN}>Prijavi
                                            se
                                        </button>

                                    </div>

                                    <div className="text-right mt-3">
                                        <a className={'text-sm hover:text-red hover:underline'} href="/sprememba-gesla">Pozabljeno
                                            geslo?</a>
                                    </div>
                                </form>

                              <hr className="mb-10 mt-6"/>

                              <div className="text-center">

                                <h2 className="text-xl font-bold mb-6">Dodatni načini prijave</h2>

                                <a href={`${process.env.NEXT_PUBLIC_API_URL}/auth/github/redirect?flow=login`}>
                                  <button disabled={state === State.LOGGING_IN}
                                          className="btn btn-sm btn-primary-outline">
                                      <FontAwesomeIcon icon={faGithub} className={'mr-2'}/>
                                    Github
                                  </button>
                                </a>
                              </div>

                                <hr className="mb-10 mt-6"/>

                                <div className="text-center">

                                    <h2 className="text-xl font-bold mb-6">Še nimaš računa?</h2>

                                    <a href="/registracija">
                                        <button disabled={state === State.LOGGING_IN}
                                                className="btn btn-sm btn-primary-outline">Registriraj se
                                        </button>
                                    </a>
                                </div>

                            </> : null}
                        </div>
                    </Card>
                </div>
            </main>
        </div>
    );
}

