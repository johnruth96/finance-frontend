import React, {useMemo} from 'react'

import {useGetAccountsQuery, useGetCategorysQuery, useGetContractsQuery,} from '../../app/api'
import {Box} from '@mui/material'
import {DataGridPremium, GridToolbar,} from '@mui/x-data-grid-premium'
import dayjs from 'dayjs'
import {RecordType} from "../../app/types";
import {createGridColDef} from "./columns";
import {DataGridPremiumProps} from "@mui/x-data-grid-premium/models/dataGridPremiumProps";

export type RowModel = Omit<RecordType, 'date'> & { date: Date }

export interface RecordGridProps extends Omit<DataGridPremiumProps<RowModel>, "rows" | "columns"> {
    records?: RecordType[]
}

export const RecordGrid = ({records = [], loading, ...props}: RecordGridProps) => {
    const {data: contracts, ...contractQueryState} = useGetContractsQuery()
    const {data: categories, ...categoryQueryState} = useGetCategorysQuery()
    const {data: accounts, ...accountQueryState} = useGetAccountsQuery()

    const columns = createGridColDef(categories, contracts, accounts)

    const isLoading =
        accountQueryState.isLoading ||
        contractQueryState.isLoading ||
        categoryQueryState.isLoading || loading

    const rows = useMemo(() => {
        return records.map(({date, ...rest}: RecordType) => ({
            date: dayjs(date, 'YYYY-MM-DD').toDate(),
            ...rest,
        })) as RowModel[]
    }, [records])

    return (
        <Box sx={{width: '100%'}}>
            <DataGridPremium
                rows={rows}
                columns={columns}
                autoHeight={true}
                density={'compact'}
                loading={isLoading}
                pagination={true}
                slots={{
                    toolbar: GridToolbar
                }}
                initialState={{
                    columns: {
                        columnVisibilityModel: {
                            id: false,
                            contract: false,
                            account: false,
                            date_created: false,
                            transaction_count: false,
                        },
                    },
                    aggregation: {
                        model: {
                            amount: 'sum',
                        },
                    },
                    pagination: {
                        paginationModel: {
                            pageSize: 50,
                        }
                    }
                }}
                {...props}
            />
        </Box>
    )
}
