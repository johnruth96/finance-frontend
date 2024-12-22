import React, { useEffect } from 'react'
import { Page } from '../common/shared/Page'
import {
    connectDetailViewWithRouter,
    DetailViewComponent,
} from '../common/framework/DetailView'
import { Contract } from '../finance/app/types'
import { ContractForm } from '../forms/ContractForm'
import { useUpdateContractMutation } from '../finance/app/api'
import { useNavigate } from 'react-router-dom'

const ContractUpdateView = ({ object }: DetailViewComponent<Contract>) => {
    const [updateContract, queryState] = useUpdateContractMutation()
    const navigate = useNavigate()

    useEffect(() => {
        if (queryState.isSuccess) navigate(-1)
    }, [queryState.isSuccess])

    const onSubmit = (payload: Partial<Contract>) => {
        updateContract({
            id: object.id,
            ...payload,
        })
    }

    return (
        <Page title={`${object.name} bearbeiten`} back>
            <ContractForm
                initial={object}
                onSubmit={onSubmit}
                {...queryState}
            />
        </Page>
    )
}

export default connectDetailViewWithRouter(ContractUpdateView, {
    model: 'Contract',
})
