import React from 'react'
import {useGetRecordsQuery} from "../../app/api";
import {RecordGrid, RecordGridProps} from "./RecordGrid";
import {GridFilterModel, GridPaginationModel, GridSortModel} from "@mui/x-data-grid-premium";
import dayjs from "dayjs";

export const AllRecordGrid = ({loading, ...props}: RecordGridProps) => {
    // TODO: Take props
    const [paginationModel, setPaginationModel] = React.useState<GridPaginationModel>(paginationModel ?? {
        page: 0,
        pageSize: 25,
    })

    const [sortModel, setSortModel] = React.useState<GridSortModel>([])
    const [filterModel, setFilterModel] = React.useState<GridFilterModel>({
        items: [],
    })
    const queryOptions = React.useMemo(
        () => {
            return {
                sortModel,
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
            paginationModel={paginationModel}
            sortModel={sortModel}
            filterModel={filterModel}
            paginationMode="server"
            sortingMode="server"
            filterMode="server"
            onPaginationModelChange={setPaginationModel}
            onSortModelChange={setSortModel}
            onFilterModelChange={setFilterModel}
            {...props}
        />
    )
}
