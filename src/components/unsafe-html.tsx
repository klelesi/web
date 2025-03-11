export const UnsafeHTML = ({ html }) => {
    return (
        <>
            <div className="prose" dangerouslySetInnerHTML={{__html: html}}/>
        </>
    );
}