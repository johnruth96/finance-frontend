import React, { useEffect } from 'react'
import { Page } from '../common/shared/Page'
import { useCreateContractMutation } from '../finance/app/api'
import { ContractForm } from '../forms/ContractForm'
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
        <Page title={'Vertrag anlegen'} back>
            <ContractForm
                onSubmit={createContract}
                buttonCaption={'Erstellen'}
                {...queryState}
            />
        </Page>
    )
}
