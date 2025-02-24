import React, {useMemo} from "react";
import {useGetCategorysQuery} from "../../app/api";
import {getCategoryAggregation} from "../aggregate";
import {CategoryPieChart} from "./CategoryPieChart";
import {RecordType} from "../../app/types";


export const IncomeCategoryPieChart = ({records}: {
    records: RecordType[]
}) => {
    const {data: categories} = useGetCategorysQuery()

    const dataset = useMemo(() => {
        const incomeRecords = records.filter(r => r.amount > 0)
        const dataset = getCategoryAggregation(categories ?? [], incomeRecords)

        if (dataset.length === 1)
            return dataset[0].children
        else
            return []
    }, [categories, records])

    return <CategoryPieChart dataset={dataset} isLoading={dataset.length === 0}/>
}