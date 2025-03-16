import React, {useEffect, useMemo} from 'react'
import {useGetRecordsQuery} from "../../app/api";
import {RecordGrid, RecordGridProps} from "./RecordGrid";
import {GridFilterModel, GridPaginationModel, GridSortModel} from "@mui/x-data-grid-premium";
import {GridCallbackDetails} from "@mui/x-data-grid/models/api";
import {enqueueSnackbar} from "notistack";
import {formatError} from "../../core/ApiError";

export type ServerRecordGridProps = Omit<RecordGridProps, "records" | 'rowCount' | 'paginationMode' | 'sortingMode' | 'filterMode' | 'slotProps'>

export const ServerRecordGrid = ({
                                     loading,
                                     filterModel: filterModelProps,
                                     paginationModel: paginationModelProps,
                                     sortModel: sortModelProps,
                                     onFilterModelChange: onFilterModelChangeProps,
                                     onPaginationModelChange: onPaginationModelChangeProps,
                                     onSortModelChange: onSortModelChangeProps,
                                     ...props
                                 }: ServerRecordGridProps) => {
    /*
     * Filter
     */
    const [filterModelInternal, setFilterModelInternal] = React.useState<GridFilterModel>({
        items: [],
    })

    const onFilterModelChange = (model: GridFilterModel, details: GridCallbackDetails<'filter'>) => {
        if (onFilterModelChangeProps)
            onFilterModelChangeProps(model, details)
        else
            setFilterModelInternal(model)
    }

    const filterModel = useMemo(() => filterModelProps ?? filterModelInternal, [filterModelProps, filterModelInternal])

    /*
     * Pagination
     */
    const [paginationModelInternal, setPaginationModelInternal] = React.useState<GridPaginationModel>({
        page: 0,
        pageSize: 25,
    })

    const onPaginationModelChange = (model: GridPaginationModel, details: GridCallbackDetails) => {
        if (onPaginationModelChangeProps)
            onPaginationModelChangeProps(model, details)
        else
            setPaginationModelInternal(model)
    }

    const paginationModel = useMemo(() => paginationModelProps ?? paginationModelInternal, [paginationModelProps, paginationModelInternal])

    /*
     * Sorting
     */
    const [sortModelInternal, setSortModelInternal] = React.useState<GridSortModel>([])

    const onSortModelChange = (model: GridSortModel, details: GridCallbackDetails) => {
        if (onSortModelChangeProps)
            onSortModelChangeProps(model, details)
        else
            setSortModelInternal(model)
    }

    const sortModel = useMemo(() => sortModelProps ?? sortModelInternal, [sortModelProps, sortModelInternal])

    /*
     * Query API
     */
    const queryOptions = React.useMemo(
        () => {
            return {
                filterModel: JSON.stringify(filterModel),
                sortModel,
                paginationModel,
            }
        },
        [paginationModel, sortModel, filterModel],
    )

    const {data, isLoading, isError, error} = useGetRecordsQuery(queryOptions)

    useEffect(() => {
        if (isError) {
            enqueueSnackbar(formatError(error), {
                variant: "error"
            })
        }
    }, [error, isError])

    /*
     * Render
     */
    return (
        <RecordGrid
            records={data?.results ?? []}
            loading={isLoading || loading}
            rowCount={data?.count ?? 0}
            pageSizeOptions={[10, 25, 50, 100]}
            paginationModel={paginationModel}
            sortModel={sortModel}
            filterModel={filterModel}
            paginationMode="server"
            sortingMode="server"
            filterMode="server"
            onPaginationModelChange={onPaginationModelChange}
            onSortModelChange={onSortModelChange}
            onFilterModelChange={onFilterModelChange}
            slotProps={{
                toolbar: {
                    showQuickFilter: true,
                    quickFilterProps: {
                        debounceMs: 500,
                    }
                }
            }}
            {...props}
        />
    )
}
