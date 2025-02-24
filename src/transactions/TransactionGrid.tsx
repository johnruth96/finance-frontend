import {DataGridPremium, DataGridPremiumProps, GridColDef, GridRowClassNameParams,} from '@mui/x-data-grid-premium'
import React from 'react'
import dayjs from 'dayjs'
import {AmountCell} from './AmountCell'
import {getTransactionState, Transaction, TransactionState} from "./types";
import {HighlightAction} from './TransactionGridAction/HighlightAction';
import {IgnoreAction} from './TransactionGridAction/IgnoreAction';


const columns: GridColDef<Transaction>[] = [
    {
        field: 'account',
        headerName: 'Konto',
        type: 'string',
        valueFormatter: (value: string) => value.substring(2, 4),
    },
    {
        field: 'booking_date',
        headerName: 'Datum',
        type: 'date',
        valueGetter: (value: string) => value && dayjs(value).toDate(),
    },
    {
        field: 'creditor',
        headerName: 'Auftraggeber/Empfänger',
        flex: 1,
    },
    {
        field: 'transaction_type',
        headerName: 'Buchungstext',
    },
    {
        field: 'purpose',
        headerName: 'Verwendungszweck',
        flex: 1,
    },
    {
        field: 'amount',
        headerName: 'Betrag',
        type: 'number',
        renderCell: AmountCell,
    },
    {
        field: 'is_highlighted',
        headerName: 'Markiert',
        type: 'boolean',
    },
    {
        field: 'is_duplicate',
        headerName: 'Duplikat',
        type: 'boolean',
        valueGetter: (_, row) => row.is_counter_to !== null,
    },
    {
        field: 'state',
        headerName: 'Zustand',
        type: 'singleSelect',
        valueGetter: (_, row) => getTransactionState(row),
        valueOptions: [
            {
                value: TransactionState.NEW,
                label: 'neu',
            },
            {
                value: TransactionState.IGNORED,
                label: 'ignoriert',
            },
            {
                value: TransactionState.IMPORTED,
                label: 'importiert',
            },
        ],
    },
    {
        field: 'actions',
        headerName: 'Aktionen',
        flex: 1,
        type: 'actions',
        getActions: ({row}) => [
            <IgnoreAction row={row}/>,
            <HighlightAction row={row}/>,
            // TODO: Implement
            /*<ConnectAction row={row}/>,
            <CreateRecordAction row={row}/>,*/
        ],
    },
]

const getRowClassName = ({row}: GridRowClassNameParams<Transaction>) => {
    let className = ''

    if (row.is_highlighted) {
        className = 'bg-primary-subtle'
    } else if (row.is_counter_to !== null) {
        className = 'bg-secondary-subtle'
    } else {
        const state = getTransactionState(row)

        if (state === TransactionState.NEW) {
            className = ''
        } else if (state === TransactionState.IGNORED) {
            className = 'bg-secondary-subtle'
        } else {
            className = 'bg-success-subtle'
        }
    }

    return className
}

interface TransactionGridProps
    extends Omit<DataGridPremiumProps, 'rows' | 'columns'> {
    transactions: Transaction[]
}

export const TransactionGrid = ({
                                    transactions,
                                    ...props
                                }: TransactionGridProps) => {
    return (
        <DataGridPremium
            columns={columns}
            rows={transactions}
            getRowClassName={getRowClassName}
            {...props}
        />
    )
}
