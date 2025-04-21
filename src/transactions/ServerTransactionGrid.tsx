import React, {useEffect, useMemo} from 'react'
import {GridFilterModel, GridPaginationModel, GridSortModel} from "@mui/x-data-grid-premium";
import {GridCallbackDetails} from "@mui/x-data-grid/models/api";
import {enqueueSnackbar} from "notistack";
import {useGetTransactionsQuery} from "../app/api";
import {formatError} from "../core/Error";
import {GenericError} from "../app/types";
import {TransactionGrid, TransactionGridProps} from "./TransactionGrid";


export type ServerTransactionGridProps = Omit<TransactionGridProps, "transactions" | 'rowCount' | 'paginationMode' | 'sortingMode' | 'filterMode' | 'slotProps'>

/**
 * ServerTransactionGrid enhances the TransactionGrid by binding the API to the DataGrid.
 * The component is **controlled**.
 *
 * The transactions are retrieved from the API.
 */
export const ServerTransactionGrid = (props: ServerTransactionGridProps) => {
    /*
     * Filter
     */
    const [filterModelInternal, setFilterModelInternal] = React.useState<GridFilterModel>({
        items: [],
    })

    const onFilterModelChange = (model: GridFilterModel, details: GridCallbackDetails<'filter'>) => {
        if ( props.onFilterModelChange)
             props.onFilterModelChange(model, details)
        else
            setFilterModelInternal(model)
    }

    const filterModel = useMemo(() =>  props.filterModel ?? filterModelInternal, [ props.filterModel, filterModelInternal])

    /*
     * Pagination
     */
    const [paginationModelInternal, setPaginationModelInternal] = React.useState<GridPaginationModel>({
        page: 0,
        pageSize: 50,
    })

    const onPaginationModelChange = (model: GridPaginationModel, details: GridCallbackDetails) => {
        if ( props.onPaginationModelChange)
             props.onPaginationModelChange(model, details)
        else
            setPaginationModelInternal(model)
    }

    const paginationModel = useMemo(() => props.paginationModel ?? paginationModelInternal, [props.paginationModel, paginationModelInternal])

    /*
     * Sorting
     */
    const [sortModelInternal, setSortModelInternal] = React.useState<GridSortModel>([])

    const onSortModelChange = (model: GridSortModel, details: GridCallbackDetails) => {
        if (props.onSortModelChange)
            props.onSortModelChange(model, details)
        else
            setSortModelInternal(model)
    }

    const sortModel = useMemo(() => props.sortModel ?? sortModelInternal, [props.sortModel, sortModelInternal])

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

    const {data, isLoading, isError, error} = useGetTransactionsQuery(queryOptions)

    useEffect(() => {
        if (isError) {
            enqueueSnackbar(formatError(error as GenericError), {variant: "error"})
        }
    }, [error, isError])

    /*
     * Render
     */
    return (
        <TransactionGrid
            {...props}
            transactions={data?.results ?? []}
            loading={isLoading || props.loading}
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
        />
    )
}

