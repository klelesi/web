import type {Metadata} from "next";
import "./globals.css";
import Navbar from "@/components/navbar";

export const metadata: Metadata = {
    title: "Klele.si",
    description: "Kjer so dobre debate doma.",
};

export default function RootLayout({
                                       children,
                                   }: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <html lang="sl_SI">
        <head>
            <link rel="shortcut icon" type="image/jpg" href="/images/favicon.png"/>
            <link rel="preconnect" href="https://fonts.googleapis.com"/>
            <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous"/>
            <link
                href="https://fonts.googleapis.com/css2?family=Kulim+Park:wght@400;600;700&display=swap"
                rel="stylesheet"/>
        </head>
        <body className={'sans flex flex-col bg-beige'}>
        <Navbar/>
        {children}
        </body>
        </html>
    );
}
