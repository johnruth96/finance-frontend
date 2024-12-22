import {createBrowserRouter, createHashRouter} from 'react-router-dom'
import App from '../App'
import React from 'react'
import HomeView from '../views/HomeView/HomeView'
import RecordListView from '../views/RecordListView'
import {RecordCreateView} from '../views/RecordCreateView'
import RecordUpdateView from '../views/RecordUpdateView'
import ContractListView from '../views/ContractListView'
import ContractCreateView from '../views/ContractCreateView'
import ContractDetailView from '../views/ContractDetailView'
import ContractUpdateView from '../views/ContractUpdateView'
import {InsightsView} from '../views/InsightsView'

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
