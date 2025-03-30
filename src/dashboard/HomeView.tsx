import React from 'react'
import {Page} from '../core/Page'
import dayjs from 'dayjs'
import {Box, Grid, Typography} from '@mui/material'
import {IncomeCategoryPieChart} from '../statistics/StatisticsView/IncomeCategoryPieChart'
import {ExpenseCategoryPieChart} from '../statistics/StatisticsView/ExpenseCategoryPieChart'
import {RecordType} from "../app/types";
import {GridFilterModel} from "@mui/x-data-grid";
import {useGetRecordsQuery} from "../app/api";
import {QueryProvider} from "../core/QueryProvider";
import {AccountsView} from "./AccountsView";

interface HomeViewProps {
    records: RecordType[]
}

const HomeView = ({records}: HomeViewProps) => {
    return (
        <Page title={dayjs().format('MMMM YYYY')} addUrl={'/records/add/'}>
            <AccountsView records={records}/>

            <Box>
                <Grid container spacing={2}>
                    <Grid item xs={12} sm={6}>
                        <Typography variant={'h6'} align={'center'}>
                            Ausgaben
                        </Typography>
                        <ExpenseCategoryPieChart records={records}/>
                    </Grid>
                    <Grid item xs={12} sm={6}>
                        <Typography variant={'h6'} align={'center'}>
                            Einnahmen
                        </Typography>
                        <IncomeCategoryPieChart records={records}/>
                    </Grid>
                </Grid>
            </Box>
        </Page>
    )
}

export const HomeViewContainer = () => {
    const filterModel: GridFilterModel = {
        items: [
            {
                field: "date",
                operator: "onOrBefore",
                value: dayjs.utc().endOf('month').toDate(),
            },
            {
                field: "date",
                operator: "onOrAfter",
                value: dayjs.utc().startOf('month').toDate(),
            },
        ]
    }

    const {data, isLoading, isSuccess, error} = useGetRecordsQuery({
        filterModel: JSON.stringify(filterModel),
        paginationModel: {
            page: 0,
            pageSize: 1000,
        },
    })

    return (
        <QueryProvider isLoading={isLoading} isSuccess={isSuccess} error={error}>
            <HomeView records={data?.results ?? []}/>
        </QueryProvider>
    )
}
