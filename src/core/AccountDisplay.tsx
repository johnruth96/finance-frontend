import {useGetAccountsQuery} from '../app/api'
import React from 'react'
import {Skeleton, Typography} from '@mui/material'
import {TypographyOwnProps} from "@mui/material/Typography/Typography";

interface AccountDisplayProps extends TypographyOwnProps {
    id: number
}

export const AccountDisplay = ({id, ...props}: AccountDisplayProps) => {
    const {account} = useGetAccountsQuery(undefined, {
        selectFromResult: ({data}) => ({
            account: data?.find((obj) => obj.id === id),
        }),
    })

    if (account) {
        return (
            <Typography {...props}>{account.name}</Typography>
        )
    } else {
        return <Skeleton variant={'text'}/>
    }
}
