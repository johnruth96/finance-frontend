import React, { useEffect, useState } from 'react'
import { baseApi } from '../../app/api'
import { ApiError } from '../ApiError'
import { map } from 'lodash'
import { Pagination } from '../../app/types'
import InfiniteScroll from 'react-infinite-scroll-component'
import { CircularProgress, Skeleton, Typography } from '@mui/material'

export interface ListViewComponent<T> {
    objects: T[]
}

interface ConnectOptions {
    model: string
    paginate?: boolean
}

export interface ListViewProps {
    searchParams?: Record<string, any>
}

const connectListViewNoPagination = <T extends { id: number }>(
    model: string,
    ListViewComponent: React.ComponentType<ListViewComponent<T>>,
): React.ComponentType<ListViewProps> => {
    const listHookName = `useGet${model}sQuery`

    return ({ searchParams, ...props }: ListViewProps) => {
        const listHook = baseApi[listHookName]
        const { data, ...result } = listHook(searchParams)

        // Render
        if (result.isLoading)
            return <Skeleton variant={'rectangular'} height={40} />
        else if (result.isSuccess) {
            return <ListViewComponent objects={data as T[]} {...props} />
        } else {
            return <ApiError error={result.error} />
        }
    }
}

const connectListViewPagination = <T extends { id: number }>(
    model: string,
    ListViewComponent: React.ComponentType<ListViewComponent<T>>,
): React.ComponentType<ListViewProps> => {
    const listHookName = `useLazyGet${model}sQuery`

    return ({ searchParams, ...props }: ListViewProps) => {
        const [page, setPage] = useState(1)
        const [objects, setObjects] = useState<T[]>([])
        const [hasMore, setHasMore] = useState(false)

        // Hook
        const listHook = baseApi[listHookName]
        const [trigger, result] = listHook()

        const constructQueryParams = (page: number) => {
            let params: Record<string, string | number> = {}
            params.page = page
            if (searchParams) params = { ...searchParams, ...params }
            return params
        }

        const fetchData = (page: number) => {
            const queryParams = constructQueryParams(page)
            //console.debug("fetchData()", {page, objects, hasMore, queryParams})

            trigger(queryParams)
                .unwrap()
                .then((response: Pagination<T>) => {
                    if (page === 1) {
                        setObjects(response.results)
                    } else {
                        const ids = map(objects, 'id')
                        const newObjects = response.results.filter(
                            (item) => !ids.includes(item.id),
                        )
                        setObjects([...objects, ...newObjects])
                    }

                    if (response.next !== null) {
                        setHasMore(true)
                    } else {
                        setHasMore(false)
                    }
                })

            setPage(page)
        }

        const fetchNext = () => {
            fetchData(page + 1)
        }

        useEffect(() => {
            setObjects([])
            fetchData(1)
        }, [searchParams])

        // Render
        if (result.isUninitialized) {
            return <CircularProgress />
        } else {
            return (
                <div>
                    <InfiniteScroll
                        dataLength={objects.length}
                        hasMore={hasMore}
                        next={fetchNext}
                        loader={
                            <Typography align={'center'}>Loading...</Typography>
                        }
                        endMessage={
                            <Typography align={'center'}>
                                Keine weiteren Daten.
                            </Typography>
                        }
                    >
                        <ListViewComponent objects={objects} {...props} />
                    </InfiniteScroll>

                    {result.isError && <ApiError error={result.error} />}
                </div>
            )
        }
    }
}

// TODO: Deprecate
/**
 * The connectListView method binds a View component (taking a list of objects) to the API.
 * The method requires a model name `model` and derives the API endpoint name from it.
 * The method supports pagination, with the parameter `paginate`.
 *
 * Behaviour:
 * The output component takes a Record `searchParams`, which represents the search parameters for the API request to
 * filter the object list.
 *
 * The output component has an internal state of the current page (if pagination) and a list of objects, which are
 * currently displayed.
 *
 * If the searchParams are updated, the page is set to 1 and the object list is cleared.
 *
 * If the page is changed, the query is executed again, the resulting objects should be added to the internal object
 * list if not already present.
 *
 * @param ListViewComponent
 * @param model
 * @param paginate
 */
export const connectListView = <T extends { id: number }>(
    ListViewComponent: React.ComponentType<ListViewComponent<T>>,
    { model, paginate }: ConnectOptions,
): React.ComponentType<ListViewProps> => {
    if (paginate) return connectListViewPagination<T>(model, ListViewComponent)
    else return connectListViewNoPagination<T>(model, ListViewComponent)
}
