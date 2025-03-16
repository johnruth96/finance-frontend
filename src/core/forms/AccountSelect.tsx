import {ModelSelect, ModelSelectProps,} from './ModelSelect'
import React from 'react'
import {Account} from "../../app/types";
import {useGetAccountsQuery} from '../../app/api';


export const AccountSelect = ({...props}: Omit<ModelSelectProps<Account>, 'objects'>) => {
    const {data} = useGetAccountsQuery()

    return (
        <ModelSelect
            objects={data ?? []}
            {...props}
        />
    )
}
