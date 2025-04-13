import {DataGridPremium, DataGridPremiumProps, GridColDef, GridRowClassNameParams,} from '@mui/x-data-grid-premium'
import React from 'react'
import dayjs from 'dayjs'
import {getTransactionState, Transaction, TransactionState} from "./types";
import {HighlightAction} from './TransactionGridAction/HighlightAction';
import {IgnoreAction} from './TransactionGridAction/IgnoreAction';
import {CreateRecordAction} from "./TransactionGridAction/CreateRecordAction";
import {AmountDisplay} from "../core/AmountDisplay";
import {UnlinkAction} from "./TransactionGridAction/UnlinkAction";


const baseColumns: GridColDef<Transaction>[] = [
    {
        field: 'id',
        headerName: 'ID',
        type: 'number',
        aggregable: false,
    },
    {
        field: 'account',
        headerName: 'Konto',
        type: 'string',
        valueFormatter: (value: string | undefined) => value?.substring(2, 4),
        aggregable: false,
    },
    {
        field: 'booking_date',
        headerName: 'Datum',
        type: 'date',
        valueGetter: (value: string) => value && dayjs(value).toDate(),
        aggregable: false,
    },
    {
        field: 'creditor',
        headerName: 'Auftraggeber/Empfänger',
        flex: 1,
        aggregable: false,
    },
    {
        field: 'transaction_type',
        headerName: 'Buchungstext',
        aggregable: false,
    },
    {
        field: 'purpose',
        headerName: 'Verwendungszweck',
        flex: 1,
        aggregable: false,
    },
    {
        field: 'amount',
        headerName: 'Betrag',
        type: 'number',
        renderCell: ({id, value}) => <AmountDisplay value={value}/>,
        aggregable: true,
    },
    {
        field: 'is_highlighted',
        headerName: 'Markiert',
        type: 'boolean',
        aggregable: false,
    },
    {
        field: 'is_duplicate',
        headerName: 'Duplikat',
        type: 'boolean',
        valueGetter: (_, row) => row.is_counter_to !== null,
        aggregable: false,
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
        aggregable: false,
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
    record?: number
}

export const TransactionGrid = ({
                                    transactions,
                                    record,
                                    ...props
                                }: TransactionGridProps) => {
    const actionColumn: GridColDef<Transaction>[] = record ? [
        {
            field: 'actions',
            headerName: 'Aktionen',
            flex: 1,
            type: 'actions',
            getActions: ({row}) => [
                <UnlinkAction record={record} transaction={row.id}/>
            ],
            aggregable: false,
        },
    ] : [
        {
            field: 'actions',
            headerName: 'Aktionen',
            flex: 1,
            type: 'actions',
            getActions: ({row}) => [
                <IgnoreAction row={row}/>,
                <HighlightAction row={row}/>,
                <CreateRecordAction row={row}/>,
            ],
            aggregable: false,
        },
    ]

    const columns = [...baseColumns, ...actionColumn]

    return (
        <DataGridPremium
            columns={columns}
            rows={transactions}
            getRowClassName={getRowClassName}
            {...props}
        />
    )
}
