import {useGetCategoriesQuery} from '../app/api'
import React from 'react'
import {CategoryCircle} from './CategoryCircle'
import {Skeleton, Typography} from '@mui/material'
import {TypographyOwnProps} from "@mui/material/Typography/Typography";

interface CategoryDisplayProps extends TypographyOwnProps {
    name: string
    color: string
}

export const CategoryDisplay = ({name, color, ...props}: CategoryDisplayProps) => {
    return (
        <Typography {...props}>
            <CategoryCircle color={color}/> {name}
        </Typography>
    )
}

interface CategoryDisplayContainerProps extends TypographyOwnProps {
    id: number
}

export const CategoryDisplayContainer = ({id, ...props}: CategoryDisplayContainerProps) => {
    const {category} = useGetCategoriesQuery(undefined, {
        selectFromResult: ({data}) => ({
            category: data?.find((obj) => obj.id === id),
        }),
    })

    if (category) {
        return (
            <CategoryDisplay
                color={category.color}
                name={category.name}
                {...props}
            />
        )
    } else {
        return <Skeleton variant={'text'}/>
    }
}
