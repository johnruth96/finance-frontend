import {GridRowId, GridToolbar} from '@mui/x-data-grid-premium'
import React, {useState} from 'react'
import {GridRowSelectionModel} from '@mui/x-data-grid/models/gridRowSelectionModel'
import {Button} from '@mui/material'
import {SyncAlt} from '@mui/icons-material'
import {TransactionGrid} from './TransactionGrid'
import {getDetailPanelContent} from './TransactionGridDetailPanel'
import {TransactionState} from './types'
import {Page} from "../core/Page";

export const TransactionListView = ({}) => {
    // TODO: Implement
    // const [counterBooking, {}] = useCounterBookingTransactionMutation()
    const counterBooking = (rowSelectionModel: number[]) => {

    }

    const [rowSelectionModel, setRowSelectionModel] = useState<
        readonly GridRowId[]
    >([])

    const onRowSelectionModelChange = (
        rowSelectionModel: GridRowSelectionModel
    ) => {
        setRowSelectionModel(rowSelectionModel)
    }

    const handleCounterBooking = () => {
        counterBooking(rowSelectionModel as number[])
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

            <TransactionGrid
                checkboxSelection
                rowSelection
                pagination
                initialState={{
                    density: 'compact',
                    pagination: {
                        paginationModel: {
                            pageSize: 50,
                        },
                    },
                    columns: {
                        columnVisibilityModel: {
                            is_highlighted: false,
                            is_duplicate: false,
                        },
                    },
                    filter: {
                        filterModel: {
                            items: [
                                {
                                    field: 'state',
                                    operator: 'is',
                                    value: TransactionState.NEW,
                                },
                                {
                                    field: 'is_duplicate',
                                    operator: 'is',
                                    value: false,
                                },
                            ],
                        },
                    },
                }}
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
