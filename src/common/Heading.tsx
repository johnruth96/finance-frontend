import React, {PropsWithChildren} from "react";
import {Link, LinkProps, useNavigate} from "react-router-dom";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faAngleLeft} from "@fortawesome/free-solid-svg-icons/faAngleLeft";
import {faCirclePlus} from "@fortawesome/free-solid-svg-icons/faCirclePlus";
import {IconDefinition} from "@fortawesome/fontawesome-common-types";
import {faPencil} from "@fortawesome/free-solid-svg-icons/faPencil";

type Props = { icon: IconDefinition } & LinkProps & React.RefAttributes<HTMLAnchorElement>

export const HeadingLink = ({icon, className, ...props}: Props) => {
    const classNameProp = "float-end text-muted " + (className ?? '')

    return (
        <Link className={classNameProp} {...props}>
            <FontAwesomeIcon icon={icon} className={"fs-5"}/>
        </Link>
    )
}

export const HeadingCreateLink = (props: Omit<Props, 'icon'>) => {
    return <HeadingLink {...props} icon={faCirclePlus}/>
}

export const HeadingUpdateLink = (props: Omit<Props, 'icon'>) => {
    return <HeadingLink {...props} icon={faPencil}/>
}

export interface HeadingProps extends PropsWithChildren {
    title: string
    back?: boolean
    updateUrl?: string
    addUrl?: string
}

export const Heading = ({title, back = false, updateUrl, addUrl, ...props}: HeadingProps) => {
    const navigate = useNavigate()
    const handleBack = () => navigate(-1)

    return (
        <div className="row">
            <div className="col">
                <h1 className={"text-center display-3 mb-4"}>
                    {back && <Link to={''} className={"float-start text-muted"} onClick={handleBack}>
                        <FontAwesomeIcon icon={faAngleLeft} className={"fs-5"}/>
                    </Link>}
                    {title}
                    {props.children}

                    {updateUrl && <HeadingUpdateLink to={updateUrl} className={"ms-1"}/>}
                    {addUrl && <HeadingCreateLink to={addUrl} className={"ms-1"}/>}
                </h1>
            </div>
        </div>
    )
}