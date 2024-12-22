import {RecordType} from "../../finance/app/types";
import React from "react";
import {AmountDisplay} from "../../AmountDisplay";
import {adaRound, computeBalance} from "../../aggregate";

export const BalanceView = ({objects}: {
    objects: RecordType[]
}) => {
    const balance = adaRound(computeBalance(objects))

    return <AmountDisplay value={balance} sign/>
}