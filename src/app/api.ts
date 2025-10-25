import {createApi, fetchBaseQuery} from '@reduxjs/toolkit/query/react'
import {API_BASE} from "./config";
import {Account, Category, Contract, Pagination, RecordType} from "./types";
import {getAccessToken} from '../auth/token';
import {Transaction} from '../transactions/types';
import {DataGridFilter, prepareSearchParams} from "./url";

export interface RecordAggregationQueryArg {
    filter: Record<string, string | number | string[] | number[]>
    group: string
    aggregate: string
}

interface RecordAggregationResult {
    results: Array<{ value: number, label: string, color: string }>
}

export const baseApi = createApi({
        reducerPath: 'api',
        baseQuery: fetchBaseQuery({
            baseUrl: API_BASE,
            prepareHeaders: (headers, {}) => {
                const accessToken = getAccessToken()

                if (accessToken !== null) {
                    headers.set('Authorization', `Bearer ${accessToken}`)
                }

            },
        }),
        tagTypes: ["Record", "Transaction", "Account", "Contract", "Category"],
        endpoints: (builder) => ({
            /*
             Account
             */
            getAccounts: builder.query<Account[], void>({
                query: () => `accounts/`,
                providesTags: ['Account'],
            }),
            /*
             Category
             */
            getCategories: builder.query<Category[], void>({
                query: () => `categories/`,
                providesTags: ['Category'],
            }),
            /*
             * Contract
             */
            getContract: builder.query<Contract, number>({
                query: (id) => `contracts/${id}/`,
                providesTags: ['Contract'],
            }),
            getContracts: builder.query<Contract[], void>({
                query: () => `contracts/`,
                providesTags: ['Contract'],
            }),
            createContract: builder.mutation<Contract,
                Omit<Contract, 'id'> & Partial<Contract>>({
                query: (payload) => ({
                    url: "contracts/",
                    method: 'POST',
                    body: payload,
                }),
                invalidatesTags: ["Contract"],
            }),
            updateContract: builder.mutation<Contract, Pick<Contract, "id"> & Partial<Contract>>({
                query: ({id, ...payload}) => ({
                    url: `contracts/${id}/`,
                    method: 'PATCH',
                    body: payload,
                }),
                invalidatesTags: ["Contract"],
            }),
            /*deleteContract: builder.mutation<void, number>({
                query: (id) => ({
                    url: `contracts/${id}/`,
                    method: 'DELETE',
                }),
                invalidatesTags: ["Contract"],
            }),*/
            /*
             Record
             */
            getRecord: builder.query<RecordType, number>({
                query: (id) => `records/${id}/`,
                providesTags: (_, __, id) => [
                    {type: 'Record', id},
                ],
            }),
            getRecords: builder.query<Pagination<RecordType>, DataGridFilter>({
                query: (params) => {
                    const searchParams = prepareSearchParams(params)
                    return `records?${searchParams}`
                },
                providesTags: (result) => {
                    if (result) {
                        return [
                            {type: 'Record', id: "LIST"},
                            ...result.results.map(record => (
                                {type: "Record" as const, id: record.id}
                            )),
                        ]
                    } else {
                        return ["Record"]
                    }
                },
            }),
            createRecord: builder.mutation<RecordType,
                Omit<RecordType, 'id'> & Partial<RecordType>>({
                query: (payload) => ({
                    url: "records/",
                    method: 'POST',
                    body: payload,
                }),
                invalidatesTags: (result) => {
                    if (result) {
                        return [
                            {type: 'Record', id: "LIST"},
                            ...result.transactions.map(id => (
                                {type: "Transaction" as const, id: id}
                            ))
                        ]
                    } else {
                        return []
                    }
                },
            }),
            updateRecord: builder.mutation<RecordType, Pick<RecordType, "id"> & Partial<RecordType>>({
                query: ({id, ...payload}) => ({
                    url: `records/${id}/`,
                    method: 'PATCH',
                    body: payload,
                }),
                invalidatesTags: (result, _, arg) => {
                    if (result) {
                        const transactions = [
                            ...(arg.transactions ?? []), // include deleted transactions
                            ...result.transactions,
                        ]

                        return [
                            {type: 'Record', id: arg.id},
                            ...transactions.map(t => (
                                {type: "Transaction" as const, id: t}
                            )),
                        ]
                    } else {
                        return []
                    }
                },
            }),
            deleteRecord: builder.mutation<void, number>({
                query: (id) => ({
                    url: `records/${id}/`,
                    method: 'DELETE',
                }),
                invalidatesTags: (_, __, id, ___) => [
                    {type: 'Record', id: id},
                    {type: 'Transaction'}, // affected Transactions unknown, invalidate all
                ],
            }),
            getSubjectCategoryPairs: builder.query<Array<[string, number, number | null]>,
                void>({
                query: () => '/records/subjects/',
                providesTags: [
                    {type: 'Record', id: 'LIST'},
                ],
            }),
            getRecordTransactions: builder.query<Transaction[], number>({
                query: (recordId) => `/records/${recordId}/transactions/`,
                providesTags: (result, _, recordId) => {
                    if (result) {
                        return [
                            {type: 'Record', id: recordId},
                            ...result.map(transaction => (
                                {type: 'Transaction' as const, id: transaction.id}
                            )),
                        ]
                    } else {
                        return []
                    }
                }
            }),
            linkTransactionToRecord: builder.mutation<void, { record: number, transaction: number }>({
                query: ({record, transaction}) => ({
                    url: `records/${record}/transactions/${transaction}/`,
                    method: 'POST',
                }),
                invalidatesTags: (_, __, {record, transaction}) => [
                    {type: 'Record', id: record},
                    {type: 'Transaction', id: transaction},
                ],
            }),
            unlinkRecordFromTransaction: builder.mutation<void, { record: number, transaction: number }>({
                query: ({record, transaction}) => ({
                    url: `records/${record}/transactions/${transaction}/`,
                    method: 'DELETE',
                }),
                invalidatesTags: (_, __, {record, transaction}) => [
                    {type: 'Record', id: record},
                    {type: 'Transaction', id: transaction},
                ],
            }),
            getRecordAggregation: builder.query<RecordAggregationResult, RecordAggregationQueryArg>({
                query: (args) => {
                    const params = new URLSearchParams()
                    params.set("group", args.group)
                    params.set("aggregate", args.aggregate)

                    for (const [key, value] of Object.entries(args.filter)) {
                        const values = Array.isArray(value) ? value : [value]

                        values.forEach(value => {
                            params.append(key, value.toString())
                        })
                    }

                    return `/records/aggregate/?${params}`
                },
                providesTags: ["Record"], // Invalidate as soon as one Record changes
            }),
            /*
             Transaction
             */
            getTransactions: builder.query<Pagination<Transaction>, DataGridFilter>({
                query: (params) => {
                    const searchParams = prepareSearchParams(params)
                    return `transactions/transactions/?${searchParams}`
                },
                providesTags: (result) => {
                    if (result) {
                        return [
                            {type: 'Transaction', id: "LIST"},
                            ...result.results.map(t => (
                                {type: "Transaction" as const, id: t.id}
                            )),
                        ]
                    } else {
                        return ["Transaction"]
                    }
                },
            }),
            importTransaction: builder.mutation<Transaction, number>({
                query: (id) => ({
                    url: `transactions/transactions/${id}/import/`,
                    method: 'POST',
                }),
                invalidatesTags: (result) => {
                    if (result) {
                        return [
                            {type: "Transaction", id: result.id},
                            {type: "Record", id: "LIST"},
                        ]
                    } else {
                        return []
                    }
                }
            }),
            hideTransaction: builder.mutation<Transaction, number>({
                query: (id) => ({
                    url: `transactions/transactions/${id}/hide/`,
                    method: 'POST',
                }),
                invalidatesTags: (_, __, arg) => [
                    {type: "Transaction", id: arg}
                ],
            }),
            showTransaction: builder.mutation<Transaction, number>({
                query: (id) => ({
                    url: `transactions/transactions/${id}/show/`,
                    method: 'POST',
                }),
                invalidatesTags: (_, __, arg) => [
                    {type: "Transaction", id: arg}
                ],
            }),
            bookmarkTransaction: builder.mutation<Transaction, number>({
                query: (id) => ({
                    url: `transactions/transactions/${id}/bookmark/`,
                    method: 'POST',
                }),
                invalidatesTags: (_, __, arg) => [
                    {type: "Transaction", id: arg}
                ],
            }),
            removeBookmarkTransaction: builder.mutation<Transaction, number>({
                query: (id) => ({
                    url: `transactions/transactions/${id}/unbookmark/`,
                    method: 'POST',
                }),
                invalidatesTags: (_, __, arg) => [
                    {type: "Transaction", id: arg}
                ],
            }),
            counterBookingTransaction: builder.mutation<void, number[]>({
                query: (payload) => ({
                    url: `transactions/transactions/counter_booking/`,
                    method: 'POST',
                    body: payload,
                }),
                invalidatesTags: (_, error, arg) => {
                    if (!error) {
                        return arg.map(id => (
                            {type: "Transaction" as const, id: id}
                        ))
                    } else {
                        return []
                    }
                }
            }),
            importCsv: builder.mutation<void, string[]>({
                query: (contents) => ({
                    url: `transactions/transactions/import/`,
                    method: 'POST',
                    body: contents,
                }),
                invalidatesTags: [
                    {type: 'Transaction', id: "LIST"},
                ],
            }),
        }),
    }
)

export const {
    /*
     * Account
     */
    useGetAccountsQuery,
    /*
     * Category
     */
    useGetCategoriesQuery,
    /*
     * Contract
     */
    useGetContractsQuery,
    useGetContractQuery,
    useCreateContractMutation,
    useUpdateContractMutation,
    /*
     * Record
     */
    useGetRecordQuery,
    useGetRecordsQuery,
    useCreateRecordMutation,
    useUpdateRecordMutation,
    useDeleteRecordMutation,
    useGetSubjectCategoryPairsQuery,
    useGetRecordTransactionsQuery,
    useLinkTransactionToRecordMutation,
    useUnlinkRecordFromTransactionMutation,
    useGetRecordAggregationQuery,
    /*
     * Transaction
     */
    useGetTransactionsQuery,
    useImportTransactionMutation,
    useShowTransactionMutation,
    useHideTransactionMutation,
    useBookmarkTransactionMutation,
    useRemoveBookmarkTransactionMutation,
    useCounterBookingTransactionMutation,
    useImportCsvMutation,
} = baseApi
