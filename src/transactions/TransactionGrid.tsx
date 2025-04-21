import {DataGridPremium, DataGridPremiumProps, GridColDef, GridRowClassNameParams,} from '@mui/x-data-grid-premium'
import React from 'react'
import dayjs from 'dayjs'
import {Transaction} from "./types";
import {HighlightAction} from './TransactionGridAction/HighlightAction';
import {IgnoreAction} from './TransactionGridAction/IgnoreAction';
import {CreateRecordAction} from "./TransactionGridAction/CreateRecordAction";
import {AmountDisplay} from "../core/AmountDisplay";
import {UnlinkAction} from "./TransactionGridAction/UnlinkAction";
import {
    getGridBooleanFilterOperators,
    getGridDateFilterOperators,
    getGridNumericFilterOperators,
    getGridStringFilterOperators
} from "../app/url";


const baseColumns: GridColDef<Transaction>[] = [
    {
        field: 'account',
        headerName: 'Konto',
        type: 'string',
        valueFormatter: (value: string | undefined) => value?.substring(0, 4),
        aggregable: false,
        filterOperators: getGridStringFilterOperators().filter(op => op.value === "startsWith"),
    },
    {
        field: 'booking_date',
        headerName: 'Datum',
        type: 'date',
        valueGetter: (value: string) => value && dayjs(value).toDate(),
        aggregable: false,
        filterOperators: getGridDateFilterOperators(),
    },
    {
        field: 'creditor',
        headerName: 'Auftraggeber/Empfänger',
        flex: 1,
        aggregable: false,
        filterOperators: getGridStringFilterOperators(),
    },
    {
        field: 'transaction_type',
        headerName: 'Buchungstext',
        aggregable: false,
        filterOperators: getGridStringFilterOperators(),
    },
    {
        field: 'purpose',
        headerName: 'Verwendungszweck',
        flex: 1,
        aggregable: false,
        filterOperators: getGridStringFilterOperators(),
    },
    {
        field: 'amount',
        headerName: 'Betrag',
        type: 'number',
        renderCell: ({id, value}) => <AmountDisplay value={value}/>,
        aggregable: true,
        filterOperators: getGridNumericFilterOperators(),
    },
    {
        field: 'is_highlighted',
        headerName: 'Markiert',
        type: 'boolean',
        aggregable: false,
        filterOperators: getGridBooleanFilterOperators(),
    },
    {
        field: 'is_duplicate',
        headerName: 'Duplikat',
        type: 'boolean',
        valueGetter: (_, row) => row.is_counter_to !== null,
        aggregable: false,
        filterOperators: getGridBooleanFilterOperators(),
    },
    {
        field: 'is_ignored',
        headerName: 'Ignoriert',
        type: 'boolean',
        aggregable: false,
        filterOperators: getGridBooleanFilterOperators(),
    },
    {
        field: 'record_count',
        headerName: 'Records',
        flex: 1,
        minWidth: 100,
        type: 'number',
        valueGetter: (_, row) => row.records?.length ?? 0,
        aggregable: true,
        filterOperators: getGridNumericFilterOperators(),
    },
]

const getRowClassName = ({row}: GridRowClassNameParams<Transaction>) => {
    let className = ''

    if (row.is_highlighted) {
        className = 'bg-primary-subtle'
    } else if (row.is_counter_to !== null) {
        className = 'bg-secondary-subtle'
    }

    return className
}

export interface TransactionGridProps
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
