import React, { ReactNode } from 'react'
import { GenericDisplay } from './framework/GenericDisplay'

export const PropRow = ({
    name,
    children,
    value,
}: {
    name: string
    children?: ReactNode
    value?: any
}) => {
    let valueElement = null
    if (typeof value !== 'undefined') {
        valueElement = <GenericDisplay value={value} />
    }

    return (
        <tr>
            <td>{name}</td>
            <td>
                {valueElement}
                {children}
            </td>
        </tr>
    )
}
