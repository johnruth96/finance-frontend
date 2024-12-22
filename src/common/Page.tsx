import React, {PropsWithChildren, useEffect} from "react";

export interface PageProps extends PropsWithChildren {
    title?: string
}

const Page = (props: PageProps) => {
    useEffect(() => {
        document.title = props.title || '';
    }, [props.title])
    return (
        <div className="container p-3" style={{marginBottom: '60px'}}>
            {props.children}
        </div>
    )
}

export default Page