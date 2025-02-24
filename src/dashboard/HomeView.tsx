import React from 'react'
import { Page } from '../core/Page'
import {
    connectListView,
    ListViewComponent,
} from '../core/framework/ListView'
import ContractPaymentView from '../contracts/views/ContractNextPaymentView'
import dayjs from 'dayjs'
import { Box, Grid, Typography } from '@mui/material'
import { IncomeCategoryPieChart } from '../statistics/StatisticsView/IncomeCategoryPieChart'
import { ExpenseCategoryPieChart } from '../statistics/StatisticsView/ExpenseCategoryPieChart'
import { AccountsView } from './AccountsView'

import {LogoutButton} from "../auth/LogoutButton";
import {RecordType} from "../app/types";

const HomeView = ({ objects }: ListViewComponent<RecordType>) => {
    return (
        <Page title={dayjs().format('MMMM YYYY')} addUrl={'/records/add/'}>
            <AccountsView records={objects} />

            <ContractPaymentView records={objects} />

            <Box>
                <Grid container spacing={2}>
                    <Grid item xs={12} sm={6}>
                        <Typography variant={'h6'} align={'center'}>
                            Ausgaben
                        </Typography>
                        <ExpenseCategoryPieChart records={objects} />
                    </Grid>
                    <Grid item xs={12} sm={6}>
                        <Typography variant={'h6'} align={'center'}>
                            Einnahmen
                        </Typography>
                        <IncomeCategoryPieChart records={objects} />
                    </Grid>
                </Grid>
            </Box>

            <LogoutButton/>
        </Page>
    )
}

const HomePage = connectListView(HomeView, {
    model: 'Record',
})

export default ({}) => {
    const params = {
        date_start: dayjs.utc().startOf('month').format('YYYY-MM-DD'),
        date_end: dayjs.utc().endOf('month').format('YYYY-MM-DD'),
    }

    return <HomePage searchParams={params} />
}
