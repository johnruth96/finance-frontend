import {GridRowId, GridToolbar} from '@mui/x-data-grid-premium'
import React, {useState} from 'react'
import {GridRowSelectionModel} from '@mui/x-data-grid/models/gridRowSelectionModel'
import {Alert, Button} from '@mui/material'
import {SyncAlt} from '@mui/icons-material'
import {TransactionGrid} from './TransactionGrid'
import {getDetailPanelContent} from './TransactionGridDetailPanel'
import {TransactionState} from './types'
import {Page} from "../core/Page";
import {useCounterBookingTransactionMutation, useGetTransactionsQuery} from "../app/api";

export const TransactionListView = ({}) => {
    const {data, isError, error, isLoading} = useGetTransactionsQuery()
    const [counterBooking, {}] = useCounterBookingTransactionMutation()

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

            {isError && <Alert severity={"error"} sx={{mb: 3}}>{JSON.stringify(error)}</Alert>}

            {isLoading && <Alert severity={"info"} sx={{mb: 3}}>Laden ...</Alert>}

            <TransactionGrid
                transactions={data ?? []}
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
                            id: false,
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
