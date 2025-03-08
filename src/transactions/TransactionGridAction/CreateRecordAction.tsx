import {ButtonProps} from './types'
import {GridActionsCellItem} from '@mui/x-data-grid-premium'
import {AddCircle} from '@mui/icons-material'
import {useCreateRecordMutation} from '../../app/api'
import React from 'react'
import {red} from "@mui/material/colors";
import {enqueueSnackbar} from "notistack";
import {RecordFactory} from '../factory/factory';

export const CreateRecordAction = ({row}: ButtonProps) => {
    const [createRecord, {isLoading, isError}] = useCreateRecordMutation()

    const handleClick = () => {
        const factory = new RecordFactory()
        const record = factory.createRecord(row)

        console.debug("Creating record:", record)

        createRecord(record).unwrap().catch((err: any) => {
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
            sx={isError ? {color: red[500]} : {}}
        />
    )
}
