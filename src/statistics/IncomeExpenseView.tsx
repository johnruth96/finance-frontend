import React from 'react'
import dayjs from 'dayjs'
import {Grid, Typography} from '@mui/material'
import {RecordPieChart} from "./RecordPieChart";

interface IncomeExpenseViewProps {
    dateStart: dayjs.Dayjs
    dateEnd: dayjs.Dayjs
}

export const IncomeExpenseView = ({dateStart, dateEnd}: IncomeExpenseViewProps) => {
    return (
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
    )
}
