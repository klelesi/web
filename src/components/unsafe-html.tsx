export const UnsafeHTML = ({html}: { html?: string }) => {
    return (
        <>
            <div className="prose" dangerouslySetInnerHTML={{__html: html ?? ''}}/>
        </>
    );
}