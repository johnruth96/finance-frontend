import React, {useMemo} from "react";
import _ from "lodash";
import {computeExpense, computeIncome} from "../aggregate";
import {LineChart} from "@mui/x-charts";
import {red} from "@mui/material/colors";
import {BalanceLineChartProps} from "./BalanceLineChart";

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
                {dataKey: 'expense', label: 'Ausgaben', color: red[500]},
                {dataKey: 'income', label: 'Einnahmen', color: 'green'},
            ]}
            height={400}
        />
    )
}