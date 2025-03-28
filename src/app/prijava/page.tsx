'use client';

import {Card} from "@/components/card";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faGithub} from "@fortawesome/free-brands-svg-icons/faGithub";
import Shimmer from "@/components/shimmer";
import {useContext, useEffect, useState} from "react";
import useUserApi from "@/hooks/useUserApi";
import FormInput from "@/components/form-input";
import {AxiosError} from "axios";
import {z, ZodError} from "zod";
import {AuthContext} from "@/hooks/auth-provider";
import {router} from "next/client";
import {useRouter} from "next/navigation";


const schema = z.object({
    email: z.string().email('Email mora imeti vsaj @ in zgledati kot email.'),
    password: z.string().min(8, 'Geslo mora biti vsaj 8 znakov.'),
});

enum State {
    CHECKING,
    IDLE,
    LOGGING_IN,
}

export default function Login() {
    const [state, setState] = useState(State.CHECKING);
    const {checkLogin, login} = useUserApi();
    const [form, setForm] = useState({email: '', password: ''})
    const [validation, setValidation] = useState<ZodError | null>(null);
    const [serverError, setServerError] = useState(null);
    const {loginUser} = useContext(AuthContext);
    const router = useRouter();

    useEffect(() => {
        checkLogin(() => setState(State.IDLE));
    }, []);

    const onSubmit = (event: SubmitEvent) => {
        event.preventDefault();
        if (validate(form)) {
            setState(State.LOGGING_IN);

            login(form).then((response) => {
                loginUser(response.data);
                router.push('/')
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
                                               name={'email'} value={form.email} onChange={(prop, value) => onFormChange(prop, value)} disabled={state === State.LOGGING_IN}/>
                                    <FormInput label={"Geslo:"} type={'password'} name={'password'} value={form.password} onChange={(prop, value) => onFormChange(prop, value)} đ
                                               error={validation?.format().password?._errors.join(". ") ?? serverError?.errors?.password?.join(". ")}
                                               disabled={state === State.LOGGING_IN}/>

                                    <div className={'text-center mt-10'}>
                                        <button className="btn btn-primary"
                                                disabled={!!validation || serverError || state === State.LOGGING_IN}>Prijavi
                                            se
                                        </button>
                                    </div>

                                </form>

                                <hr className="my-10"/>

                                <div className="text-center">

                                <h2 className="text-xl font-bold mb-6">Še nimaš računa?</h2>

                                <a href="/registracija">
                                    <button disabled={state === State.LOGGING_IN} className="btn btn-sm btn-primary-outline">Registriraj se</button>
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

