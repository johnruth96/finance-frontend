import React from 'react'
import {Page} from "../core/Page";
import {GridFilterModel} from "@mui/x-data-grid";
import dayjs from "dayjs";
import {RecordGrid} from "../records/RecordGrid/RecordGrid";

export const LatestRecordListView = ({}) => {
    const filterModel: GridFilterModel = {
        items: [
            {
                field: 'date_created',
                operator: 'onOrAfter',
                value: dayjs.utc().subtract(1, 'hour').toDate(),
            },
            {
                field: 'transaction_count',
                operator: '>',
                value: 0,
            },
        ],
    }

    return (
        <Page title={'Zuletzt Erstellt'}>
            <RecordGrid initialState={{
                filter: {
                    filterModel,
                },
            }}/>
        </Page>
    )
}
