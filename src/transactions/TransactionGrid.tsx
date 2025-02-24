import {DataGridPremium, DataGridPremiumProps, GridColDef, GridRowClassNameParams,} from '@mui/x-data-grid-premium'
import React, {useMemo} from 'react'
import dayjs from 'dayjs'
import {AmountCell} from './AmountCell'
import {getTransactionState, Transaction, TransactionState} from "./types";
import {RecordType} from "../app/types";


export interface RowModel extends Transaction {
    state: TransactionState
}

const columns: GridColDef<RowModel>[] = [
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
        valueOptions: [
            {
                value: TransactionState.NEW,
                label: 'neu',
            },
            {
                value: TransactionState.STAGING,
                label: 'in Bearbeitung',
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
            // TODO: Implement
            /*<IgnoreAction row={row}/>,
            <HighlightAction row={row}/>,
            <ConnectAction row={row}/>,
            <CreateRecordAction row={row}/>,*/
        ],
    },
]

const getRowClassName = ({row}: GridRowClassNameParams<RowModel>) => {
    let className = ''

    if (row.is_highlighted) {
        className = 'bg-primary-subtle'
    } else if (row.is_counter_to !== null) {
        className = 'bg-secondary-subtle'
    } else {
        if (row.state === TransactionState.NEW) {
            className = ''
        } else if (row.state === TransactionState.IGNORED) {
            className = 'bg-secondary-subtle'
        } else if (row.state === TransactionState.STAGING) {
            className = 'bg-warning-subtle'
        } else {
            className = 'bg-success-subtle'
        }
    }

    return className
}

interface TransactionGridProps
    extends Omit<DataGridPremiumProps, 'rows' | 'columns'> {
    transactionIds?: number[]
}

export const TransactionGrid = ({
                                    transactionIds,
                                    ...props
                                }: TransactionGridProps) => {
    // TODO: Implement
    // const transactions = useAppSelector(transactionSelectors.selectAll)
    // const transactionById = useAppSelector(transactionSelectors.selectEntities)
    // const recordById = useAppSelector(recordSelectors.selectEntities)
    const transactions: Transaction[] = []
    const transactionById: Record<number, Transaction> = {}
    const recordById: Record<number, RecordType> = {}

    const rows: RowModel[] = useMemo(() => {
        const transactionList = transactionIds
            ? transactionIds.map((id) => transactionById[id])
            : transactions

        return transactionList.map((t) => ({
            ...t,
            state: getTransactionState(t, recordById),
        }))
    }, [transactions, transactionById, transactionIds, recordById])

    return (
        <DataGridPremium
            columns={columns}
            rows={rows}
            getRowClassName={getRowClassName}
            {...props}
        />
    )
}
