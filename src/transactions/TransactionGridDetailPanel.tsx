import {GridRowParams} from '@mui/x-data-grid'
import {Box} from '@mui/material'
import {Transaction} from './types'
import React from 'react'
import {BaseRecordGrid} from "../records/RecordGrid/BaseRecordGrid";


const TransactionGridDetailPanel = ({row}: GridRowParams<Transaction>) => {
    return (
        <Box sx={{p: 1}}>
            <BaseRecordGrid
                records={row.records}
                density={'compact'}
                hideFooter
                slots={{
                    toolbar: null,
                }}
                disableAggregation
                disableColumnFilter
                initialState={{
                    columns: {
                        columnVisibilityModel: {
                            id: false,
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
                }}
            />
        </Box>
    )
}

export const getDetailPanelContent = (props: GridRowParams<Transaction>) => {
    if (props.row.records.length === 0) {
        return null
    }

    return <TransactionGridDetailPanel {...props} />
}
