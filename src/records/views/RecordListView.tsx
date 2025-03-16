import React from 'react'
import {Page} from '../../core/Page'
import {ServerRecordGrid} from "../RecordGrid/ServerRecordGrid";
import {MemoServerRecordGrid} from "../RecordGrid/MemoServerRecordGrid";

export default ({}) => {
    return (
        <Page title={'Buchungen'}>
            <MemoServerRecordGrid/>
        </Page>
    )
}
