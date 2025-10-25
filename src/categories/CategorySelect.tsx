import {Select, SelectProps,} from '../core/forms/Select'
import React, {useMemo} from 'react'
import {getCategorySubTree} from './category'
import {Category} from "../app/types";
import {useGetCategoriesQuery} from "../app/api";

export const getCategoryOptions = (categories: Category[]) => {
    const groups: Array<{ items: Category[], label: string }> = []
    const mainCategories = categories.filter((obj) => obj.parent === null)

    mainCategories.forEach((root) => {
        const subTree = getCategorySubTree(root, categories)
        groups.push({
            label: root.name,
            items: subTree.slice(1),
        })
    })

    return groups
}

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