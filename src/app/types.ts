import {FetchBaseQueryError} from "@reduxjs/toolkit/query";
import {SerializedError} from "@reduxjs/toolkit";

export interface ListResponse<T> {
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

export type APIError = FetchBaseQueryError | (SerializedError & { data: DjangoRestFrameworkError }) | DjangoFormError