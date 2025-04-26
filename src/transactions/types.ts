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
    is_ignored: boolean

    records: RecordType[]
}