import React, {useEffect, useMemo} from 'react'
import {useGetRecordsQuery, useUpdateRecordMutation} from "../../app/api";
import {BaseRecordGrid, BaseRecordGridProps, RowModel} from "./BaseRecordGrid";
import {GridFilterModel, GridPaginationModel, GridSortModel} from "@mui/x-data-grid-premium";
import {GridCallbackDetails} from "@mui/x-data-grid/models/api";
import {enqueueSnackbar} from "notistack";
import {formatError} from "../../core/Error";
import dayjs from "dayjs";
import {GenericError} from "../../app/types";

export type ServerRecordGridProps = Omit<BaseRecordGridProps, "records" | 'rowCount' | 'paginationMode' | 'sortingMode' | 'filterMode' | 'slotProps'>

/**
 * ServerRecordGrid enhances the BaseRecordGrid by binding the API to the DataGrid.
 * The component is **controlled**.
 *
 * The records are retrieved from the API.
 * Records can be updated inline.
 */
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
    const [updateRecord, {isLoading: isUpdating}] = useUpdateRecordMutation()

    const handleRowUpdate = React.useCallback((updatedRow: RowModel, originalRow: RowModel) => {
        const payload = {
            ...updatedRow,
            date: dayjs(updatedRow.date).format("YYYY-MM-DD"),
        }

        return new Promise<RowModel>((resolve, reject) => {
            updateRecord(payload).unwrap().then(response => {
                resolve(updatedRow)
            }).catch(error => {
                reject(error)
            })
        })
    }, [])

    const handleProcessRowUpdateError = (error: GenericError) => {
        enqueueSnackbar(formatError(error), {variant: "error"})
    }

    useEffect(() => {
        if (isError) {
            enqueueSnackbar(formatError(error as GenericError), {variant: "error"})
        }
    }, [error, isError])

    /*
     * Render
     */
    return (
        <BaseRecordGrid
            records={data?.results ?? []}
            loading={isLoading || isUpdating || loading}
            // Pagination
            pagination={true}
            paginationMode="server"
            pageSizeOptions={[10, 25, 50, 100]}
            paginationModel={paginationModel}
            rowCount={data?.count ?? 0}
            // Sorting
            sortModel={sortModel}
            sortingMode="server"
            onSortModelChange={onSortModelChange}
            // Filtering
            filterModel={filterModel}
            filterMode="server"
            onPaginationModelChange={onPaginationModelChange}
            onFilterModelChange={onFilterModelChange}
            slotProps={{
                toolbar: {
                    showQuickFilter: true,
                    quickFilterProps: {
                        debounceMs: 500,
                    }
                }
            }}
            processRowUpdate={handleRowUpdate}
            onProcessRowUpdateError={handleProcessRowUpdateError}
            {...props}
        />
    )
}
