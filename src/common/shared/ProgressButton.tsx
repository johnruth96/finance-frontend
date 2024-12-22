import { Box, Button, ButtonProps, CircularProgress } from '@mui/material'
import green from '@mui/material/colors/green'
import red from '@mui/material/colors/red'
import React from 'react'

interface ProgressButtonProps extends ButtonProps {
    success?: boolean
    error?: boolean
    loading?: boolean
}

export const ProgressButton = ({
    success,
    loading,
    error,
    onClick,
    children,
    ...props
}: ProgressButtonProps) => {
    const buttonSx = {
        ...(success && {
            bgcolor: green[500],
            '&:hover': {
                bgcolor: green[700],
            },
        }),
        ...(error && {
            bgcolor: red[500],
            '&:hover': {
                bgcolor: red[700],
            },
        }),
    }

    return (
        <Box sx={{ my: 1, position: 'relative' }}>
            <Button
                variant="contained"
                sx={buttonSx}
                disabled={loading}
                onClick={onClick}
                fullWidth
                {...props}
            >
                {children}
            </Button>
            {loading && (
                <CircularProgress
                    size={24}
                    sx={{
                        color: green[500],
                        position: 'absolute',
                        top: '50%',
                        left: '50%',
                        marginTop: '-12px',
                        marginLeft: '-12px',
                    }}
                />
            )}
        </Box>
    )
}
