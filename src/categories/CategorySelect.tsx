import {Select, SelectProps,} from '../core/forms/Select'
import React, {useMemo} from 'react'
import {getCategoryOptions} from './category'
import {Category} from "../app/types";
import {useGetCategoriesQuery} from "../app/api";

export const CategorySelect = ({...props}: Omit<SelectProps<Category>, 'objects'>) => {
    const {data} = useGetCategoriesQuery()

    const categories = useMemo(
        () => data ? getCategoryOptions(data) : [],
        [data]
    )

    return (
        <Select
            objects={categories}
            {...props}
        />
    )
}