import { EntityId } from '@reduxjs/toolkit'
import { baseApi } from '../../app/api'
import { ListResponse } from '../../app/types'

type Action =
    | 'retrieve'
    | 'list'
    | 'update'
    | 'create'
    | 'delete'
    | 'bulkCreate'

export const defaultActions: Action[] = [
    'retrieve',
    'list',
    'update',
    'create',
    'delete',
]
export const readOnlyActions: Action[] = ['retrieve', 'list']

export const createModelEndpoint = <T extends { id: EntityId }>(
    name,
    baseUrl,
    actions: Action[],
) => {
    const listQueryName = `get${name}s`
    const retrieveQueryName = `get${name}`
    const updateQueryName = `update${name}`
    const createQueryName = `create${name}`
    const bulkCreateQueryName = createQueryName + 's'
    const deleteQueryName = `delete${name}`

    baseApi.enhanceEndpoints({
        addTagTypes: [name],
    })

    if (actions.includes('list'))
        baseApi.injectEndpoints({
            endpoints: (builder) => ({
                [listQueryName]: builder.query<
                    T[] | ListResponse<T>,
                    | ({
                          page?: number
                      } & Record<string, string>)
                    | undefined
                >({
                    query: (props) => {
                        if (props) {
                            const params = new URLSearchParams(props)
                            return `${baseUrl}?${params}`
                        }
                        return baseUrl
                    },
                    providesTags: [{ type: name, id: 'LIST' }],
                }),
            }),
        })

    if (actions.includes('retrieve'))
        baseApi.injectEndpoints({
            endpoints: (builder) => ({
                [retrieveQueryName]: builder.query<T, T['id']>({
                    query: (id) => `${baseUrl}${id}/`,
                    providesTags: (result, error, arg) =>
                        result ? [{ type: name, id: arg }] : [name],
                }),
            }),
        })

    if (actions.includes('create'))
        baseApi.injectEndpoints({
            endpoints: (builder) => ({
                [createQueryName]: builder.mutation<
                    T,
                    Omit<T, 'id'> & Partial<T>
                >({
                    query: (payload) => ({
                        url: baseUrl,
                        method: 'POST',
                        body: payload,
                    }),
                    invalidatesTags: (result, error, arg) =>
                        result ? [{ type: name, id: 'LIST' }] : [],
                }),
            }),
        })

    if (actions.includes('bulkCreate'))
        baseApi.injectEndpoints({
            endpoints: (builder) => ({
                [bulkCreateQueryName]: builder.mutation<
                    T[],
                    Array<Omit<T, 'id'> & Partial<T>>
                >({
                    query: (payload) => ({
                        url: baseUrl,
                        method: 'POST',
                        body: payload,
                    }),
                    invalidatesTags: (result, error, arg) =>
                        result ? [{ type: name, id: 'LIST' }] : [],
                }),
            }),
        })

    if (actions.includes('update'))
        baseApi.injectEndpoints({
            endpoints: (builder) => ({
                [updateQueryName]: builder.mutation<
                    T,
                    Pick<T, 'id'> & Partial<T>
                >({
                    query: ({ id, ...payload }) => ({
                        url: `${baseUrl}${id}/`,
                        method: 'PATCH',
                        body: payload,
                    }),
                    invalidatesTags: (result, error, arg) => [
                        { type: name, id: arg.id },
                        { type: name, id: 'LIST' },
                    ],
                }),
            }),
        })

    if (actions.includes('delete'))
        baseApi.injectEndpoints({
            endpoints: (builder) => ({
                [deleteQueryName]: builder.mutation<void, T['id']>({
                    query: (id) => ({
                        url: `${baseUrl}${id}/`,
                        method: 'DELETE',
                    }),
                    invalidatesTags: (result, error, arg) => [
                        { type: name, id: arg },
                        { type: name, id: 'LIST' },
                    ],
                }),
            }),
        })
    return baseApi
}
