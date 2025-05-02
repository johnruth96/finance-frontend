import React, {useState} from 'react'
import {Page} from '../core/Page'
import dayjs from 'dayjs'
import {Alert, Box, Grid, Typography} from '@mui/material'
import {DatePicker} from '@mui/x-date-pickers'
import {RecordPieChart} from "./RecordPieChart";

export const StatisticsView = ({}) => {
    const [dateStart, setDateStart] = useState(dayjs.utc().startOf('month'))
    const [dateEnd, setDateEnd] = useState(dayjs.utc().endOf('month'))

    return (
        <Page title={'Statistics'}>
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
                <Grid container spacing={2}>
                    <Grid item xs={12} sm={6}>
                        <Typography variant={'h6'} align={'center'}>
                            Ausgaben
                        </Typography>

                        <RecordPieChart
                            filter={{
                                date__gte: dateStart.format("YYYY-MM-DD"),
                                date__lte: dateEnd.format("YYYY-MM-DD"),
                                amount__lte: 0,
                                major_category_id__in: [94, 50, 40, 45, 57, 56, 52, 88, 51, 55, 105, 62, 77, 10, 54],
                            }}
                            group="major_category_name"
                            aggregate="sum"
                        />
                    </Grid>
                    <Grid item xs={12} sm={6}>
                        <Typography variant={'h6'} align={'center'}>
                            Einnahmen
                        </Typography>

                        <RecordPieChart
                            filter={{
                                date__gte: dateStart.format("YYYY-MM-DD"),
                                date__lte: dateEnd.format("YYYY-MM-DD"),
                                amount__gte: 0,
                                category__parent__id: 40,
                            }}
                            group="category__name"
                            aggregate="sum"
                        />
                    </Grid>
                </Grid>
            </Box>

            <Alert severity={"info"}>
                TODO: Add table with expenses and drill-down feature
            </Alert>
        </Page>
    )
}
