import React from 'react'
import {Page} from '../../core/Page'
import {MemoServerRecordGrid} from "../RecordGrid/MemoServerRecordGrid";
import {RowModel} from "../RecordGrid/RecordGrid";
import {useUpdateRecordMutation} from "../../app/api";
import dayjs from "dayjs";
import {enqueueSnackbar} from "notistack";
import {formatError} from "../../core/ApiError";
import {APIError} from "../../app/types";

export default ({}) => {
    const [updateRecord, {isLoading}] = useUpdateRecordMutation()

    const handleRowUpdate = (updatedRow: RowModel, originalRow: RowModel) => {
        const payload = {
            ...updatedRow,
            date: dayjs(updatedRow.date).format("YYYY-MM-DD"),
        }

        return new Promise<RowModel>((resolve, reject) => {
            updateRecord(payload).unwrap().then(response => {
                resolve(updatedRow)
            }).catch(error => {
                reject(error)
            })
        })
    }

    const handleProcessRowUpdateError = (error: APIError) => {
        enqueueSnackbar(formatError(error), {variant: "error"})
    }

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
                processRowUpdate={handleRowUpdate}
                onProcessRowUpdateError={handleProcessRowUpdateError}
                loading={isLoading}
            />
        </Page>
    )
}
