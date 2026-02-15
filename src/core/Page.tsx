import {Box, SxProps, Typography,} from '@mui/material'
import React, {PropsWithChildren, ReactNode, useEffect} from 'react'
import {isString} from 'lodash'

interface PageProps extends PropsWithChildren {
    title?: ReactNode
    pageTitle?: string
    sx?: SxProps
}


export const Page = ({
                         title = '',
                         pageTitle,
                         children,
                         ...props
                     }: PageProps) => {
    useEffect(() => {
        if (isString(title)) document.title = title
        else if (pageTitle) document.title = pageTitle
    }, [title, pageTitle])

    return (
        <Box sx={{pb: 3}}>
            <Box sx={{display: "flex", justifyContent: "space-between", mb: 3}}>
                {isString(title) ? (
                    <Typography variant="h2">{title}</Typography>
                ) : (
                    title
                )}
            </Box>

            <Box {...props}>
                {children}
            </Box>
        </Box>
    )
}
