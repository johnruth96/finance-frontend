import React from 'react'
import { MenuItem, TextField } from '@mui/material'

export enum PaymentCycles {
    Monthly = 'm',
    Quaterly = 'q',
    Biannual = 'h',
    Yearly = 'y',
}

export const PAYMENT_CYCLES = [
    { value: PaymentCycles.Monthly, label: 'monatlich' },
    { value: PaymentCycles.Quaterly, label: 'quartalsweise' },
    { value: PaymentCycles.Biannual, label: 'halbjährlich' },
    { value: PaymentCycles.Yearly, label: 'jährlich' },
]

export const getPaymentCycleDisplay = (paymentCycle: string) => {
    return (
        PAYMENT_CYCLES.find(({ value }) => value === paymentCycle)?.label ??
        'N/A'
    )
}

interface PaymentCycleInputProps {
    value: string
    onChange: (value: string) => void
    allowEmpty?: boolean
    label?: string
}

export const PaymentCycleInput = ({
    value,
    onChange,
    allowEmpty,
    label,
    ...props
}: PaymentCycleInputProps) => {
    return (
        <TextField
            label={label}
            select
            value={value}
            onChange={(evt) => onChange(evt.target.value)}
            {...props}
        >
            {(value === '' || allowEmpty) && (
                <MenuItem value={''}>---</MenuItem>
            )}

            {PAYMENT_CYCLES.map(({ value, label }) => (
                <MenuItem value={value} key={value}>
                    {label}
                </MenuItem>
            ))}
        </TextField>
    )
}
