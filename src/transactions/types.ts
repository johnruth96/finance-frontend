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

export const getTransactionState = (transaction: Transaction) => {
    if (transaction.is_ignored) {
        return TransactionState.IGNORED
    }

    if (transaction.records.length === 0) {
        return TransactionState.NEW
    }

    /*if (transaction.records.some((id) => recordById[id]?.remote_id === null)) {
        return TransactionState.STAGING
    }*/

    return TransactionState.IMPORTED
}
