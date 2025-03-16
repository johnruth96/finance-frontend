import {ModelSelect, ModelSelectProps,} from '../core/forms/ModelSelect'

import {Contract} from "../app/types";
import {useGetContractsQuery} from "../app/api";
import React from "react";

export const ContractSelect = ({...props}: Omit<ModelSelectProps<Contract>, 'objects'>) => {
    const {data} = useGetContractsQuery()

    return (
        <ModelSelect
            objects={data ?? []}
            {...props}
        />
    )
}