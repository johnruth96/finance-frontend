import {Skeleton} from "@mui/material";
import {useGetContractsQuery} from "./finance/app/api";
import React from "react";
import {Link} from "react-router-dom";

export const ContractLink = ({id}: { id: number }) => {
    const {contract} = useGetContractsQuery(undefined, {
        selectFromResult: ({data}) => ({
            contract: data?.find(obj => obj.id === id)
        })
    })

    if (contract)
        return <Link to={`/contracts/${contract.id}/`}>{contract.name}</Link>
    else
        return <Skeleton variant={"text"}/>
}