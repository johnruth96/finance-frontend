import React, {useMemo} from "react";
import _ from "lodash";
import {computeExpense, computeIncome} from "../aggregate";
import {LineChart} from "@mui/x-charts";
import {blue} from "@mui/material/colors";
import {RecordType} from "../../app/types";

export interface BalanceLineChartProps {
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