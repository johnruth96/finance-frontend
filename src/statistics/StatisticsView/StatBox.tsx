import {Paper, Typography} from "@mui/material";
import React from "react";

interface StatBoxProps {
    label: string
    value: React.ReactNode
}

export const StatBox = ({label, value}: StatBoxProps) => {
    return (
        <Paper sx={{p: 3}}>
            <Typography variant={'caption'}>{label}</Typography>
            <Typography variant={'h3'}>{value}</Typography>
        </Paper>
    )
}