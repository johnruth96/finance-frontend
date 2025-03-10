import React from 'react'
import {Page} from '../../core/Page'
import {useGetRecordsQuery} from "../../app/api";
import {RecordGrid} from "../RecordGrid/RecordGrid";

export default ({}) => {
    const {data, isLoading} = useGetRecordsQuery()

    return (
        <Page title={'Buchungen'}>
            <RecordGrid records={data} loading={isLoading}/>
        </Page>
    )
}
