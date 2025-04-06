import {FetchBaseQueryError} from "@reduxjs/toolkit/query";
import {SerializedError} from "@reduxjs/toolkit";

export interface Pagination<T> {
    count: number
    next: string | null
    previous: string | null
    results: T[]
}

export interface DjangoFormError {
    status: number
    data: Record<string, string[]>
}

export interface DjangoRestFrameworkError {
    detail?: string
    __all__?: string
}

export type GenericError = FetchBaseQueryError | (SerializedError & { data: DjangoRestFrameworkError }) | DjangoFormError

export interface Account {
    id: number
    name: string
    type: string
    image: string
}

export interface RecordType {
    id: number
    account: Account['id']
    counter_booking: RecordType['id'] | null

    subject: string
    category: Category['id']
    contract: Contract['id'] | null
    date: string
    amount: number

    transactions: number[]
}

export interface Contract {
    id: number
    name: string
    category: Category['id']
    is_active: boolean

    // Contract information
    date_start: string
    cancelation_period: number | null
    minimum_duration: number | null
    renewal_duration: number | null

    // Derived
    is_cancelation_shortly: false
    next_cancelation_date: string | null
    next_extension_date: string | null

    // Payment information
    account: Account['id']
    payment_cycle: string
    payment_date: string
    amount: number

    // Derived
    next_payment_date: string | null
    amount_per_year: number
}

export interface Category {
    id: number
    name: string
    color: string
    budget: number
    parent: Category['id'] | null
}