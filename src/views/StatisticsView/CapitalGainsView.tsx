import {Category, RecordType} from "../../finance/app/types";
import React from "react";
import {AmountDisplay} from "../../AmountDisplay";
import {useGetCategorysQuery} from "../../finance/app/api";
import {adaRound, computeIncome} from "../../aggregate";

export const CapitalGainsView = ({objects}: {
    objects: RecordType[]
}) => {
    const {capitalGains} = useGetCategorysQuery(undefined, {
        selectFromResult: ({data}: { data?: Category[] }) => ({
            capitalGains: (data ?? []).find((category: Category) => category.name === "Kapitalerträge")
        })
    })

    const records = capitalGains ? objects.filter(record => record.category === capitalGains.id) : []

    const value = adaRound(computeIncome(records))

    return <AmountDisplay value={value} sign/>
}