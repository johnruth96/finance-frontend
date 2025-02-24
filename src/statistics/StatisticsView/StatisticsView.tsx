import React, { useMemo, useState } from 'react'
import {
    connectListView,
    ListViewComponent,
} from '../../core/framework/ListView'
import _, { filter } from 'lodash'
import {
    Box,
    Grid,
    Paper,
    ToggleButton,
    ToggleButtonGroup,
    Typography,
} from '@mui/material'
import { LineChart } from '@mui/x-charts'
import { useGetCategorysQuery } from '../../app/api'
import { BalanceView } from './BalanceView'
import dayjs from 'dayjs'
import { blue, red } from '@mui/material/colors'
import { CategoryPieChart } from './CategoryPieChart'
import {
    CategoryAggregation,
    computeExpense,
    computeIncome,
    getCategoryAggregation,
} from '../aggregate'
import { IncomeCategoryPieChart } from './IncomeCategoryPieChart'
import { ExpenseCategoryPieChart } from './ExpenseCategoryPieChart'
import { MaxExpenseView } from './MaxExpenseView'
import { CapitalGainsView } from './CapitalGainsView'
import {RecordType} from "../../app/types";

export const StatBox = ({
    label,
    value,
}: {
    label: string
    value: React.ReactNode
}) => {
    return (
        <Paper sx={{ p: 3 }}>
            <Typography variant={'caption'}>{label}</Typography>
            <Typography variant={'h3'}>{value}</Typography>
        </Paper>
    )
}

const CategoryChildrenPieChartView = ({
    categoryAgg,
}: {
    categoryAgg: CategoryAggregation
}) => {
    return (
        <Box>
            <Typography variant={'h6'} align={'center'}>
                {categoryAgg.label}
            </Typography>
            <CategoryPieChart dataset={categoryAgg.children} />
        </Box>
    )
}

interface BalanceLineChartProps {
    records: RecordType[]
    groupBy: (record: RecordType) => number
    valueFormatter: (timestamp: number) => string
}

export const BalanceLineChart = ({
    records,
    groupBy,
    valueFormatter,
}: BalanceLineChartProps) => {
    const dataset = useMemo(() => {
        const dataset: Record<string, number>[] = []
        const recordsByGroup = _.groupBy(records, groupBy)

        const groupedRecords = Object.entries(recordsByGroup)

        groupedRecords.sort((a, b) => parseInt(a[0]) - parseInt(b[0]))

        let balance_cumulated = 0
        for (const [timestamp, records] of groupedRecords) {
            balance_cumulated +=
                computeExpense(records) + computeIncome(records)

            dataset.push({
                timestamp: parseInt(timestamp),
                value: balance_cumulated,
            })
        }

        return dataset
    }, [records, groupBy])

    return (
        <LineChart
            dataset={dataset}
            xAxis={[
                {
                    dataKey: 'timestamp',
                    valueFormatter: valueFormatter,
                    scaleType: 'point',
                },
            ]}
            series={[
                {
                    id: 'balance',
                    dataKey: 'value',
                    label: 'Bilanz (kumuliert)',
                    color: blue[600],
                    area: true,
                },
            ]}
            height={400}
            sx={{
                '& .MuiAreaElement-series-balance': {
                    fill: blue[50],
                },
            }}
        />
    )
}

export const IncomeExpenseLineChart = ({
    records,
    groupBy,
    valueFormatter,
}: BalanceLineChartProps) => {
    const dataset = useMemo(() => {
        const recordsByGroup = _.groupBy(records, groupBy)
        const groupedRecords = Object.entries(recordsByGroup)

        groupedRecords.sort((a, b) => parseInt(a[0]) - parseInt(b[0]))

        return groupedRecords.map(([timestamp, records]) => ({
            timestamp: parseInt(timestamp),
            expense: Math.abs(computeExpense(records)),
            income: computeIncome(records),
        }))
    }, [records, groupBy])

    return (
        <LineChart
            dataset={dataset}
            xAxis={[
                {
                    dataKey: 'timestamp',
                    valueFormatter: valueFormatter,
                    scaleType: 'point',
                },
            ]}
            series={[
                { dataKey: 'expense', label: 'Ausgaben', color: red[500] },
                { dataKey: 'income', label: 'Einnahmen', color: 'green' },
            ]}
            height={400}
        />
    )
}

type GroupingType = 'month' | 'week' | 'year'

const StatisticsView = ({ objects }: ListViewComponent<RecordType>) => {
    const { data: categories } = useGetCategorysQuery()
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
            <Box sx={{ mb: 8 }}>
                <Grid container spacing={2}>
                    <Grid item xs>
                        <StatBox
                            label={'Bilanz'}
                            value={<BalanceView objects={objects} />}
                        />
                    </Grid>

                    <Grid item xs>
                        <StatBox
                            label={'Kapitalerträge'}
                            value={<CapitalGainsView objects={objects} />}
                        />
                    </Grid>

                    <Grid item xs>
                        <StatBox
                            label={'Teuerste Ausgabe'}
                            value={<MaxExpenseView objects={objects} />}
                        />
                    </Grid>
                </Grid>
            </Box>

            <Box sx={{ mb: 8 }}>
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

            <Box sx={{ mb: 8 }}>
                <Typography variant={'h4'}>Ausgaben</Typography>

                <Grid container spacing={2}>
                    {datasetExpense.map((item) => (
                        <Grid item xs={12} sm={6} key={item.label}>
                            <CategoryChildrenPieChartView categoryAgg={item} />
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

export default connectListView(StatisticsView, {
    model: 'Record',
})
