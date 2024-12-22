import {createBrowserRouter, createHashRouter} from 'react-router-dom'
import App from '../App'
import React from 'react'
import HomeView from '../pages/HomeView/HomeView'
import RecordListView from '../pages/RecordListView'
import {RecordCreateView} from '../pages/RecordCreateView'
import RecordUpdateView from '../pages/RecordUpdateView'
import ContractListView from '../pages/ContractListView'
import ContractCreateView from '../pages/ContractCreateView'
import ContractDetailView from '../pages/ContractDetailView'
import ContractUpdateView from '../pages/ContractUpdateView'
import {InsightsView} from '../pages/InsightsView'

export const routes = [
    {
        path: '/',
        element: <App/>,
        children: [
            {
                element: <HomeView/>,
                index: true,
            },
            /*
             Records
             */
            {
                path: 'records/',
                element: <RecordListView/>,
            },
            {
                path: 'records/add/',
                element: <RecordCreateView/>,
            },
            {
                path: 'records/:id/update/',
                element: <RecordUpdateView/>,
            },
            /*
             Contracts
             */
            {
                path: 'contracts/',
                element: <ContractListView/>,
            },
            {
                path: 'contracts/add/',
                element: <ContractCreateView/>,
            },
            {
                path: 'contracts/:id/',
                element: <ContractDetailView/>,
            },
            {
                path: 'contracts/:id/update/',
                element: <ContractUpdateView/>,
            },
            /*
             Analysis
             */
            {
                path: 'insights/',
                element: <InsightsView/>,
            },
        ],
    },
]

const router =
    'standalone' in window.navigator && window.navigator.standalone
        ? createHashRouter(routes)
        : createBrowserRouter(routes)

export default router
