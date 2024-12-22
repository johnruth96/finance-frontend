import { useGetCategorysQuery } from './app/api'
import React from 'react'
import { CategoryCircle } from './CategoryCircle'
import { Skeleton, Typography } from '@mui/material'

interface CategoryDisplayProps {
    name: string
    color: string
}

export const CategoryDisplay = ({
    name,
    color,
    ...props
}: CategoryDisplayProps) => {
    return (
        <Typography {...props}>
            <CategoryCircle color={color} /> {name}
        </Typography>
    )
}

type CategoryDisplayContainerProps = {
    id: number
}

export const CategoryDisplayContainer = ({
    id,
    ...props
}: CategoryDisplayContainerProps) => {
    const { category } = useGetCategorysQuery(undefined, {
        selectFromResult: ({ data }) => ({
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
        return <Skeleton variant={'text'} />
    }
}
