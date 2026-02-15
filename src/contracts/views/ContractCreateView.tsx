import React, {useEffect} from 'react'
import {Page} from '../../core/Page'
import {useCreateContractMutation} from '../../app/api'
import {ContractForm} from '../ContractForm'
import {useNavigate} from 'react-router-dom'

export default () => {
    const [createContract, {isSuccess, isLoading, isError, error, data}] = useCreateContractMutation()

    // Navigation after success
    const navigate = useNavigate()
    useEffect(() => {
        if (isSuccess) {
            navigate(`/contracts/${data.id}/`)
        }
    }, [isSuccess, data])

    return (
        <Page title={'Vertrag erstellen'}>
            <ContractForm
                onSubmit={createContract}
                buttonCaption={'Erstellen'}
                isSuccess={isSuccess}
                isLoading={isLoading}
                isError={isError}
                error={error}
            />
        </Page>
    )
}
