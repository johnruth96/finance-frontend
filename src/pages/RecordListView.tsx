import React from 'react'
import { Page } from '../common/shared/Page'
import UploadIcon from '@mui/icons-material/Upload'
import dayjs from 'dayjs'
import { RecordGridView } from '../views/RecordGrid'
import { GridFilterModel } from '@mui/x-data-grid'

export default ({}) => {
    const menu = [
        { icon: <UploadIcon />, label: 'Importieren', to: '/records/bulk/' },
    ]

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
        <Page title={'Buchungen'} menu={menu}>
            <RecordGridView filterModel={initialFilterModel} />
        </Page>
    )
}
