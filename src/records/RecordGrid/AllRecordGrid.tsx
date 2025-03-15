import React, {useMemo} from 'react'
import {useGetRecordsQuery} from "../../app/api";
import {RecordGrid, RecordGridProps} from "./RecordGrid";
import {GridFilterModel, GridPaginationModel, GridSortModel} from "@mui/x-data-grid-premium";
import dayjs from "dayjs";
import {GridCallbackDetails} from "@mui/x-data-grid/models/api";

export const AllRecordGrid = ({
                                  loading,
                                  filterModel: filterModelProps,
                                  paginationModel: paginationModelProps,
                                  sortModel: sortModelProps,
                                  onFilterModelChange: onFilterModelChangeProps,
                                  onPaginationModelChange: onPaginationModelChangeProps,
                                  onSortModelChange: onSortModelChangeProps,
                                  ...props
                              }: RecordGridProps) => {
    const [filterModelInternal, setFilterModelInternal] = React.useState<GridFilterModel>({
        items: [],
    })
    const [paginationModelInternal, setPaginationModelInternal] = React.useState<GridPaginationModel>({
        page: 0,
        pageSize: 25,
    })
    const [sortModelInternal, setSortModelInternal] = React.useState<GridSortModel>([])

    // Use provided method, otherwise internal state handling
    const onFilterModelChange = (model: GridFilterModel, details: GridCallbackDetails<'filter'>) => {
        if (onFilterModelChangeProps)
            onFilterModelChangeProps(model, details)
        else
            setFilterModelInternal(model)
    }

    const onPaginationModelChange = (model: GridPaginationModel, details: GridCallbackDetails) => {
        if (onPaginationModelChangeProps)
            onPaginationModelChangeProps(model, details)
        else
            setPaginationModelInternal(model)
    }

    const onSortModelChange = (model: GridSortModel, details: GridCallbackDetails) => {
        if (onSortModelChangeProps)
            onSortModelChangeProps(model, details)
        else
            setSortModelInternal(model)
    }

    const filterModel = useMemo(() => filterModelProps ?? filterModelInternal, [filterModelProps, filterModelInternal])
    const paginationModel = useMemo(() => paginationModelProps ?? paginationModelInternal, [paginationModelProps, paginationModelInternal])
    const sortModel = useMemo(() => sortModelProps ?? sortModelInternal, [sortModelProps, sortModelInternal])

    const queryOptions = React.useMemo(
        () => {
            return {
                sortModel: sortModel,
                filterModel: {
                    ...filterModel,
                    items: filterModel.items.map(item => ({
                        ...item,
                        value: item.value instanceof Date ? dayjs(item.value).format("YYYY-MM-DD") : item.value,
                    })),
                },
                ...paginationModel,
            }
        },
        [paginationModel, sortModel, filterModel],
    )

    const {data, isLoading} = useGetRecordsQuery(queryOptions)

    return (
        <RecordGrid
            records={data?.results ?? []}
            loading={isLoading || loading}
            rowCount={data?.count ?? 0}
            pageSizeOptions={[10, 25, 50, 100]}
            paginationModel={paginationModelInternal}
            sortModel={sortModelInternal}
            filterModel={filterModel}
            paginationMode="server"
            sortingMode="server"
            filterMode="server"
            onPaginationModelChange={onPaginationModelChange}
            onSortModelChange={onSortModelChange}
            onFilterModelChange={onFilterModelChange}
            {...props}
        />
    )
}
