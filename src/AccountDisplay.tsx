import {useGetAccountsQuery} from "./finance/app/api";
import React from "react";
import {Account} from "./finance/app/types";
import {Skeleton} from "@mui/material";

export const AccountDisplay = ({id}: { id: number }) => {
    const {account} = useGetAccountsQuery(undefined, {
        selectFromResult: ({data}: { data?: Account[] }) => ({
            account: data?.find(obj => obj.id === id)
        })
    })
    if (account)
        return (
            <span>{account.name}</span>
        )
    else
        return (
            <Skeleton variant={"text"}/>
        )
}