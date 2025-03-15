import {GridRowParams} from '@mui/x-data-grid'
import {Box} from '@mui/material'
import {Transaction} from './types'
import React from 'react'
import {RecordGrid} from "../records/RecordGrid/RecordGrid";


const TransactionGridDetailPanel = ({row}: GridRowParams<Transaction>) => {
    return (
        <Box sx={{p: 1}}>
            <RecordGrid
                records={row.records}
                density={'compact'}
                hideFooter
                slots={{
                    toolbar: null,
                }}
                disableAggregation
                disableColumnFilter
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
