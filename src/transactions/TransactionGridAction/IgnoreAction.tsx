import {ButtonProps} from "./types";
import {GridActionsCellItem} from '@mui/x-data-grid-premium'
import {Visibility, VisibilityOff} from '@mui/icons-material'
import React from 'react'
import {useHideTransactionMutation, useShowTransactionMutation} from '../../app/api';

const IgnoreButton = ({row}: ButtonProps) => {
    const [hide, {}] = useHideTransactionMutation()

    const handleClick = () => {
        hide(row.id)
    }

    return (
        <GridActionsCellItem
            label="Ignore"
            icon={<VisibilityOff/>}
            onClick={handleClick}
            disabled={row.is_ignored}
        />
    )
}

const UnIgnoreButton = ({row}: ButtonProps) => {
    const [show, {}] = useShowTransactionMutation()

    const handleClick = () => {
        show(row.id)
    }

    return (
        <GridActionsCellItem
            label="Un-ignore"
            icon={<Visibility/>}
            onClick={handleClick}
            disabled={!row.is_ignored}
        />
    )
}

export const IgnoreAction = ({row}: ButtonProps) => {
    if (row.is_ignored) {
        return <UnIgnoreButton row={row}/>
    } else {
        return <IgnoreButton row={row}/>
    }
}
