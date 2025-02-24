import React, { useEffect, useState } from 'react'
import { withValidation } from './withValidation'
import {
    IconButton,
    InputAdornment,
    TextField,
    TextFieldProps,
} from '@mui/material'
import AddCircleIcon from '@mui/icons-material/AddCircle'
import RemoveCircleIcon from '@mui/icons-material/RemoveCircle'
import green from '@mui/material/colors/green'
import red from '@mui/material/colors/red'

interface AmountInputProps extends Omit<TextFieldProps, 'onChange' | 'value'> {
    value: number | ''
    onChange: (value: number) => void
}

const AmountInput = ({
    value,
    onChange,
    label,
    ...props
}: AmountInputProps) => {
    const [amountText, setAmountText] = useState('')
    const [type, setType] = useState<'IN' | 'OUT'>('OUT')

    const isAmountTextValid = (amount: string) => {
        const pattern = /^\d+(?:.\d+)?$/
        return amount.match(pattern) !== null
    }

    const getValue = (type: 'IN' | 'OUT', amount: string) => {
        const sign = type === 'IN' ? 1 : -1
        return sign * parseFloat(amount.replace(',', '.'))
    }

    const handleChange = (type: 'IN' | 'OUT', amount: string) => {
        if (isAmountTextValid(amount)) {
            const newValue = getValue(type, amount)
            if (value !== newValue) {
                onChange(newValue)
            }
        }
    }

    const handleTypeToggle = () => {
        const newType = type === 'IN' ? 'OUT' : 'IN'
        setType(newType)
        handleChange(newType, amountText)
    }

    const handleAmountChange = (newAmountText: string) => {
        setAmountText(newAmountText)
        handleChange(type, newAmountText)
    }

    useEffect(() => {
        if (value !== '') {
            setAmountText(Math.abs(value).toString())
            setType(value > 0 ? 'IN' : 'OUT')
        } else {
            setAmountText('')
        }
    }, [value])

    return (
        <TextField
            {...props}
            label={label}
            value={amountText}
            inputProps={{ inputMode: 'decimal', pattern: '[0-9,]*' }}
            onChange={(evt) => handleAmountChange(evt.target.value)}
            InputProps={{
                startAdornment: (
                    <InputAdornment position="end">
                        <IconButton onClick={handleTypeToggle} edge="start">
                            {type === 'IN' ? (
                                <AddCircleIcon sx={{ color: green[500] }} />
                            ) : (
                                <RemoveCircleIcon sx={{ color: red[500] }} />
                            )}
                        </IconButton>
                    </InputAdornment>
                ),
            }}
        />
    )
}

export default withValidation(AmountInput)
