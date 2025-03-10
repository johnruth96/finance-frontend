import React from 'react'
import {useGetRecordsQuery} from "../../app/api";
import {RecordGrid, RecordGridProps} from "./RecordGrid";

export const AllRecordGrid = ({loading, ...props}: RecordGridProps) => {
    const {data, isLoading} = useGetRecordsQuery()

    return (
        <RecordGrid records={data} loading={isLoading || loading} {...props}/>
    )
}
