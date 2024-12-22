import React, {useMemo} from "react";
import {useGetCategorysQuery} from "../../finance/app/api";
import {RecordType} from "../../finance/app/types";
import {getCategoryAggregation} from "../../aggregate";
import {CategoryPieChart} from "./CategoryPieChart";

export const ExpenseCategoryPieChart = ({records}: {
    records: RecordType[]
}) => {
    const {data: categories} = useGetCategorysQuery()

    const dataset = useMemo(() => {
        const expenseRecords = records.filter(r => r.amount < 0)
        return getCategoryAggregation(categories ?? [], expenseRecords)
    }, [categories, records])

    return <CategoryPieChart dataset={dataset} isLoading={dataset.length === 0}/>
}