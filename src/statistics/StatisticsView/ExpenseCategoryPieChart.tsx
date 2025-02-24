import React, {useMemo} from "react";
import {useGetCategorysQuery} from "../../app/api";
import {getCategoryAggregation} from "../aggregate";
import {CategoryPieChart} from "./CategoryPieChart";
import {RecordType} from "../../app/types";

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