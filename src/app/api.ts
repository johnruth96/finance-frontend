import {createApi, fetchBaseQuery} from '@reduxjs/toolkit/query/react'
import {API_BASE} from "./config";
import {createModelEndpoint, defaultActions, readOnlyActions} from "../common/framework/api";
import {Account, Category, Contract, RecordType} from "./types";
import {getAccessToken} from '../auth/token';


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
    tagTypes: ["Record"],
    endpoints: (builder) => ({
        getSubjectCategoryPairs: builder.query<
            Array<[string, number, number | null]>,
            void
        >({
            query: () => '/records/subjects/',
            providesTags: [{type: 'Record', id: 'LIST'}],
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
} = baseApi
