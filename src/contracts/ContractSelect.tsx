import {Select, SelectProps,} from '../core/forms/Select'

import {Contract} from "../app/types";
import {useGetContractsQuery} from "../app/api";
import React, {useMemo} from "react";

export const getContractOptions = (contracts: Contract[]) => {
    const active = contracts.filter(obj => obj.is_active)
    const inactive = contracts.filter(obj => !obj.is_active)

    return [
        {label: "Aktive Verträge", items: active},
        {label: "Abgelaufene Verträge", items: inactive},
    ]
}

export const ContractSelect = ({...props}: Omit<SelectProps<Contract>, 'objects'>) => {
    const {data} = useGetContractsQuery()

    const contracts = useMemo(
        () => data ? getContractOptions(data) : [],
        [data]
    )

    return (
        <Select
            objects={contracts}
            {...props}
        />
    )
}