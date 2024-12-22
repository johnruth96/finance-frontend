import { Account, Category, Contract, RecordType } from './types'
import {
    createModelEndpoint,
    defaultActions,
    readOnlyActions,
} from '../../common/framework/api'
import { baseApi } from '../../app/api'

// TODO: Move to /src/app/api.ts
export interface PredictionResult extends Partial<RecordType> {
    query: string
}

createModelEndpoint<RecordType>('Record', 'records/', [
    ...defaultActions,
    'bulkCreate',
])
createModelEndpoint<Contract>('Contract', 'contracts/', defaultActions)
createModelEndpoint<Category>('Category', 'categories/', defaultActions)
createModelEndpoint<Account>('Account', 'accounts/', readOnlyActions)

baseApi.injectEndpoints({
    endpoints: (builder) => ({
        getSubjectCategoryPairs: builder.query<
            Array<[string, number, number | null]>,
            void
        >({
            query: () => '/records/subjects/',
            providesTags: [{ type: 'Record', id: 'LIST' }],
        }),
        predictCategories: builder.mutation<PredictionResult[], string[]>({
            query: (body) => ({
                method: 'POST',
                url: '/categories/predict/',
                body,
            }),
        }),
    }),
})

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
    useCreateRecordsMutation,
    // Other
    useGetSubjectCategoryPairsQuery,
    usePredictCategoriesMutation,
} = baseApi
