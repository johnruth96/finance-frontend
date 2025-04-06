import React, {PropsWithChildren} from 'react'
import {Spinner} from 'reactstrap'
import {Error} from './Error'
import {GenericError} from "../app/types";

interface QueryProviderProps extends PropsWithChildren {
    isLoading: boolean
    isSuccess: boolean
    error?: unknown
}

export const QueryProvider = ({isLoading, error, isSuccess, ...props}: QueryProviderProps) => {
    if (isLoading) {
        return <Spinner size={'sm'}/>
    } else if (isSuccess) {
        return <>{props.children}</>
    } else {
        return <Error error={error as GenericError}/>
    }
}
