import React from 'react'
import ReactDOM from 'react-dom/client'
import {RouterProvider} from 'react-router-dom'
import {createTheme} from '@mui/material'
import {LocalizationProvider} from '@mui/x-date-pickers'
import {AdapterDayjs} from '@mui/x-date-pickers/AdapterDayjs'
import {Provider} from 'react-redux'
import store from './app/store'
import router from './app/router'
import dayjs from 'dayjs'
import {SnackbarProvider} from 'notistack'

// Material UI Roboto Font
import '@fontsource/roboto/300.css'
import '@fontsource/roboto/400.css'
import '@fontsource/roboto/500.css'
import '@fontsource/roboto/700.css'

// Styles
import './assets/scss/styles.scss'

// dayjs
import 'dayjs/locale/de'
import arraySupport from 'dayjs/plugin/arraySupport'
import isoWeek from 'dayjs/plugin/isoWeek'
import advancedFormat from 'dayjs/plugin/advancedFormat'
import customParseFormat from 'dayjs/plugin/customParseFormat'
import utc from 'dayjs/plugin/utc'
import timezone from 'dayjs/plugin/timezone'
import {LicenseInfo} from "@mui/x-license";
import {DATA_GRID_LICENSE} from "./app/config";

dayjs.extend(customParseFormat)
dayjs.extend(arraySupport)
dayjs.extend(advancedFormat)
dayjs.extend(isoWeek)
dayjs.extend(utc)
dayjs.extend(timezone)

dayjs.locale('de')

// Material UI Theme
export const theme = createTheme({
    components: {
        MuiTextField: {
            defaultProps: {
                variant: 'standard',
                fullWidth: true,
                margin: 'normal',
            },
        },
    },
})

// Material UI DataGrid
LicenseInfo.setLicenseKey(DATA_GRID_LICENSE)

// As of React 18
const root = ReactDOM.createRoot(document.getElementById('root'))

root.render(
    <Provider store={store}>
        <LocalizationProvider dateAdapter={AdapterDayjs} adapterLocale={'de'}>
            <SnackbarProvider>
                <RouterProvider router={router}/>
            </SnackbarProvider>
        </LocalizationProvider>
    </Provider>,
)
