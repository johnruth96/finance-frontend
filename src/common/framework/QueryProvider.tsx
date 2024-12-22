import React, { PropsWithChildren } from 'react'
import { Spinner } from 'reactstrap'
import { ApiError } from '../ApiError'

interface QueryProviderProps extends PropsWithChildren {
    isLoading: boolean
    isSuccess: boolean
    error?: unknown
}

export const QueryProvider = ({
    isLoading,
    error,
    isSuccess,
    ...props
}: QueryProviderProps) => {
    if (isLoading) return <Spinner color={'warning'} size={'sm'} />
    else if (isSuccess) {
        return <>{props.children}</>
    } else {
        return <ApiError error={error} />
    }
}
