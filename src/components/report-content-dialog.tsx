'use client';

import {useRef, useState} from "react";
import {Card} from "@/components/card";
import FormInput from "@/components/form-input";
import {Post, Comment} from "@/interfaces";
import useReportApi from "@/hooks/useReportApi";

enum State {
    IDLE,
    SAVING,
    SUCCESS,
}

export const ReportContentDialog = ({post, comment}: { post?: Post, comment?: Comment }) => {
    const ref = useRef<HTMLDialogElement | null>(null);
    const [form, setForm] = useState({comment: ''});
    const [currentState, setCurrentState] = useState(State.IDLE);
    const {storeReport} = useReportApi();

    const show = () => {
        if (ref) {
            ref.current?.showModal();
        }
    }

    const hide = () => {
        if (ref) {
            ref.current?.close();
        }
    }

    const onFormChange = (change: string, value: string | number | boolean) => {
        setForm((prev) => {
            // @ts-expect-error: setting a prop via string type
            prev[change] = value;
            return {...prev};
        })
    }

    const report = () => {
        setCurrentState(State.SAVING);

        storeReport({comment: form.comment, commentId: comment?.id, postId: post?.id}).then(() => {
            setCurrentState(State.SUCCESS);
            setForm({comment: ''});
            hide();
        }, () => {
            setCurrentState(State.SUCCESS);
            setForm({comment: ''});
            hide();
        });

        setTimeout(() => {
            setCurrentState(State.SUCCESS);
            setForm({comment: ''});
            hide();
        }, 1000)
    }

    return <>
        <button className="btn btn-sm btn-link" onClick={() => show()}
                disabled={currentState !== State.IDLE}>{currentState === State.IDLE ? 'Prijavi vsebino' : 'Prijava' +
            ' oddana'}</button>

        <dialog ref={ref}>
            <Card>
                <div className={'flex flex-col text-left'}>
                    <h2 className="text-2xl font-semibold">Prijavi vsebino</h2>

                    <p className="text-sm my-6">Prosim pomagaj nam in povej zakaj meniš, da ta vsebina ni primerna.</p>

                    <form>
                        <FormInput label={"Razlog:"} type={'text'} name={'comment'} value={form.comment}
                                   onChange={onFormChange}
                                   disabled={currentState !== State.IDLE}/>

                        <hr className={'my-6'}/>

                        <div className="text-right">
                            <button type={'button'} className="btn btn-primary-outline mr-3" onClick={() => hide()}
                                    disabled={currentState !== State.IDLE}>
                                Prekliči
                            </button>
                            <button type={'button'} className="btn btn-primary" disabled={currentState !== State.IDLE}
                                    onClick={() => report()}>
                                Prijavi
                            </button>
                        </div>
                    </form>
                </div>
            </Card>
        </dialog>
    </>
}