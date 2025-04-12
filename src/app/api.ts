import {createApi, fetchBaseQuery} from '@reduxjs/toolkit/query/react'
import {API_BASE} from "./config";
import {Account, Category, Contract, Pagination, RecordType} from "./types";
import {getAccessToken} from '../auth/token';
import {Transaction} from '../transactions/types';
import {GridPaginationModel, GridSortModel} from "@mui/x-data-grid-premium";
import {GridFilterModel} from "@mui/x-data-grid";

// @ts-ignore
const updateTransaction = async (dispatch, queryFulfilled) => {
    try {
        const {data} = await queryFulfilled

        dispatch(
            baseApi.util.updateQueryData(
                'getTransactions',
                undefined,
                (draft) => {
                    const idx = draft.findIndex(t => t.id === data.id)
                    if (idx > -1) {
                        draft.splice(idx, 1, data)
                    }
                }
            )
        )
    } catch {
    }
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
                providesTags: (result, meta, id) => [
                    {type: 'Record', id},
                ],
            }),
            getRecords: builder.query<Pagination<RecordType>, {
                paginationModel: GridPaginationModel,
                filterModel?: string,
                sortModel?: GridSortModel,
            }>({
                query: (params) => {
                    const filterModel: GridFilterModel = params.filterModel ? JSON.parse(params.filterModel) : {
                        items: []
                    }
                    const sortModel: GridSortModel = params.sortModel ?? []
                    const searchParams = new URLSearchParams()

                    // Pagination
                    searchParams.set("page", (params.paginationModel.page + 1).toString())
                    searchParams.set("pageSize", params.paginationModel.pageSize.toString())

                    // Sorting
                    sortModel.forEach(item => {
                        const key = item.sort === "desc" ? "-" : ""
                        searchParams.append("sortBy", `${key}${item.field}`)
                    })

                    // Filtering
                    filterModel.items
                        .filter(item => item.value !== undefined)
                        .forEach(item => {
                            let value = item.value
                            const dateMatch = item.value.toString().match(/\d{4}-\d{2}-\d{2}/)
                            if (dateMatch !== null) {
                                value = dateMatch[0]
                            }

                            switch (item.operator) {
                                case "equals":
                                case "is":
                                case "=":
                                    searchParams.append(item.field, value)
                                    break
                                case "contains":
                                    searchParams.append(`${item.field}__icontains`, value)
                                    break
                                case "startsWith":
                                    searchParams.append(`${item.field}__istartswith`, value)
                                    break
                                case "endsWith":
                                    searchParams.append(`${item.field}__iendswith`, value)
                                    break
                                case "after":
                                case ">":
                                    searchParams.append(`${item.field}__gt`, value)
                                    break
                                case "before":
                                case "<":
                                    searchParams.append(`${item.field}__lt`, value)
                                    break
                                case "onOrAfter":
                                case ">=":
                                    searchParams.append(`${item.field}__gte`, value)
                                    break
                                case "onOrBefore":
                                case "<=":
                                    searchParams.append(`${item.field}__lte`, value)
                                    break
                            }
                        })

                    // Quick filter
                    if (Array.isArray(filterModel.quickFilterValues)) {
                        searchParams.append("q", filterModel.quickFilterValues.join(" "))
                    }

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
                invalidatesTags: (result, error, id, meta) => [
                    {type: 'Record', id: id},
                    {type: 'Transaction'}, // affected Transactions unknown, invalidate all
                ],
            }),
            getSubjectCategoryPairs: builder.query<Array<[string, number, number | null]>,
                void>({
                query: () => '/records/subjects/',
                providesTags: [
                    // TODO: Add Record instance tags
                    {type: 'Record', id: 'LIST'},
                ],
            }),
            getRecordTransactions: builder.query<Transaction[], number>({
                query: (recordId) => `/records/${recordId}/transactions/`,
                providesTags: (result, error, recordId) => {
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
                invalidatesTags: (result, error, {record, transaction}) => [
                    {type: 'Record', id: record},
                    {type: 'Transaction', id: transaction},
                ],
            }),
            unlinkRecordFromTransaction: builder.mutation<void, { record: number, transaction: number }>({
                query: ({record, transaction}) => ({
                    url: `records/${record}/transactions/${transaction}/`,
                    method: 'DELETE',
                }),
                invalidatesTags: (result, error, {record, transaction}) => [
                    {type: 'Record', id: record},
                    {type: 'Transaction', id: transaction},
                ],
            }),
            /*
             Transaction
             */
            getTransactions: builder.query<Transaction[], void>({
                query: () => `transactions/transactions/`,
                providesTags: (result) => {
                    if (result) {
                        return [
                            {type: 'Transaction', id: "LIST"},
                            ...result.map(t => (
                                {type: "Transaction" as const, id: t.id}
                            )),
                        ]
                    } else {
                        return ["Transaction"]
                    }
                },
            }),
            hideTransaction: builder.mutation<Transaction, number>({
                query: (id) => ({
                    url: `transactions/transactions/${id}/hide/`,
                    method: 'POST',
                }),
                async onQueryStarted(_, {dispatch, queryFulfilled}) {
                    await updateTransaction(dispatch, queryFulfilled)
                },
            }),
            showTransaction: builder.mutation<Transaction, number>({
                query: (id) => ({
                    url: `transactions/transactions/${id}/show/`,
                    method: 'POST',
                }),
                async onQueryStarted(_, {dispatch, queryFulfilled}) {
                    await updateTransaction(dispatch, queryFulfilled)
                },
            }),
            bookmarkTransaction: builder.mutation<Transaction, number>({
                query: (id) => ({
                    url: `transactions/transactions/${id}/bookmark/`,
                    method: 'POST',
                }),
                async onQueryStarted(_, {dispatch, queryFulfilled}) {
                    await updateTransaction(dispatch, queryFulfilled)
                },
            }),
            removeBookmarkTransaction: builder.mutation<Transaction, number>({
                query: (id) => ({
                    url: `transactions/transactions/${id}/unbookmark/`,
                    method: 'POST',
                }),
                async onQueryStarted(_, {dispatch, queryFulfilled}) {
                    await updateTransaction(dispatch, queryFulfilled)
                },
            }),
            counterBookingTransaction: builder.mutation<void, number[]>({
                query: (payload) => ({
                    url: `transactions/transactions/counter_booking/`,
                    method: 'POST',
                    body: payload,
                }),
                invalidatesTags: ['Transaction'],
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
    /*
     * Transaction
     */
    useGetTransactionsQuery,
    useShowTransactionMutation,
    useHideTransactionMutation,
    useBookmarkTransactionMutation,
    useRemoveBookmarkTransactionMutation,
    useCounterBookingTransactionMutation,
    useImportCsvMutation,
} = baseApi
