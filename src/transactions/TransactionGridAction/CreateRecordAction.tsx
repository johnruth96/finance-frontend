import {ButtonProps} from './types'
import {GridActionsCellItem} from '@mui/x-data-grid-premium'
import {AddCircle} from '@mui/icons-material'
import {useCreateRecordMutation, useGetCategoriesQuery, useGetContractsQuery} from '../../app/api'
import React from 'react'
import {red} from "@mui/material/colors";
import {enqueueSnackbar} from "notistack";
import {RecordFactory} from '../factory/factory';
import {TRANSFORM_RULES} from "../../app/rules";

export const CreateRecordAction = ({row}: ButtonProps) => {
    const [createRecord, createStatus] = useCreateRecordMutation()
    const {data: categories, ...getCategoriesStatus} = useGetCategoriesQuery()
    const {data: contracts, ...getContractsStatus} = useGetContractsQuery()

    const handleClick = () => {
        if (categories && contracts) {
            const factory = new RecordFactory()
            factory.setRules(TRANSFORM_RULES)
            factory.setCategories(categories)
            factory.setContracts(contracts)

            const record = factory.createRecord(row)

            console.debug("Creating record:", record)

            createRecord(record).unwrap().catch((err: any) => {
                enqueueSnackbar(JSON.stringify(err), {variant: "error"})
                console.error(err)
            })
        }
    }

    const isError = createStatus.isError || getCategoriesStatus.isError || getContractsStatus.isError
    const isLoading = createStatus.isLoading || getCategoriesStatus.isLoading || getContractsStatus.isLoading

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
