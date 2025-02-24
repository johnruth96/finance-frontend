import React from "react";
import {AmountDisplay} from "../../core/AmountDisplay";
import {adaRound, computeBalance} from "../aggregate";
import {RecordType} from "../../app/types";

export const BalanceView = ({objects}: {
    objects: RecordType[]
}) => {
    const balance = adaRound(computeBalance(objects))

    return <AmountDisplay value={balance} sign/>
}