'use client';

import {Card} from "@/components/card";

export default function Page() {
    return (
        <div>
            <main className={'grid grid-cols-1 gap-3'}>
                <div className="grid grid-cols-1 gap-3 container max-w-[700px] pt-3">
                    <Card>
                        <h1 className={'text-5xl text-black font-bold mb-12'}>Politika zasebnosti</h1>

                        <div className={'prose'}>
                            <p>Vaša zasebnost nam je pomembna. Zbiramo le nujne podatke za delovanje platforme, vključno z morebitnim uporabniškim imenom, in tvojim email naslovom.</p><p>Tvojih podatkov ne prodajamo tretjim osebam, prav tako piškotke uporabljamo le za izboljšanje uporabniške izkušnje.</p>

                            <p>Za izbris ali popravek podatkov v skladu z GDPR nas kontaktiraj na miha@klele.si.</p>

                            <p>Za vprašanja smo na voljo na miha@klele.si</p>
                        </div>
                    </Card>
                </div>
            </main>
        </div>
    );
}

