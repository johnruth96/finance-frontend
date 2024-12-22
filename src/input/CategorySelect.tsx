import {
    createModelSelect,
    ModelSelectProps,
} from '../common/forms/createModelSelect'
import { Category } from '../finance/app/types'
import React, { useMemo } from 'react'
import { MenuItem, TextField } from '@mui/material'
import { getCategorySubTree } from '../category'

export type CategorySelectProps = ModelSelectProps<Category> & {
    disableMain?: boolean
}

export const CategorySelectComponent = ({
    objects,
    value,
    onChange,
    allowEmpty,
    disableMain,
    label,
    ...props
}: CategorySelectProps) => {
    const categories = useMemo(() => {
        const categories: Category[] = []
        const mainCategories = objects.filter((obj) => obj.parent === null)
        mainCategories.forEach((root) => {
            const subTree = getCategorySubTree(root, objects)
            categories.push(...subTree)
        })
        return categories
    }, [objects])

    return (
        <TextField
            label={label}
            select
            value={value}
            onChange={(evt) => onChange(evt.target.value)}
            {...props}
        >
            {(value === '' || allowEmpty) && (
                <MenuItem value={''}>---</MenuItem>
            )}

            {categories.map((category) => {
                const isRoot = category.parent === null
                const hasChildren = categories.some(
                    (child) => child.parent === category.id,
                )
                const isChild = !isRoot

                return (
                    <MenuItem
                        disabled={disableMain && isRoot && hasChildren}
                        value={category.id}
                        key={category.id}
                        style={isChild ? { paddingLeft: '3rem' } : {}}
                    >
                        {category.name}
                    </MenuItem>
                )
            })}
        </TextField>
    )
}

export const CategorySelect = createModelSelect<Category>(
    'Category',
    CategorySelectComponent,
)
