import React, { useState } from 'react'
import { Page } from '../../common/shared/Page'
import { useCreateRecordsMutation } from '../../finance/app/api'
import { RecordType } from '../../finance/app/types'
import { omit } from 'lodash'
import { ApiError } from '../../common/ApiError'
import { GridRowModel } from '@mui/x-data-grid/models/gridRows'
import { ProgressButton } from '../../common/shared/ProgressButton'
import { RecordInputGridView } from './RecordInputGridView'
import { UploadForm } from './UploadForm'
import { Box } from '@mui/material'
import dayjs from 'dayjs'

export const RecordBulkCreateView = () => {
    const [rows, setRows] = useState<GridRowModel<RecordType>[]>([])
    const [createRecords, creationQueryState] = useCreateRecordsMutation()

    const handleUpload = (uploadedRecords: RecordType[]) => {
        if (
            (rows.length > 0 &&
                confirm('Die Einträge gehen verloren. Importieren?')) ||
            rows.length === 0
        ) {
            setRows(uploadedRecords)
        }
    }

    const handleSubmit = () => {
        const payload = rows.map((row) => ({
            ...omit(row, ['isNew', 'id']),
            date: dayjs(row.date).format('DD.MM.YYYY'),
        }))

        createRecords(payload)
            .unwrap()
            .then(() => {
                setRows([])
            })
    }

    // TODO #23: Implement subject -> category/account prediction
    const onSubjectChange = (
        value:
            | string
            | { subject: string; category: number; contract: number | null },
    ) => {
        if (typeof value === 'string') {
            onChange(id, { subject: value })
        } else {
            onChange(id, {
                subject: value.subject,
                category: value.category,
                contract: value.contract ? value.contract : null,
            })
        }
    }

    return (
        <Page title={'Mehrere Buchungen anlegen'} back>
            <Box sx={{ mb: 3 }}>
                <UploadForm onUpload={handleUpload} />
            </Box>

            {creationQueryState.isError && (
                <ApiError error={creationQueryState.error} />
            )}

            <Box sx={{ mb: 3 }}>
                <RecordInputGridView
                    rowModel={rows}
                    onRowModelChange={setRows}
                />
            </Box>

            <ProgressButton
                onClick={handleSubmit}
                error={creationQueryState.isError}
                loading={creationQueryState.isLoading}
                success={creationQueryState.isSuccess}
            >
                Speichern
            </ProgressButton>
        </Page>
    )
}
