import React, {useMemo, useState} from 'react'
import {filter} from 'lodash'
import {Box, Grid, ToggleButton, ToggleButtonGroup, Typography,} from '@mui/material'
import {useGetCategorysQuery} from '../../app/api'
import {BalanceView} from './BalanceView'
import dayjs from 'dayjs'
import {getCategoryAggregation,} from '../aggregate'
import {IncomeCategoryPieChart} from './IncomeCategoryPieChart'
import {ExpenseCategoryPieChart} from './ExpenseCategoryPieChart'
import {MaxExpenseView} from './MaxExpenseView'
import {CapitalGainsView} from './CapitalGainsView'
import {RecordType} from "../../app/types";
import {IncomeExpenseLineChart} from "./IncomeExpenseLineChart";
import {BalanceLineChart} from "./BalanceLineChart";
import {CategoryChildrenPieChartView} from "./CategoryChildrenPieChartView";
import {StatBox} from "./StatBox";

type GroupingType = 'month' | 'week' | 'year'

interface StatisticsViewProps {
    objects: RecordType[]
}

export const StatisticsView = ({objects}: StatisticsViewProps) => {
    const {data: categories} = useGetCategorysQuery()
    const [grouping, setGrouping] = useState<GroupingType>('month')

    const datasetExpense = useMemo(() => {
        const expenseRecords = filter(objects, (r) => r.amount < 0)
        return getCategoryAggregation(categories ?? [], expenseRecords)
    }, [categories, objects])

    const handleGroupingChange = (
        _: React.MouseEvent<HTMLElement>,
        newGrouping: GroupingType | null,
    ) => {
        if (newGrouping !== null) setGrouping(newGrouping)
    }

    let groupBy, valueFormatter
    if (grouping === 'week') {
        groupBy = (record: RecordType): number =>
            dayjs(record.date).startOf('isoWeek').valueOf()
        valueFormatter = (timestamp: number): string =>
            `KW ${dayjs(timestamp).format('WW')}`
    } else if (grouping === 'month') {
        groupBy = (record: RecordType): number =>
            dayjs(record.date).startOf('month').valueOf()
        valueFormatter = (timestamp: number): string =>
            dayjs(timestamp).format('MMM YY')
    } else {
        groupBy = (record: RecordType): number =>
            dayjs(record.date).startOf('year').valueOf()
        valueFormatter = (timestamp: number): string =>
            dayjs(timestamp).format('YYYY')
    }

    return (
        <Box>
            <Box sx={{mb: 8}}>
                <Grid container spacing={2}>
                    <Grid item xs>
                        <StatBox
                            label={'Bilanz'}
                            value={<BalanceView objects={objects}/>}
                        />
                    </Grid>

                    <Grid item xs>
                        <StatBox
                            label={'Kapitalerträge'}
                            value={<CapitalGainsView objects={objects}/>}
                        />
                    </Grid>

                    <Grid item xs>
                        <StatBox
                            label={'Teuerste Ausgabe'}
                            value={<MaxExpenseView objects={objects}/>}
                        />
                    </Grid>
                </Grid>
            </Box>

            <Box sx={{mb: 8}}>
                <Grid container spacing={2}>
                    <Grid item xs={12} sm={6}>
                        <Typography variant={'h6'} align={'center'}>
                            Ausgaben
                        </Typography>
                        <ExpenseCategoryPieChart records={objects}/>
                    </Grid>
                    <Grid item xs={12} sm={6}>
                        <Typography variant={'h6'} align={'center'}>
                            Einnahmen
                        </Typography>
                        <IncomeCategoryPieChart records={objects}/>
                    </Grid>
                </Grid>
            </Box>

            <Box sx={{mb: 8}}>
                <Typography variant={'h4'}>Ausgaben</Typography>

                <Grid container spacing={2}>
                    {datasetExpense.map((item) => (
                        <Grid item xs={12} sm={6} key={item.label}>
                            <CategoryChildrenPieChartView categoryAgg={item}/>
                        </Grid>
                    ))}
                </Grid>
            </Box>

            <Box>
                <Typography variant={'h4'}>Zeitliche Entwicklung</Typography>

                <ToggleButtonGroup
                    value={grouping}
                    exclusive
                    onChange={handleGroupingChange}
                >
                    <ToggleButton value="week">Woche</ToggleButton>
                    <ToggleButton value="month">Monat</ToggleButton>
                    <ToggleButton value="year">Jahr</ToggleButton>
                </ToggleButtonGroup>

                {/* Ein- und Ausgaben */}
                <IncomeExpenseLineChart
                    records={objects}
                    groupBy={groupBy}
                    valueFormatter={valueFormatter}
                />

                {/* Bilanz */}
                <BalanceLineChart
                    records={objects}
                    groupBy={groupBy}
                    valueFormatter={valueFormatter}
                />
            </Box>
        </Box>
    )
}