import {
    createModelSelect,
    ModelSelect,
    ModelSelectProps,
} from './createModelSelect'
import React, { useEffect } from 'react'
import {Account} from "../../app/types";

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
