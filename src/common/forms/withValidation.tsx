import React from 'react'
import { FormFeedback, InputProps } from 'reactstrap'
import { formatError } from '../ApiError'
import { APIError } from '../../app/types'

interface FormControlProps extends Omit<InputProps, 'onChange' | 'value'> {
    value: any | boolean | number[]
    onChange: (x: string) => void
}

export interface ValidationProps extends FormControlProps {
    isError: boolean
    error?: APIError
}

export const withValidation = (
    InputComponent: React.ComponentType<FormControlProps>,
) => {
    return React.forwardRef<HTMLElement, ValidationProps>(
        ({ isError, error, ...props }, ref) => {
            const invalid = Boolean(isError && error) || props.invalid
            return (
                <>
                    <InputComponent invalid={invalid} ref={ref} {...props} />
                    {invalid && error && (
                        <FormFeedback className={'is-invalid d-block'}>
                            {formatError(error)}
                        </FormFeedback>
                    )}
                </>
            )
        },
    )
}
