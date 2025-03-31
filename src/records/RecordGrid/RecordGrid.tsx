import React from 'react'
import {DataGridPremiumProps} from "@mui/x-data-grid-premium/models/dataGridPremiumProps";
import {MemoServerRecordGrid} from "./MemoServerRecordGrid";
import {RowModel} from "./BaseRecordGrid";


export const RecordGrid = ({
                               initialState = {},
                               ...props
                           }: Omit<DataGridPremiumProps<RowModel>, "rows" | "columns">) => {

    return (
        <MemoServerRecordGrid
            initialState={{
                sorting: {
                    sortModel: [
                        {
                            field: "date",
                            sort: "desc",
                        }
                    ]
                },
                columns: {
                    columnVisibilityModel: {
                        id: false,
                        account: false,
                        date_created: false,
                        transaction_count: false,
                    },
                },
                pagination: {
                    paginationModel: {
                        page: 0,
                        pageSize: 50,
                    }
                },
                density: "compact",
                ...initialState,
            }}
            {...props}
        />
    )
}
