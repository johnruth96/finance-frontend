import React from 'react'


interface AmountProps {
    value: number
}

// TODO: Compare to core/AmountDisplay.tsx
export const Amount = ({value}: AmountProps) => {
    if (value < 0) {
        return <span className={'text-danger'}>{value}</span>
    } else {
        return <span className={'text-success'}>{value}</span>
    }
}
