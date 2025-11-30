import React, {useMemo} from 'react'
import {useGetCategoriesQuery} from "../app/api";
import {Box, Chip, FormControl, InputLabel, MenuItem, Select, SelectChangeEvent, Theme, useTheme} from "@mui/material";
import {Category} from "../app/types";
import {getCategoryOptions} from "./category";

interface CategorySelectMultipleProps {
    value: string[]
    onChange: (value: string[]) => void
    label: string
}

function getStyles(category: Category, value: readonly string[], theme: Theme) {
    return {
        fontWeight: value.includes(category.id)
            ? theme.typography.fontWeightMedium
            : theme.typography.fontWeightRegular,
    };
}

export const CategorySelectMultiple = ({value, onChange, label}: CategorySelectMultipleProps) => {
    const {data} = useGetCategoriesQuery()
    const theme = useTheme()

    const handleChange = (evt: SelectChangeEvent<typeof value>) => {
        onChange(typeof evt.target.value === 'string' ? evt.target.value.split(',') : evt.target.value)
    }

    // Hack
    const categories = useMemo(()=>{
        const groups = getCategoryOptions(data ?? [])
        const categories:Category[] = []
        groups.forEach(group => {
            categories.push(...group.items.map(cat => ({
                ...cat,
                name: `${group.label} > ${cat.name}`,
            })))
        })
        return categories
    }, [data])

    return (
        <FormControl>
            <InputLabel>{label}</InputLabel>
            <Select
                multiple
                value={value}
                onChange={handleChange}
                renderValue={(selected: number[]) => (
                    <Box sx={{display: 'flex', flexWrap: 'wrap', gap: 0.5}}>
                        {selected.map((tagId) => (
                            <Chip key={tagId} label={(data ?? []).find(cat => cat.id === tagId)?.name}/>
                        ))}
                    </Box>
                )}
            >
                {categories.map((category) => (
                    <MenuItem
                        key={category.id}
                        value={category.id}
                        style={getStyles(category, value, theme)}
                    >
                        {category.name}
                    </MenuItem>
                ))}
            </Select>
        </FormControl>
    )
}