import React, { useEffect } from 'react'
import { Page } from '../common/shared/Page'
import {
    connectDetailViewWithRouter,
    DetailViewComponent,
} from '../common/framework/DetailView'
import { RecordForm } from '../forms/RecordForm'
import { useUpdateRecordMutation } from '../app/api'
import { useNavigate } from 'react-router-dom'
import {RecordType} from "../app/types";

const RecordUpdateView = ({ object }: DetailViewComponent<RecordType>) => {
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

export default connectDetailViewWithRouter(RecordUpdateView, {
    model: 'Record',
})
