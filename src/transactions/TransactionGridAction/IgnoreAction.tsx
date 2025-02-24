import {ButtonProps} from "./types";
import {GridActionsCellItem} from '@mui/x-data-grid-premium'
import {Visibility, VisibilityOff} from '@mui/icons-material'
import React from 'react'
import {useHideTransactionMutation, useShowTransactionMutation} from '../../app/api';
import {getTransactionState, TransactionState} from "../types";

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
            disabled={getTransactionState(row) !== TransactionState.NEW}
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
            disabled={getTransactionState(row) !== TransactionState.IGNORED}
        />
    )
}

export const IgnoreAction = ({row}: ButtonProps) => {
    if (getTransactionState(row) === TransactionState.IGNORED) {
        return <UnIgnoreButton row={row}/>
    } else {
        return <IgnoreButton row={row}/>
    }
}
