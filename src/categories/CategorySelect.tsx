import {ModelSelect, ModelSelectProps,} from '../core/forms/ModelSelect'
import React, {useMemo} from 'react'
import {getCategorySubTree} from './category'
import {Category} from "../app/types";
import {useGetCategoriesQuery} from "../app/api";


export const CategorySelect = ({...props}: Omit<ModelSelectProps<Category>, 'objects'>) => {
    const {data} = useGetCategoriesQuery()

    const categories = useMemo(() => {
        const categories: Category[] = []

        if (data) {
            const mainCategories = data.filter((obj) => obj.parent === null)
            mainCategories.forEach((root) => {
                const subTree = getCategorySubTree(root, data)
                categories.push(...subTree.map(category => ({
                    ...category,
                    name: category.parent !== null ? `--- ${category.name}` : category.name
                })))
            })
        }

        return categories
    }, [data])

    return (
        <ModelSelect
            objects={categories}
            {...props}
        />
    )
}