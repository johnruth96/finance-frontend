import React, { useEffect } from 'react'
import { Page } from '../../core/Page'
import { useCreateContractMutation } from '../../app/api'
import { ContractForm } from '../ContractForm'
import { useNavigate } from 'react-router-dom'

export default () => {
    const [createContract, queryState] = useCreateContractMutation()

    // Navigation after success
    const navigate = useNavigate()
    useEffect(() => {
        if (queryState.isSuccess) {
            navigate(`/contracts/${queryState.data.id}/`)
        }
    }, [queryState.isSuccess, queryState.data])

    return (
        <Page title={'Vertrag anlegen'}>
            <ContractForm
                onSubmit={createContract}
                buttonCaption={'Erstellen'}
                {...queryState}
            />
        </Page>
    )
}
