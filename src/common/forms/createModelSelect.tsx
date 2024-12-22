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

export const ModelCheckboxGroup = <T extends { id: number; name: string }>({
    objects,
    value,
    onChange,
    toggleAll,
    ...props
}: ModelMultiSelectProps<T>) => {
    const isChecked = (obj: T) => value.includes(obj.id.toString())
    const onClick = (obj: T) => {
        if (isChecked(obj))
            onChange(value.filter((v) => v !== obj.id.toString()))
        else onChange([...value, obj.id.toString()])
    }

    const areAllChecked = () => objects.every(isChecked)
    const onToggleClick = () => {
        onChange(areAllChecked() ? [] : objects.map((obj) => obj.id.toString()))
    }

    return (
        <FormGroup>
            {toggleAll && (
                <FormControlLabel
                    control={
                        <Checkbox
                            checked={areAllChecked()}
                            onChange={onToggleClick}
                        />
                    }
                    label={'Alle'}
                />
            )}

            {objects.map((obj) => (
                <FormControlLabel
                    key={obj.id}
                    control={
                        <Checkbox
                            checked={isChecked(obj)}
                            onChange={() => onClick(obj)}
                        />
                    }
                    label={obj.name}
                />
            ))}
        </FormGroup>
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
