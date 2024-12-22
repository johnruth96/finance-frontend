import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faCheckCircle } from '@fortawesome/free-solid-svg-icons/faCheckCircle'
import { faTimesCircle } from '@fortawesome/free-solid-svg-icons/faTimesCircle'
import React from 'react'
import { formatDateTime, isDate } from '../datetime'

export interface GenericDisplayProps {
    value: any
    object?: any
}

function isValidHttpUrl(string) {
    let url
    try {
        url = new URL(string)
    } catch (_) {
        return false
    }
    return url.protocol === 'http:' || url.protocol === 'https:'
}

export const GenericDisplay = ({ value }: GenericDisplayProps) => {
    if (typeof value === 'string') {
        if (isValidHttpUrl(value)) {
            if (
                value.endsWith('.jpg') ||
                value.endsWith('.jpeg') ||
                value.endsWith('.png')
            ) {
                return <img src={value} className="img-fluid rounded" />
            } else {
                return (
                    <a href={value} target={'_blank'}>
                        {value}
                    </a>
                )
            }
        } else if (isDate(value)) {
            return <span>{formatDateTime(value)}</span>
        } else {
            return <span>{value}</span>
        }
    } else if (typeof value === 'boolean')
        if (value)
            return (
                <FontAwesomeIcon
                    icon={faCheckCircle}
                    className={'text-success'}
                />
            )
        else
            return (
                <FontAwesomeIcon
                    icon={faTimesCircle}
                    className={'text-danger'}
                />
            )
    else if (typeof value === 'object') {
        if (value === null) return null
        else if (Array.isArray(value)) {
            return (
                <ul>
                    {value.map((item) => (
                        <li key={item}>{item}</li>
                    ))}
                </ul>
            )
        }
    }

    return <span>{JSON.stringify(value)}</span>
}
