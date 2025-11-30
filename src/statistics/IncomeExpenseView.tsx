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
                        major_category_name__in: [
                            "Versicherungen",
                            "Finanzen & Steuern",
                            "Restaurants & Bars",
                            "Lebensmittel",
                            "Wohnen & Haushalt",
                            "Shopping",
                            "Gesundheit",
                            "Freizeit & Unterhaltung",
                            "Sparen & Vorsorge",
                            "Verkehr & Mobilität",
                            "Reisen & Urlaub",
                            "Bildung & Beruf",
                            "Drogerie (neu)",
                            "Sonstige Ausgaben (neu)",
                        ],
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
                        category__parent__name: "Einnahmen",
                    }}
                    group="category__name"
                    aggregate="sum"
                />
            </Grid>
        </Grid>
    )
}
