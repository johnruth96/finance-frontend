import React from 'react'
import {Page} from "../../core/Page";
import {RecordDetailView} from "./RecordDetailView";
import {useParams} from "react-router-dom";
import {useGetRecordQuery} from "../../app/api";
import {QueryProvider} from "../../core/QueryProvider";


export const RecordDetailPage = ({}) => {
    const params = useParams()
    const {data, ...hookResult} = useGetRecordQuery(params.id ? parseInt(params.id) : -1)

    return (
        <QueryProvider {...hookResult}>
            <Page title={data?.subject}>
                <RecordDetailView object={data}/>
            </Page>
        </QueryProvider>
    )
}
