import dayjs from "dayjs";
import {
    GridFilterModel,
    GridToolbarColumnsButton,
    GridToolbarContainer,
    GridToolbarFilterButton
} from "@mui/x-data-grid-premium";
import {Button} from "@mui/material";
import React, {Dispatch, SetStateAction} from "react";

interface RecordGridToolbar {
    onFilterModelChange: Dispatch<SetStateAction<GridFilterModel>>
}

// TODO: Deprecate (?)
export const RecordGridToolbar = ({onFilterModelChange}: RecordGridToolbar) => {
    const handleCurrenMonthClick = () => {
        onFilterModelChange((prevState) => {
            const items = prevState.items.filter(
                ({field}) => field !== 'date',
            )
            items.push({
                field: 'date',
                operator: 'onOrAfter',
                value: dayjs().startOf('month').toDate(),
            })
            items.push({
                field: 'date',
                operator: 'onOrBefore',
                value: dayjs().endOf('month').toDate(),
            })
            return {
                ...prevState,
                items,
            }
        })
    }

    const handleLastMonthClick = () => {
        onFilterModelChange((prevState) => {
            const items = prevState.items.filter(
                ({field}) => field !== 'date',
            )
            items.push({
                field: 'date',
                operator: 'onOrAfter',
                value: dayjs().subtract(1, 'month').startOf('month').toDate(),
            })
            items.push({
                field: 'date',
                operator: 'onOrBefore',
                value: dayjs().subtract(1, 'month').endOf('month').toDate(),
            })
            return {
                ...prevState,
                items,
            }
        })
    }

    const handleIncomeClick = () => {
        onFilterModelChange((prevState) => {
            const items = prevState.items.filter(
                ({field}) => field !== 'amount',
            )
            items.push({
                field: 'amount',
                operator: '>',
                value: 0,
            })
            return {
                ...prevState,
                items,
            }
        })
    }

    const handleExpenseClick = () => {
        onFilterModelChange((prevState) => {
            const items = prevState.items.filter(
                ({field}) => field !== 'amount',
            )
            items.push({
                field: 'amount',
                operator: '<',
                value: 0,
            })
            return {
                ...prevState,
                items,
            }
        })
    }

    return (
        <GridToolbarContainer>
            <GridToolbarFilterButton/>
            <GridToolbarColumnsButton/>
            <Button size={'small'} onClick={handleCurrenMonthClick}>
                Aktueller Monat
            </Button>
            <Button size={'small'} onClick={handleLastMonthClick}>
                Letzter Monat
            </Button>
            <Button size={'small'} onClick={handleIncomeClick}>
                Einnahmen
            </Button>
            <Button size={'small'} onClick={handleExpenseClick}>
                Ausgaben
            </Button>
        </GridToolbarContainer>
    )
}