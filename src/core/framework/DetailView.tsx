import React from 'react'
import {baseApi} from '../../app/api'
import {Alert} from 'reactstrap'
import {useParams} from 'react-router-dom'
import {QueryProvider} from './QueryProvider'

export interface DetailViewComponent<T> {
    object: T
}

interface ConnectOptions {
    model: string
    pkUrlKwarg?: string
}

export const connectDetailView = <T extends { id: number }>(
    DetailViewComponent:
        | React.ComponentType<DetailViewComponent<T>>
        | undefined,
    {model}: ConnectOptions,
): React.ComponentType<{ id: number }> => {
    const retrieveHookName = `useGet${model}Query`

    return ({id, ...props}: { id: number }) => {
        const retrieveHook = baseApi[retrieveHookName]
        const {data, ...hookResult} = retrieveHook(id)

        return (
            <QueryProvider {...hookResult}>
                <DetailViewComponent object={data} {...props} />
            </QueryProvider>
        )
    }
}

export const connectDetailViewWithRouter = <T extends { id: number }>(
    DetailViewComponent:
        | React.ComponentType<DetailViewComponent<T>>
        | undefined,
    {pkUrlKwarg = 'id', ...options}: ConnectOptions,
): React.ComponentType => {
    const DetailView = connectDetailView<T>(DetailViewComponent, options)

    return ({}) => {
        const params = useParams()
        const id: string | undefined = params[pkUrlKwarg]
        if (!id)
            return (
                <Alert color={'danger'} fade={false}>
                    Route has no parameter '{pkUrlKwarg}'
                </Alert>
            )

        return <DetailView id={parseInt(id)}/>
    }
}
