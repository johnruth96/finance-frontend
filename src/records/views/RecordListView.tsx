import React from 'react'
import {Page} from '../../core/Page'
import {RecordGrid} from "../RecordGrid/RecordGrid";

export default ({}) => {
    return (
        <Page title={'Buchungen'}>
            <RecordGrid
                initialState={{
                    aggregation: {
                        model: {
                            amount: 'sum',
                        },
                    },
                }}
            />
        </Page>
    )
}
