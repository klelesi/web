import {Card} from "@/components/card";
import {ReactNode} from "react";

export const NotificationCard = ({title, body}: { title: ReactNode, body: ReactNode }) => {
    return <Card>
        <div className="text-center py-6">
            <h3 className={'font-semibold text-xl mb-3'}>{title}</h3>
            <p>{body}</p>
        </div>
    </Card>
}