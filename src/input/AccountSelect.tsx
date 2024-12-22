import {
    createModelSelect,
    ModelSelect,
    ModelSelectProps,
} from '../common/forms/createModelSelect'
import { Account } from '../finance/app/types'
import React, { useEffect } from 'react'

export const AccountSelectComponent = ({
    ...props
}: ModelSelectProps<Account>) => {
    useEffect(() => {
        if (
            !props.allowEmpty &&
            props.value === '' &&
            props.objects.length > 0
        ) {
            props.onChange(props.objects[0].id.toString())
        }
    }, [props.value, props.objects, props.allowEmpty])

    return <ModelSelect {...props} />
}
export const AccountSelect = createModelSelect<Account>(
    'Account',
    AccountSelectComponent,
)
