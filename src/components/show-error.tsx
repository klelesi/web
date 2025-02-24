import {AxiosError} from "axios";

export function ShowError({error}: { error: AxiosError }) {
    return <div className={'text-center'}>Napaka! {error.message}
    </div>
}