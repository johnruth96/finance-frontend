import React from 'react'
import { connectListView, ListViewComponent } from '../framework/ListView'
import { withValidation } from './withValidation'
import {
    Checkbox,
    FormControlLabel,
    FormGroup,
    MenuItem,
    TextField,
} from '@mui/material'
import { TextFieldProps } from '@mui/material/TextField/TextField'

export type ModelSelectProps<T> = ListViewComponent<T> &
    TextFieldProps & {
        value: string
        onChange: (value: string) => void
        allowEmpty?: boolean
        label?: string
    }

export type ModelMultiSelectProps<T> = ListViewComponent<T> &
    FormGroupProps & {
        value: string[]
        onChange: (value: string[]) => void
        toggleAll?: boolean
    }

export const ModelSelect = <T extends { id: number; name: string }>({
    objects,
    value,
    onChange,
    allowEmpty,
    label,
    ...props
}: ModelSelectProps<T>) => {
    return (
        <TextField
            label={label}
            value={value}
            onChange={(evt) => onChange(evt.target.value)}
            select
            {...props}
        >
            {(value === '' || allowEmpty) && (
                <MenuItem value="">
                    <em>---</em>
                </MenuItem>
            )}
            {objects.map((obj) => (
                <MenuItem value={obj.id} key={obj.id}>
                    {obj.name}
                </MenuItem>
            ))}
        </TextField>
    )
}

export const createModelSelect = <
    T extends {
        id: number
        name: string
    },
>(
    model: string,
    SelectComponent: React.ComponentType<
        ModelSelectProps<T> | ModelMultiSelectProps<T>
    >,
) => {
    return connectListView(withValidation(SelectComponent), { model })
}
