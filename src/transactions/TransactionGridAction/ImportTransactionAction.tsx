import {ButtonProps} from './types'
import {GridActionsCellItem} from '@mui/x-data-grid-premium'
import {AddCircle} from '@mui/icons-material'
import {useImportTransactionMutation} from '../../app/api'
import React from 'react'
import {green, red} from "@mui/material/colors";
import {enqueueSnackbar} from "notistack";

export const ImportTransactionAction = ({row}: ButtonProps) => {
    const [importTransaction, {isLoading, isError, isSuccess}] = useImportTransactionMutation()

    const handleClick = () => {
        importTransaction(row.id).unwrap().catch((err: any) => {
            enqueueSnackbar(JSON.stringify(err), {variant: "error"})
            console.error(err)
        })
    }

    return (
        <GridActionsCellItem
            label={'Create record'}
            icon={<AddCircle/>}
            onClick={handleClick}
            disabled={isLoading}
            sx={isError ? {color: red[500]} : (isSuccess ? {color: green[500]} : {})}
        />
    )
}
