import {GridRowId, GridToolbar} from '@mui/x-data-grid-premium'
import React, {useState} from 'react'
import {GridRowSelectionModel} from '@mui/x-data-grid/models/gridRowSelectionModel'
import {Button} from '@mui/material'
import {SyncAlt} from '@mui/icons-material'
import {getDetailPanelContent} from '../TransactionGridDetailPanel'
import {Page} from "../../core/Page";
import {useCounterBookingTransactionMutation} from "../../app/api";
import {TransactionMemoGrid} from "../TransactionMemoGrid";
import {enqueueSnackbar} from "notistack";

export const TransactionListView = ({}) => {
    const [counterBooking, {}] = useCounterBookingTransactionMutation()

    const [rowSelectionModel, setRowSelectionModel] = useState<readonly GridRowId[]>([])

    const onRowSelectionModelChange = (
        rowSelectionModel: GridRowSelectionModel
    ) => {
        setRowSelectionModel(rowSelectionModel)
    }

    const handleCounterBooking = () => {
        counterBooking(rowSelectionModel as number[]).unwrap().catch((err: any) => {
            enqueueSnackbar(JSON.stringify(err), {variant: "error"})
            console.error(err)
        })
    }

    return (
        <Page title={"Transaktionen"}>
            <Button
                onClick={handleCounterBooking}
                disabled={rowSelectionModel.length === 0}
                sx={{pb: 2}}
            >
                <SyncAlt/> Gegenbuchung
            </Button>

            <TransactionMemoGrid
                checkboxSelection
                rowSelection
                initialState={{
                    density: 'compact',
                    pagination: {
                        paginationModel: {
                            pageSize: 25,
                            page: 0,
                        },
                    },
                    columns: {
                        columnVisibilityModel: {
                            id: false,
                            is_highlighted: false,
                            is_duplicate: false,
                            is_ignored: false,
                            record_count: false,
                        },
                    },
                    filter: {
                        filterModel: {
                            items: [
                                {
                                    field: "record_count",
                                    operator: "=",
                                    value: 0,
                                },
                                {
                                    field: 'is_duplicate',
                                    operator: 'is',
                                    value: "false",
                                },
                            ],
                        },
                    },
                }}
                // @ts-ignore
                rowSelectionModel={rowSelectionModel}
                onRowSelectionModelChange={onRowSelectionModelChange}
                slots={{
                    toolbar: GridToolbar,
                }}
                getDetailPanelContent={getDetailPanelContent}
                getDetailPanelHeight={() => 'auto'}
            />
        </Page>
    )
}
