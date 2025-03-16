import React from 'react'
import {TextFieldProps} from '@mui/material/TextField/TextField'
import TextField from "@mui/material/TextField";
import {MenuItem} from "@mui/material";

export type ModelSelectProps<T> = Omit<TextFieldProps, 'value' | "onChange" | "error"> & {
    objects: T[]
    value: string
    onChange: (value: string) => void
    allowEmpty?: boolean
    error?: string[]
}


export const ModelSelect = <T extends { id: number; name: string }>({
                                                                        objects,
                                                                        onChange,
                                                                        //allowEmpty, TODO:
                                                                        error,
                                                                        ...props
                                                                    }: ModelSelectProps<T>) => {
    const helperText = error ? error.join(", ") : ""

    return (
        <TextField
            select={true}
            onChange={(evt) => onChange(evt.target.value)}
            helperText={helperText}
            error={!!error}
            {...props}
        >
            <MenuItem value="">---</MenuItem>

            {objects.map((obj) => (
                <MenuItem value={obj.id} key={obj.id}>
                    {obj.name}
                </MenuItem>
            ))}
        </TextField>
    )
}

