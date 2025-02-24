import React from "react";
import {Page} from "../../core/Page";
import {useCreateRecordMutation} from "../../app/api";
import {RecordForm} from "../RecordForm";


export const RecordCreateView = () => {
    const [createRecord, queryState] = useCreateRecordMutation()

    return (
        <Page title={"Buchung anlegen"} back>
            <RecordForm onSubmit={createRecord} {...queryState} buttonCaption={"Anlegen"}/>
        </Page>
    )
}