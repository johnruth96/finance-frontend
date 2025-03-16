import React, {useEffect} from 'react'
import {Page} from '../../core/Page'
import {ContractForm} from '../ContractForm'
import {useGetContractQuery, useUpdateContractMutation} from '../../app/api'
import {useNavigate, useParams} from 'react-router-dom'
import {Contract} from "../../app/types";
import {QueryProvider} from "../../core/QueryProvider";

interface ContractUpdateViewProps {
    object: Contract
}

const ContractUpdateView = ({object}: ContractUpdateViewProps) => {
    const [updateContract, {isError, isLoading, isSuccess, error}] = useUpdateContractMutation()
    const navigate = useNavigate()

    useEffect(() => {
        if (isSuccess) navigate(-1)
    }, [isSuccess])

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
                isError={isError}
                isLoading={isLoading}
                isSuccess={isSuccess}
                error={error}
            />
        </Page>
    )
}

export default () => {
    const params = useParams()
    const {data, ...hookResult} = useGetContractQuery(params.id ? parseInt(params.id) : -1)

    return <QueryProvider {...hookResult}>
        <ContractUpdateView object={data as Contract}/>
    </QueryProvider>
}