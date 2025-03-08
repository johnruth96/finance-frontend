import {GridRowId, GridToolbar} from '@mui/x-data-grid-premium'
import React, {useState} from 'react'
import {GridRowSelectionModel} from '@mui/x-data-grid/models/gridRowSelectionModel'
import {Alert, Button} from '@mui/material'
import {SyncAlt} from '@mui/icons-material'
import {TransactionGrid} from './TransactionGrid'
import {getDetailPanelContent} from './TransactionGridDetailPanel'
import {TransactionState} from './types'
import {Page} from "../core/Page";
import {useCounterBookingTransactionMutation, useGetTransactionsQuery} from "../app/api";
import {GridFilterModel} from "@mui/x-data-grid";
import dayjs from "dayjs";
import {RecordGridView} from "../records/views/RecordGrid";

export const LatestRecordListView = ({}) => {
    const initialFilterModel: GridFilterModel = {
        items: [
            {
                field: 'date_created',
                operator: 'onOrAfter',
                value: dayjs.utc().subtract(1, 'hour').toDate(),
            },
            {
                field: 'transaction_count',
                operator: '>',
                value: 0,
            },
        ],
    }

    return (
        <Page title={'Zuletzt Erstellt'}>
            <RecordGridView filterModel={initialFilterModel}/>
        </Page>
    )
}
