import { useGetSubjectCategoryPairsQuery } from '../app/api'
import React, { useMemo } from 'react'
import { withValidation } from '../common/forms/withValidation'
import { Autocomplete, IconButton } from '@mui/material'
import TextField from '@mui/material/TextField'
import { AutocompleteProps } from '@mui/material/Autocomplete/Autocomplete'
import { uniqBy } from 'lodash'
import CancelRoundedIcon from '@mui/icons-material/CancelRounded'

type SubjectDataType = [string, number, number | null]
type SubjectType = {
    subject: string
    category: number
    contract: number | null
}

interface SubjectInputProps
    extends Omit<
        AutocompleteProps<SubjectType, false, false, true>,
        'onChange' | 'options' | 'renderInput' | 'isOptionEqualToValue'
    > {
    onChange: (value: string | SubjectType) => void
}

const SubjectInput = ({ value, onChange, ...props }: SubjectInputProps) => {
    const { data, isFetching } = useGetSubjectCategoryPairsQuery()

    const options = useMemo(() => {
        if (data) {
            const dataUniq = uniqBy(data, (item: SubjectDataType) => item[0])
            return dataUniq.map(
                (item: SubjectDataType) =>
                    ({
                        subject: item[0],
                        category: item[1],
                        contract: item[2],
                    } as SubjectType),
            )
        } else {
            return []
        }
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
                <TextField {...params} label="Betreff" required />
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
                        <CancelRoundedIcon />
                    </IconButton>
                ),
            }}
            {...props}
        />
    )
}

export default withValidation(SubjectInput)
