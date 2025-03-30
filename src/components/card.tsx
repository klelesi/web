import {ReactNode} from "react";

export const Card = ({children, backgroundColor}: {
    children: ReactNode,
    backgroundColor?: string
}) => {


    return <div className={'card'} style={{backgroundColor: backgroundColor}}>
        {children}
    </div>
}