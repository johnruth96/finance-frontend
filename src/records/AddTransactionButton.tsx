import React, {useState} from 'react'
import {Box, Button, IconButton, Modal, SxProps} from '@mui/material'
import {GridRowSelectionModel} from "@mui/x-data-grid/models/gridRowSelectionModel";
import {TransactionGrid} from "../transactions/TransactionGrid";
import {useGetTransactionsQuery, useUpdateRecordMutation} from "../app/api";
import {TransactionState} from "../transactions/types";
import AddCircleIcon from '@mui/icons-material/AddCircle';
import {RecordType} from "../app/types";

const style: SxProps = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: '95vw',
    height: '95vh',
    bgcolor: 'background.paper',
    border: '2px solid #000',
    boxShadow: 24,
    display: 'flex',
    flexDirection: 'column',
}

const bodyStyle: SxProps = {
    p: 4,
    overflow: 'scroll',
}

const footerStyle: SxProps = {
    px: 4,
    pb: 4,
    bgcolor: 'background.paper',
    textAlign: 'end',
}

interface AddTransactionButtonProps {
    record: Pick<RecordType, 'id' | 'transactions'>
}

export const AddTransactionButton = ({record}: AddTransactionButtonProps) => {
    const {data} = useGetTransactionsQuery()
    const [updateRecord, {}] = useUpdateRecordMutation()

    const [selectionModel, setSelectionModel] = useState<GridRowSelectionModel>([])

    const [open, setOpen] = useState(false)
    const handleOpen = () => setOpen(true)
    const handleClose = () => setOpen(false)

    const handleSubmit = () => {
        updateRecord({
            id: record.id,
            transactions: [...record.transactions, ...selectionModel] as number[],
        }).unwrap().then(() => {
            handleClose()
        })
    }

    const handleRowSelectionModelChange = (rowSelectionModel: GridRowSelectionModel) => {
        // @ts-ignore
        setSelectionModel(rowSelectionModel)
    }

    return (
        <React.Fragment>
            <IconButton onClick={handleOpen}><AddCircleIcon/></IconButton>

            <Modal open={open} onClose={handleClose}>
                <Box sx={style}>
                    <Box sx={bodyStyle}>
                        <TransactionGrid
                            transactions={data ?? []}
                            rowSelectionModel={selectionModel}
                            onRowSelectionModelChange={handleRowSelectionModelChange}
                            density={'compact'}
                            pagination
                            headerFilters
                            headerFilterHeight={75}
                            initialState={{
                                columns: {
                                    columnVisibilityModel: {
                                        is_highlighted: false,
                                        is_duplicate: false,
                                        actions: false,
                                    }
                                },
                                pagination: {
                                    paginationModel: {
                                        pageSize: 10,
                                    }
                                },
                                filter: {
                                    filterModel: {
                                        items: [
                                            {
                                                field: "state",
                                                operator: "is",
                                                value: TransactionState.NEW,
                                            }
                                        ]
                                    }
                                }
                            }}
                        />
                    </Box>

                    <Box sx={footerStyle}>
                        <Button onClick={handleClose}>Abbrechen</Button>
                        <Button
                            onClick={handleSubmit}
                            sx={{mr: 1}}
                            variant={'contained'}
                            disabled={selectionModel.length === 0}
                        >
                            {selectionModel.length} Hinzufügen
                        </Button>
                    </Box>
                </Box>
            </Modal>
        </React.Fragment>
    )
}