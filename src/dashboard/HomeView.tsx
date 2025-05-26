import React from 'react'
import {Page} from '../core/Page'
import dayjs from 'dayjs'
import {Box} from '@mui/material'
import {IncomeExpenseView} from "../statistics/IncomeExpenseView";

export const HomeView = ({}) => {
    return (
        <Page title={dayjs().format('MMMM YYYY')} addUrl={'/records/add/'}>
            {/*<AccountsView records={records}/>*/}

            <Box>
                <IncomeExpenseView
                    dateStart={dayjs.utc().startOf('month')}
                    dateEnd={dayjs.utc().endOf('month')}
                />
            </Box>
        </Page>
    )
}