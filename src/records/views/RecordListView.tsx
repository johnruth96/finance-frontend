import React from 'react'
import {Page} from '../../core/Page'
import {MemoServerRecordGrid} from "../RecordGrid/MemoServerRecordGrid";

export default ({}) => {
    return (
        <Page title={'Buchungen'}>
            <MemoServerRecordGrid
                initialState={{
                    sorting: {
                        sortModel: [
                            {
                                field: "date",
                                sort: "desc",
                            }
                        ]
                    }
                }}
            />
        </Page>
    )
}
