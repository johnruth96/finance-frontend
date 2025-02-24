import {createApi, fetchBaseQuery} from '@reduxjs/toolkit/query/react'
import {API_BASE} from "./config";
import {createModelEndpoint, defaultActions, readOnlyActions} from "../core/framework/api";
import {Account, Category, Contract, RecordType} from "./types";
import {getAccessToken} from '../auth/token';
import {Transaction} from '../transactions/types';

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
    tagTypes: ["Record", "Transaction"],
    endpoints: (builder) => ({
        getSubjectCategoryPairs: builder.query<
            Array<[string, number, number | null]>,
            void
        >({
            query: () => '/records/subjects/',
            providesTags: [{type: 'Record', id: 'LIST'}],
        }),
        /*
         Transaction
         */
        getTransactions: builder.query<Transaction[], void>({
            query: () => `transactions/`,
            providesTags: ['Transaction'],
        }),
        hideTransaction: builder.mutation<Transaction, number>({
            query: (id) => ({
                url: `transactions/${id}/hide/`,
                method: 'POST',
            }),
            async onQueryStarted(_, {dispatch, queryFulfilled}) {
                await updateTransaction(dispatch, queryFulfilled)
            },
        }),
        showTransaction: builder.mutation<Transaction, number>({
            query: (id) => ({
                url: `transactions/${id}/show/`,
                method: 'POST',
            }),
            async onQueryStarted(_, {dispatch, queryFulfilled}) {
                await updateTransaction(dispatch, queryFulfilled)
            },
        }),
        bookmarkTransaction: builder.mutation<Transaction, number>({
            query: (id) => ({
                url: `transactions/${id}/bookmark/`,
                method: 'POST',
            }),
            async onQueryStarted(_, {dispatch, queryFulfilled}) {
                await updateTransaction(dispatch, queryFulfilled)
            },
        }),
        removeBookmarkTransaction: builder.mutation<Transaction, number>({
            query: (id) => ({
                url: `transactions/${id}/unbookmark/`,
                method: 'POST',
            }),
            async onQueryStarted(_, {dispatch, queryFulfilled}) {
                await updateTransaction(dispatch, queryFulfilled)
            },
        }),
        counterBookingTransaction: builder.mutation<void, number[]>({
            query: (payload) => ({
                url: `transactions/counter_booking/`,
                method: 'POST',
                body: payload,
            }),
            invalidatesTags: ['Transaction'],
        }),
        importCsv: builder.mutation<void, string[]>({
            query: (contents) => ({
                url: `transactions/import/`,
                method: 'POST',
                body: contents,
            }),
            invalidatesTags: ['Transaction'],
        }),
    }),
})

createModelEndpoint<RecordType>('Record', 'records/', defaultActions)
createModelEndpoint<Contract>('Contract', 'contracts/', defaultActions)
createModelEndpoint<Category>('Category', 'categories/', defaultActions)
createModelEndpoint<Account>('Account', 'accounts/', readOnlyActions)

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
