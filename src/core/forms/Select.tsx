import React from 'react'
import {TextFieldProps} from '@mui/material/TextField/TextField'
import TextField from "@mui/material/TextField";
import {ListSubheader, MenuItem} from "@mui/material";

export type SelectProps<T extends { id: number; name: string }> =
    Omit<TextFieldProps, 'value' | "onChange" | "error">
    & {
    objects: T[] | Array<{ label: string, items: T[] }>
    value: string
    onChange: (value: string) => void
    allowEmpty?: boolean
    error?: string[]
}


export const Select = <T extends { id: number; name: string }>({
                                                                   objects,
                                                                   onChange,
                                                                   //allowEmpty, TODO:
                                                                   error,
                                                                   ...props
                                                               }: SelectProps<T>) => {
    const helperText = error ? error.join(", ") : ""
    const handleChange: TextFieldProps["onChange"] = (evt) => onChange(evt.target.value)

    return (
        <TextField
            select={true}
            onChange={handleChange}
            helperText={helperText}
            error={!!error}
            {...props}
        >
            <MenuItem value="" sx={{fontStyle: "italic"}} divider>leer</MenuItem>

            {objects.map((obj) => {
                if ("items" in obj) {
                    // Groups
                    return [
                        <ListSubheader color={"primary"}>{obj.label}</ListSubheader>,
                        ...obj.items.map((item, idx) =>
                            <MenuItem value={item.id} key={item.id} divider={idx === obj.items.length - 1}>
                                {item.name}
                            </MenuItem>
                        )
                    ]
                } else {
                    // Single items
                    return (
                        <MenuItem value={obj.id} key={obj.id}>
                            {obj.name}
                        </MenuItem>
                    )
                }
            })}
        </TextField>
    )
}

