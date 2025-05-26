import {createBrowserRouter, createHashRouter} from 'react-router-dom'
import App from '../App'
import React from 'react'
import {HomeView} from '../dashboard/HomeView'
import RecordListView from '../records/views/RecordListView'
import {RecordCreateView} from '../records/views/RecordCreateView'
import ContractListView from '../contracts/views/ContractListView'
import ContractCreateView from '../contracts/views/ContractCreateView'
import ContractDetailView from '../contracts/views/ContractDetailView'
import ContractUpdateView from '../contracts/views/ContractUpdateView'
import {StatisticsView} from '../statistics/StatisticsView'
import {TransactionListView} from "../transactions/views/TransactionListView";
import {ImportView} from "../transactions/views/ImportView";
import {LatestRecordListView} from "../transactions/views/LatestRecordListView";
import {RecordDetailPage} from "../records/views/RecordDetailPage";

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
                path: 'records/:id/',
                element: <RecordDetailPage/>,
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
                element: <StatisticsView/>,
            },
            /*
             Transactions
             */
            {
                path: 'transactions/',
                element: <TransactionListView/>,
            },
            {
                path: 'transactions/latest/',
                element: <LatestRecordListView/>,
            },
            {
                path: 'transactions/import/',
                element: <ImportView/>,
            },
        ],
    },
]

const router =
    'standalone' in window.navigator && window.navigator.standalone
        ? createHashRouter(routes)
        : createBrowserRouter(routes)

export default router
