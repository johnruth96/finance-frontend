import {baseApi} from './api'
import {configureStore} from "@reduxjs/toolkit";

// import logger from 'redux-logger'
export const store = configureStore({
    reducer: {
        [baseApi.reducerPath]: baseApi.reducer,
    },
    middleware: (getDefaultMiddleware) =>
        getDefaultMiddleware().concat(baseApi.middleware),
})

export type RootState = ReturnType<typeof store.getState>

export default store