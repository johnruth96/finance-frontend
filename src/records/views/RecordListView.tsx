import React from 'react'
import {Page} from '../../core/Page'
import {MemoServerRecordGrid} from "../RecordGrid/MemoServerRecordGrid";

export default ({}) => {
    return (
        <Page title={'Buchungen'}>
            <MemoServerRecordGrid
                sortModel={[
                    {
                        field: "date",
                        sort: "desc",
                    }
                ]}
            />
        </Page>
    )
}
