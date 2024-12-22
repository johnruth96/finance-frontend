import {createApi, fetchBaseQuery} from '@reduxjs/toolkit/query/react'
import {API_BASE, OIDC_CONFIG} from "./config";
import {createModelEndpoint, defaultActions, readOnlyActions} from "../common/framework/api";
import {Account, Category, Contract, RecordType} from "./types";

const getSessionKey = () => {
    return `oidc.user:${OIDC_CONFIG.authority}:${OIDC_CONFIG.client_id}`
}

export const baseApi = createApi({
    reducerPath: 'api',
    baseQuery: fetchBaseQuery({
        baseUrl: API_BASE,
        prepareHeaders: (headers, {}) => {
            const sessionKey = sessionStorage.getItem(getSessionKey())

            if (sessionKey !== null) {
                const data = JSON.parse(sessionKey)
                const accessToken = data.access_token
                if (accessToken) {
                    headers.set('Authorization', `Bearer ${accessToken}`)
                }
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
