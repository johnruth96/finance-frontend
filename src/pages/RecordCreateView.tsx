import React from "react";
import {Page} from "../common/shared/Page";
import {useCreateRecordMutation} from "../finance/app/api";
import {RecordForm} from "../forms/RecordForm";


export const RecordCreateView = () => {
    const [createRecord, queryState] = useCreateRecordMutation()

    return (
        <Page title={"Buchung anlegen"} back>
            <RecordForm onSubmit={createRecord} {...queryState} buttonCaption={"Anlegen"}/>
        </Page>
    )
}