import {createApi, fetchBaseQuery} from '@reduxjs/toolkit/query/react'
import {API_BASE} from "./config";
import {createModelEndpoint, defaultActions} from "../core/framework/api";
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
    tagTypes: ["Record", "Transaction", "Account"],
    endpoints: (builder) => ({
        /*
         Account
         */
        getAccounts: builder.query<Account[], void>({
            query: () => `accounts/`,
            providesTags: ['Account'],
        }),
        /*
         Record
         */
        getRecord: builder.query<RecordType, number>({
            query: (id) => `records/${id}/`,
            providesTags: ['Record'],
        }),
        getRecords: builder.query<Pagination<RecordType>, GridPaginationModel & {
            filterModel: GridFilterModel,
            sortModel: GridSortModel,
        }>({
            query: (params) => {
                const searchParams = new URLSearchParams()

                // Pagination
                searchParams.set("page", (params.page + 1).toString())
                searchParams.set("pageSize", params.pageSize.toString())

                // Sorting
                params.sortModel.forEach(item => {
                    const key = item.sort === "desc" ? "-" : ""
                    searchParams.append("sortBy", `${key}${item.field}`)
                })

                // Filtering
                params.filterModel.items.forEach(item => {
                    if (item.operator === "equals" || item.operator === "is" || item.operator === "=") {
                        searchParams.append(item.field, item.value)
                    }

                    if (item.operator === "after" || item.operator === ">") {
                        searchParams.append(`${item.field}__gt`, item.value)
                    }

                    if (item.operator === "before" || item.operator === "<") {
                        searchParams.append(`${item.field}__lt`, item.value)
                    }

                    if (item.operator === "onOrBefore" || item.operator === "<=") {
                        searchParams.append(`${item.field}__lte`, item.value)
                    }

                    if (item.operator === "onOrAfter" || item.operator === ">=") {
                        searchParams.append(`${item.field}__gte`, item.value)
                    }
                })

                return `records?${searchParams}`
            },
            providesTags: ['Record'],
        }),
        updateRecord: builder.mutation<RecordType, Pick<RecordType, "id"> & Partial<RecordType>>({
            query: ({id, ...payload}) => ({
                url: `records/${id}/`,
                method: 'PATCH',
                body: payload,
            }),
            invalidatesTags: ["Record"],
        }),
        createRecord: builder.mutation<RecordType,
            Omit<RecordType, 'id'> & Partial<RecordType>>({
            query: (payload) => ({
                url: "records/",
                method: 'POST',
                body: payload,
            }),
            invalidatesTags: ["Record", "Transaction"],
        }),
        getSubjectCategoryPairs: builder.query<Array<[string, number, number | null]>,
            void>({
            query: () => '/records/subjects/',
            providesTags: [{type: 'Record', id: 'LIST'}],
        }),
        /*
         Transaction
         */
        getTransactions: builder.query<Transaction[], void>({
            query: () => `transactions/transactions/`,
            providesTags: ['Transaction'],
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
            invalidatesTags: ['Transaction'],
        }),
    }),
})

// TODO: Remove factory and move them to the API object
createModelEndpoint<Contract>('Contract', 'contracts/', defaultActions)
createModelEndpoint<Category>('Category', 'categories/', defaultActions)

export const {
    // Account
    useGetAccountsQuery,
    // Category
    useGetCategorysQuery,
    // Contract
    useGetContractsQuery,
    useCreateContractMutation,
    useUpdateContractMutation,
    useDeleteContractMutation,
    // Record
    useGetRecordQuery,
    useGetRecordsQuery,
    useUpdateRecordMutation,
    useCreateRecordMutation,
    // Other
    useGetSubjectCategoryPairsQuery,
    // Transaction
    useGetTransactionsQuery,
    useShowTransactionMutation,
    useHideTransactionMutation,
    useBookmarkTransactionMutation,
    useRemoveBookmarkTransactionMutation,
    useCounterBookingTransactionMutation,
    useImportCsvMutation,
} = baseApi
