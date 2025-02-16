export default function Footer() {
    return (
        <>
            <footer className={'bg-white w-full border-t border-black'}>
                <div className={'py-1 text-center w-full container text-sm'}>
                    Klele.si | {new Date().getFullYear()}
                </div>
            </footer>
        </>
    )
}