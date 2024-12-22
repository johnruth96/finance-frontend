import { useGetCategorysQuery } from './app/api'
import React from 'react'
import CircleIcon from '@mui/icons-material/Circle'
import {Category} from "./app/types";

type CategoryCircleProps =
    | { color: string }
    | { id: number }
    | { category: Category }

export const CategoryCircle = ({
    id,
    category,
    color,
}: CategoryCircleProps) => {
    if (color !== undefined) {
        return <CircleIcon sx={{ color }} />
    } else if (id !== undefined) {
        const { category } = useGetCategorysQuery(undefined, {
            selectFromResult: ({ data }) => ({
                category: data?.find((obj) => obj.id === id),
            }),
        })

        if (category) {
            return <CategoryCircle category={category} />
        } else {
            return <CategoryCircle color={'#cccccc'} />
        }
    } else {
        return <CategoryCircle color={category.color} />
    }
}
