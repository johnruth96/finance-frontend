import React from 'react'
import {RecordAggregationQueryArg, useGetRecordAggregationQuery} from "../app/api";
import {CategoryPieChart} from "./charts/CategoryPieChart";


export const RecordPieChart = (props: RecordAggregationQueryArg) => {
    const {data, isLoading} = useGetRecordAggregationQuery(props)

    return (
        <CategoryPieChart
            isLoading={isLoading}
            dataset={data?.results ?? []}
        />
    )
}