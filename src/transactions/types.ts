import {RecordType} from "../app/types";

export interface Transaction {
    id: number
    account: string

    value_date: string
    booking_date: string
    creditor: string
    purpose: string
    transaction_type: string
    amount: number
    currency: 'EUR'

    is_counter_to: null
    is_highlighted: boolean

    // State flags
    is_ignored: boolean

    records: number[]
}

export enum TransactionState {
    NEW,
    STAGING,
    IMPORTED,
    IGNORED,
}

// FIXME: Update data model
export const getTransactionState = (
    transaction: Transaction,
    recordById: Record<number, RecordType>
) => {
    if (transaction.is_ignored) {
        return TransactionState.IGNORED
    }

    if (transaction.records.length === 0) {
        return TransactionState.NEW
    }

    if (transaction.records.some((id) => recordById[id]?.id === null)) {
        return TransactionState.STAGING
    }

    return TransactionState.IMPORTED
}
