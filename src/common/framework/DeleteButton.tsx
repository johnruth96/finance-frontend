import React, { useEffect } from 'react'
import { baseApi } from '../../app/api'
import { ButtonProps } from 'reactstrap/types/lib/Button'
import { useNavigate } from 'react-router-dom'
import { formatError } from '../ApiError'
import { To } from '@remix-run/router'
import { ProgressButton } from '../shared/ProgressButton'
import red from '@mui/material/colors/red'

interface DeleteButtonProps extends Omit<ButtonProps, 'onClick'> {
    id: number
    model: string
    successUrl: To | number
    label?: string
}

export default ({
    id,
    model,
    successUrl,
    label = 'Löschen',
    ...props
}: DeleteButtonProps) => {
    const deleteHookName = `useDelete${model}Mutation`
    const deleteHook = baseApi[deleteHookName]

    const [deleteModel, queryState] = deleteHook()

    const onClick = () => {
        if (confirm(`${model} ${id} löschen?`)) {
            deleteModel(id)
        }
    }

    const navigate = useNavigate()
    useEffect(() => {
        if (queryState.isSuccess) {
            navigate(successUrl)
        }
    }, [navigate, queryState.isSuccess, successUrl])

    useEffect(() => {
        if (queryState.isError) alert(formatError(queryState.error))
    }, [queryState.isError, queryState.error])

    return (
        <ProgressButton
            sx={{
                bgcolor: red[500],
                '&:hover': {
                    bgcolor: red[700],
                },
            }}
            onClick={onClick}
            disabled={queryState.isLoading}
            className={'w-100'}
            loading={queryState.loading}
            {...props}
        >
            {label}
        </ProgressButton>
    )
}
