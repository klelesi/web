'use client';

import {Card} from "@/components/card";

export default function Page() {
    return (
        <div>
            <main className={'grid grid-cols-1 gap-3'}>
                <div className="grid grid-cols-1 gap-3 container max-w-[700px] pt-3">
                    <Card>
                        <h1 className={'text-5xl text-black font-bold mb-12'}>Pravila</h1>

                        <div className="mb-6">
                            <h2 className="text-2xl font-bold text-bold mb-1">#1 Primerna komunikacija</h2>
                            <p>Prepovedana je razžalitev, obrekovanje, žaljiva obdolžitev, opravljanje, in kakršnokoli
                                spodbujanje neenakopravnosti.</p>
                        </div>
                        <div className="mb-6">
                            <h2 className="text-2xl font-bold text-bold mb-1">#2 Primerna vsebina</h2>
                            <p>Prispevki se morajo vsebinsko povezovati s skupino v kateri so objavljeni. <br/> Komentarji se morajo
                                nanašati na temo objave.</p>
                        </div>

                        <div className="mb-6">
                            <h2 className="text-2xl font-bold text-bold mb-1">#3 Prepovedane vsebine</h2>
                            <ul>
                                <li>Prepovedano je širjenje nezakonitih in nezakonito pridobljenih vsebin.</li>
                                <li>Prepovedano je izvajanje prodajnih (oglaševalskih) aktivnosti brez dovoljenja.</li>
                                <li>Prepovedano je deljenje s paywall-om zaščitene vsebine.</li>
                                <li>Prepovedano je objavljati oglase za delo.</li>
                                <li>Prepovedano je objavljati male oglase.</li>
                            </ul>
                        </div>

                        <div className="mb-6">
                            <h2 className="text-2xl font-bold text-bold mb-1">#4 Sankcije</h2>
                            <p>Vsebina, ki ne bo v skladu s temi pravili bo ustrezno popravljena ali izbrisana. <br/>Vnovični kršitelji bodo odstranjeni in blokirani.</p>
                        </div>
                    </Card>
                </div>
            </main>
        </div>
    );
}

