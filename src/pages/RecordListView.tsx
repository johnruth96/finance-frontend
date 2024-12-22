import React from 'react'
import {Page} from '../common/shared/Page'
import dayjs from 'dayjs'
import {RecordGridView} from '../views/RecordGrid'
import {GridFilterModel} from '@mui/x-data-grid'

export default ({}) => {
    const initialFilterModel: GridFilterModel = {
        items: [
            {
                field: 'date',
                operator: 'onOrAfter',
                value: dayjs.utc().startOf('month').toDate(),
            },
            {
                field: 'date',
                operator: 'onOrBefore',
                value: dayjs.utc().endOf('month').toDate(),
            },
        ],
    }

    return (
        <Page title={'Buchungen'}>
            <RecordGridView filterModel={initialFilterModel}/>
        </Page>
    )
}
