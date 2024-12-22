import { GridRowsProp } from '@mui/x-data-grid'
import { RecordType } from '../../finance/app/types'
import {
    GridRowModes,
    GridRowModesModel,
    GridToolbarContainer,
} from '@mui/x-data-grid-premium'
import { randomId } from '@mui/x-data-grid-generator'
import { Button } from '@mui/material'
import AddIcon from '@mui/icons-material/Add'
import React from 'react'

interface ToolbarProps {
    setRows: (
        newRows: (
            oldRows: GridRowsProp<RecordType>,
        ) => GridRowsProp<RecordType>,
    ) => void
    setRowModesModel: (
        newModel: (
            oldModel: GridRowModesModel<RecordType>,
        ) => GridRowModesModel<RecordType>,
    ) => void
}

export const Toolbar = ({ setRows, setRowModesModel }: ToolbarProps) => {
    const handleClick = () => {
        const id = randomId()
        setRows((oldRows) => [
            ...oldRows,
            {
                id,
                amount: 0,
                subject: '',
                date: new Date(),
                category: null,
                contract: null,
                account: null,
            },
        ])
        setRowModesModel((oldModel) => {
            return {
                ...oldModel,
                [id]: { mode: GridRowModes.Edit, fieldToFocus: 'amount' },
            }
        })
    }

    return (
        <GridToolbarContainer>
            <Button
                color="primary"
                startIcon={<AddIcon />}
                onClick={handleClick}
            >
                Zeile hinzufügen
            </Button>
        </GridToolbarContainer>
    )
}
