import React, {useEffect} from 'react'
import {Page} from '../../core/Page'
import {DetailViewComponent,} from '../../core/framework/DetailView'
import {RecordForm} from '../RecordForm'
import {useGetRecordQuery, useUpdateRecordMutation} from '../../app/api'
import {useNavigate, useParams} from 'react-router-dom'
import {RecordType} from "../../app/types";
import {QueryProvider} from "../../core/framework/QueryProvider";

const RecordUpdateView = ({object}: DetailViewComponent<RecordType>) => {
    const [updateRecord, queryState] = useUpdateRecordMutation()
    const navigate = useNavigate()

    useEffect(() => {
        if (queryState.isSuccess) navigate(-1)
    }, [queryState.isSuccess])

    const onSubmit = (payload: Partial<RecordType>) => {
        updateRecord({
            id: object.id,
            ...payload,
        })
    }

    return (
        <Page title={`${object.subject} bearbeiten`} back>
            <RecordForm onSubmit={onSubmit} initial={object} {...queryState} />
        </Page>
    )
}

export default () => {
    const params = useParams()
    const {data, ...hookResult} = useGetRecordQuery(params.id ? parseInt(params.id) : -1)

    return (
        <QueryProvider {...hookResult}>
            <RecordUpdateView object={data}/>
        </QueryProvider>
    )
}