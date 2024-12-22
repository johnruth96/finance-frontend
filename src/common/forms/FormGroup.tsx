import React, { PropsWithChildren, ReactNode } from 'react'
import { Col, FormGroup, Label } from 'reactstrap'
import { Box, Typography, useTheme } from '@mui/material'

const GRID_SIZE = 12

export interface BasicFormGroupProps extends PropsWithChildren {
    label?: ReactNode
}

export const BasicFormGroup = ({ label, children }: BasicFormGroupProps) => {
    const theme = useTheme()

    return (
        <Box sx={{ mt: '8px', mb: '4px' }}>
            {label && <Typography variant={'caption'}>{label}</Typography>}
            {children}
        </Box>
    )
}

export interface FormGroupHorizontalProps extends PropsWithChildren {
    label?: ReactNode
    labelWidth?: number
}

export const FormGroupHorizontal = ({
    label,
    children,
    labelWidth = 6,
}: FormGroupHorizontalProps) => (
    <FormGroup row>
        <Label xs={labelWidth}>{label}</Label>
        <Col xs={GRID_SIZE - labelWidth}>{children}</Col>
    </FormGroup>
)
