import React, {useState} from 'react'
import {Page} from '../core/Page'
import dayjs from 'dayjs'
import {Alert, Box, Grid, Typography} from '@mui/material'
import {DatePicker} from '@mui/x-date-pickers'
import {IncomeExpenseView} from "./IncomeExpenseView";
import {RecordPieChart} from "./RecordPieChart";

export const StatisticsView = ({}) => {
    const [dateStart, setDateStart] = useState(dayjs.utc().startOf('month'))
    const [dateEnd, setDateEnd] = useState(dayjs.utc().endOf('month'))

    return (
        <Page title={'Statistik'}>
            {/* Input */}
            <Grid container spacing={2} sx={{mb: 3}}>
                <Grid item xs={6} sm>
                    <DatePicker
                        label={'Beginn'}
                        value={dateStart}
                        onChange={(value) => {
                            if (value !== null) {
                                setDateStart(value)
                            }
                        }}
                        sx={{width: "100%"}}
                    />
                </Grid>
                <Grid item xs={6} sm>
                    <DatePicker
                        label={'Ende'}
                        value={dateEnd}
                        onChange={(value) => {
                            if (value !== null) {
                                setDateEnd(value)
                            }
                        }}
                        sx={{width: "100%"}}
                    />
                </Grid>
            </Grid>

            <Box sx={{mb: 8}}>
                <IncomeExpenseView dateStart={dateStart} dateEnd={dateEnd}/>
            </Box>

            <Grid container spacing={2} sx={{mb: 8}}>
                <Grid item xs={6} sm>
                    <Typography variant={'h6'} align={'center'}>
                        Restaurants & Bars
                    </Typography>

                    <RecordPieChart
                        filter={{
                            category__parent__name: "Restaurants & Bars",
                            date__gte: dateStart.format("YYYY-MM-DD"),
                            date__lte: dateEnd.format("YYYY-MM-DD"),
                        }}
                        group={"category__name"}
                        aggregate={"sum"}
                    />
                </Grid>
                <Grid item xs={6} sm>
                    <Typography variant={'h6'} align={'center'}>
                        Cafés und Coffee Shops
                    </Typography>

                    <RecordPieChart
                        filter={{
                            category__name: "Cafés & Coffee Shops",
                            date__gte: dateStart.format("YYYY-MM-DD"),
                            date__lte: dateEnd.format("YYYY-MM-DD"),
                        }}
                        group={"subject"}
                        aggregate={"sum"}
                    />
                </Grid>
            </Grid>

            <Alert severity={"info"}>
                TODO: Add table with expenses and drill-down feature
            </Alert>
        </Page>
    )
}
