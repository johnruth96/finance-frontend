import {filter, map, reverse, round, sortBy, sum} from "lodash";

import {Category, RecordType} from "./app/types";

export interface CategoryAggregation {
    label: string
    color: string
    value: number
    children: CategoryAggregation[]
}

export const getCategoryAggregation = (categories: Category[], records: RecordType[]): CategoryAggregation[] => {
    const rootCats = filter(categories, c => c.parent === null)

    const summarizeCategory = (category: Category): CategoryAggregation => {
        const children = categories.filter(cat => cat.parent === category.id)
        const childrenAggregation = children
            .map(summarizeCategory)
            .filter(item => item.value > 0)

        const value = computeSum(category) + sum(map(childrenAggregation, 'value'))

        return {
            label: category.name,
            color: category.color,
            value: value,
            children: reverse(sortBy(childrenAggregation, ['value'])),
        }
    }

    const computeSum = (category: Category): number => {
        const recordList = filter(records, r => r.category === category.id)
        const amounts = map(recordList, 'amount')
        return round(Math.abs(sum(amounts)))
    }

    const aggregation = rootCats
        .map(summarizeCategory)
        .filter(item => item.value > 0)
    return reverse(sortBy(aggregation, ['value']))
}

export const computeIncome = (records: RecordType[]) => sum(map(filter(records, r => r.amount > 0), 'amount'))

export const computeExpense = (records: RecordType[]) => sum(map(filter(records, r => r.amount < 0), 'amount'))

export const computeBalance = (records: RecordType[]) => computeIncome(records) + computeExpense(records)

export const adaRound = (value: number) => {
    return Math.abs(value) < 100 ?
        value :
        Math.abs(value) < 1000 ?
            Math.round(value / 10) * 10 :
            Math.round(value / 100) * 100
}