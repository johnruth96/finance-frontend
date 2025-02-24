import {GridRowParams} from '@mui/x-data-grid'
import {Box} from '@mui/material'
import {Transaction} from './types'
import React from 'react'


// TODO: Implement
const TransactionGridDetailPanel = ({row}: GridRowParams<Transaction>) => {
    return (
        <Box sx={{p: 1}}>
            {/*<RecordGrid
                recordIds={row.records}
                density={'compact'}
                hideFooter
            />*/}
        </Box>
    )
}

export const getDetailPanelContent = (props: GridRowParams<Transaction>) => {
    if (props.row.records.length === 0) {
        return null
    }

    return <TransactionGridDetailPanel {...props} />
}
