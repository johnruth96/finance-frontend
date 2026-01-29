import React, {useMemo} from 'react'
import {useGetCategoriesQuery} from "../app/api";
import {
    Box,
    FormControl,
    FormControlProps,
    InputLabel,
    MenuItem,
    Select,
    SelectChangeEvent,
    Theme,
    useTheme
} from "@mui/material";
import {Category} from "../app/types";
import {getCategoryOptions} from "./category";
import {CategoryCircle} from "./CategoryCircle";
import {CategoryChipContainer} from "./CategoryChip";

interface CategorySelectMultipleProps extends Omit<FormControlProps, "onChange"> {
    value: number[]
    onChange: (value: number[]) => void
    label?: string
}

function getStyles(category: Category, value: readonly number[], theme: Theme) {
    return {
        fontWeight: value.includes(category.id)
            ? theme.typography.fontWeightMedium
            : theme.typography.fontWeightRegular,
    };
}

export const CategorySelectMultiple = ({value, onChange, label, ...props}: CategorySelectMultipleProps) => {
    const {data} = useGetCategoriesQuery()
    const theme = useTheme()

    const handleChange = (evt: SelectChangeEvent<typeof value>) => {
        onChange(typeof evt.target.value === 'string' ?
            evt.target.value.split(',').map(id => parseInt(id)) :
            evt.target.value
        )
    }

    // Hack
    const categories = useMemo(() => {
        const groups = getCategoryOptions(data ?? [])
        const categories: Category[] = []
        groups.forEach(group => {
            categories.push(...group.items.map(cat => ({
                ...cat,
                name: `${group.label} > ${cat.name}`,
            })))
        })
        return categories
    }, [data])

    return (
        <FormControl {...props}>
            <InputLabel>{label}</InputLabel>
            <Select
                multiple
                value={value}
                onChange={handleChange}
                renderValue={(selected: number[]) => (
                    <Box sx={{display: 'flex', flexWrap: 'wrap', gap: 0.5}}>
                        {selected.map((tagId) => (
                            <CategoryChipContainer key={tagId} id={tagId}/>
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
                        <CategoryCircle color={category.color}/> {category.name}
                    </MenuItem>
                ))}
            </Select>
        </FormControl>
    )
}