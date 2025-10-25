import {Select, SelectProps,} from './Select'
import React from 'react'
import {Account} from "../../app/types";
import {useGetAccountsQuery} from '../../app/api';


export const AccountSelect = ({...props}: Omit<SelectProps<Account>, 'objects'>) => {
    const {data} = useGetAccountsQuery()

    return (
        <Select
            objects={data ?? []}
            {...props}
        />
    )
}
