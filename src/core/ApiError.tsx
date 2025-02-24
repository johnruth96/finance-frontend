import React from 'react'
import { APIError, DjangoRestFrameworkError } from '../app/types'
import { Alert, AlertProps } from '@mui/material'

export const formatError = (error: APIError | string[]): string => {
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
                    if (
                        typeof error.data === 'object' &&
                        'detail' in error.data
                    ) {
                        errorMsg = (error.data as DjangoRestFrameworkError)
                            .detail
                    } else if (
                        typeof error.data === 'object' &&
                        '__all__' in error.data
                    ) {
                        errorMsg = (error.data as DjangoRestFrameworkError)
                            .__all__
                    } else errorMsg = JSON.stringify(error.data)
                    errorMsg += ` (Code ${error.status})`
            }
        } else {
            errorMsg = error.message as string
        }
    }

    return errorMsg
}

interface ApiErrorProps extends AlertProps {
    error: APIError
}

export const ApiError = ({ error, ...props }: ApiErrorProps) => {
    const errorMsg = formatError(error)

    return (
        <Alert severity={'error'} {...props}>
            {errorMsg}
        </Alert>
    )
}
