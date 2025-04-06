import React from 'react'
import {DjangoRestFrameworkError, GenericError} from '../app/types'
import {Alert, AlertProps} from '@mui/material'

export const formatError = (error: GenericError | string[]): string => {
    let errorMsg = JSON.stringify(error)

    if (Array.isArray(error)) {
        return error.join(', ')
    } else if (typeof error === 'object') {
        if ('status' in error) {
            switch (error.status) {
                case 'FETCH_ERROR':
                case 'PARSING_ERROR':
                case 'CUSTOM_ERROR':
                    errorMsg = error.error
                    break
                default:
                    if (typeof error.data === 'object' && error.data !== null && 'detail' in error.data) {
                        errorMsg = (error.data as DjangoRestFrameworkError).detail as string
                    } else if (typeof error.data === 'object' && error.data !== null && '__all__' in error.data) {
                        errorMsg = (error.data as DjangoRestFrameworkError).__all__ as string
                    } else {
                        errorMsg = JSON.stringify(error.data)
                    }

                    errorMsg += ` (Code ${error.status})`
            }
        } else {
            errorMsg = error.message as string
        }
    }

    return errorMsg
}

interface ErrorProps extends AlertProps {
    error: GenericError
}

export const Error = ({error, ...props}: ErrorProps) => {
    const errorMsg = formatError(error)

    return (
        <Alert severity={'error'} {...props}>
            {errorMsg}
        </Alert>
    )
}
