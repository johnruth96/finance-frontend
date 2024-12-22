import React from "react";
import {AmountDisplay} from "../../AmountDisplay";
import {map} from "lodash";
import {RecordType} from "../../app/types";

export const MaxExpenseView = ({objects}: {
    objects: RecordType[]
}) => {
    const maxExpense = Math.min(...map(objects, 'amount'))
    const recordMaxExpense = objects.find(obj => obj.amount === maxExpense)

    if (recordMaxExpense) {
        return <span>
            <AmountDisplay value={recordMaxExpense.amount}/>
            {" "}
            {recordMaxExpense.subject}
        </span>
    } else {
        return <span>--</span>
    }
}