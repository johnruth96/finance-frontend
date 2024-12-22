import {createApi, fetchBaseQuery} from '@reduxjs/toolkit/query/react'
import {API_BASE, OIDC_CONFIG} from "./config";

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
    endpoints: () => ({}),
})
