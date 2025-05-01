import React from 'react'
import {Page} from '../../core/Page'
import {filter, round, sortBy, sumBy} from 'lodash'
import {Box,} from '@mui/material'
import {ContractGrid} from './ContractGrid'
import {GridFilterModel} from '@mui/x-data-grid'
import {Contract} from "../../app/types";
import {useGetContractsQuery} from "../../app/api";
import {QueryProvider} from "../../core/QueryProvider";

interface ContractListViewProps {
    objects: Contract[]
}

const ContractListView = ({objects}: ContractListViewProps) => {
    const activeContracts = filter(objects, 'is_active')

    const contractsExpense = sortBy(
        filter(activeContracts, (c) => c.amount < 0),
        'name',
    )

    const expensePerMonth = Math.abs(
        round(sumBy(contractsExpense, 'amount_per_year') / 12.0),
    )

    const initialFilterModel: GridFilterModel = {
        items: [
            {
                field: 'is_active',
                operator: 'is',
                value: true,
            },
        ],
    }

    return (
        <Page title={'Verträge'} addUrl={`add/`}>
            <Box sx={{mb: 5}}>
                <p className={'display-3 mb-0'}>{expensePerMonth} €</p>
                <p className={'text-small'}>&empty; monatliche Ausgaben</p>
            </Box>

            <ContractGrid filterModel={initialFilterModel}/>
        </Page>
    )
}

export default () => {
    const {data, isSuccess, isLoading, error} = useGetContractsQuery()

    return <QueryProvider isLoading={isLoading} isSuccess={isSuccess} error={error}>
        <ContractListView objects={data ?? []}/>
    </QueryProvider>
}
