import {useGetSubjectCategoryPairsQuery} from '../../app/api'
import React, {useMemo} from 'react'
import {Autocomplete, IconButton} from '@mui/material'
import TextField from '@mui/material/TextField'
import {AutocompleteProps} from '@mui/material/Autocomplete/Autocomplete'
import CancelRoundedIcon from '@mui/icons-material/CancelRounded'

type SubjectDataType = [string, number, number | null]

export type SubjectType = {
    subject: string
    categoryId: number
    contractId: number | null
    tagIds: number[]
}

interface SubjectInputProps
    extends Omit<AutocompleteProps<SubjectType, false, false, true>,
        'onChange' | 'options' | 'renderInput' | 'isOptionEqualToValue'> {
    onChange: (value: string | SubjectType) => void
    error?: string[]
}

// FIN-1: Add tag suggestion
export const SubjectInput = ({value, onChange, error, ...props}: SubjectInputProps) => {
    const {data, isFetching} = useGetSubjectCategoryPairsQuery()

    const options = useMemo(() => {
        const optionsBySubject: Record<string, SubjectType> = {}

        if (data) {
            data.forEach((item: SubjectDataType) => {
                const [subject, categoryId, contractId] = item

                if (optionsBySubject[subject] === undefined) {
                    optionsBySubject[subject] = {
                        subject: subject,
                        categoryId: categoryId,
                        contractId: contractId,
                        tagIds: [],
                    }
                }
            })
        }

        return Object.values(optionsBySubject)
    }, [data])

    const handleInputChange = (
        event: React.SyntheticEvent,
        value: string,
        reason: string,
    ) => {
        if (reason === 'input') onChange(value)
    }

    const handleChange = (
        event: React.SyntheticEvent,
        value: SubjectType,
        reason: string,
        details?: string,
    ) => {
        if (reason === 'selectOption') onChange(value)
        else if (reason === 'clear') onChange('')
    }

    return (
        <Autocomplete
            options={options}
            inputValue={value}
            renderInput={(params) => (
                <TextField
                    label="Betreff"
                    required
                    error={!!error}
                    helperText={error ? error.join(", ") : ""}
                    {...params}
                />
            )}
            getOptionLabel={(option: SubjectType | string) =>
                typeof option === 'string' ? option : option.subject
            }
            loading={isFetching}
            autoComplete={true}
            autoHighlight={true}
            isOptionEqualToValue={(option, value) => option.subject === value}
            freeSolo={true}
            onChange={handleChange}
            onInputChange={handleInputChange}
            InputProps={{
                endAdornment: (
                    <IconButton onClick={() => onChange('')}>
                        <CancelRoundedIcon/>
                    </IconButton>
                ),
            }}
            {...props}
        />
    )
}