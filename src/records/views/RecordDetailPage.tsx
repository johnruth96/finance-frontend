import React from 'react'
import {Page} from "../../core/Page";
import {RecordDetailView} from "../RecordDetailView";
import {useParams} from "react-router-dom";
import {useGetRecordQuery} from "../../app/api";
import {DeleteRecordButton} from "../DeleteRecordButton";
import {RecordType} from "../../app/types";
import {QueryProvider} from "../../core/QueryProvider";


export const RecordDetailPage = ({}) => {
    const params = useParams()
    const {data, ...queryParams} = useGetRecordQuery(params.id ? parseInt(params.id) : -1)

    return (
        <QueryProvider {...queryParams}>
            <Page title={(data as RecordType).subject}>
                <RecordDetailView object={data as RecordType} sx={{mb: 3}}/>

                <DeleteRecordButton record={data as RecordType}/>
            </Page>
        </QueryProvider>
    )
}
