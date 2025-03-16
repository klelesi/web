import {ChangeEvent} from "react";

export default function FormInput(props: {
    label: string,
    type: string,
    name: string,
    value: string,
    onChange: (prop: string, value: string | number) => void,
    error?: string,
    autocomplete?: string,
    disabled: boolean
}) {
    const onFormInputChange = (event: ChangeEvent) => {
        // @ts-expect-error: wrong type for target
        props.onChange(props.name, event.target.value);
        event.preventDefault();
    }

    return (
        <div>
            <label><span className="block text-sm leading-normal tracking-wide text-normal mb-1">{props.label}</span>
                <input autoComplete={props.autocomplete}
                       className={'w-full block border p-2 ' + (props.error ? ' text-error border-error bg-error-washed' : ' text-black border-black ')}
                       disabled={props.disabled}
                       value={props.value ?? ''}
                       type={props.type} onChange={onFormInputChange}/>

            </label>

            <p className="text-error mt-2">{props.error}</p>
        </div>
    )
}