import React, {useState} from 'react'
import {Box, Button, IconButton, Modal, SxProps} from '@mui/material'
import {GridRowSelectionModel} from "@mui/x-data-grid/models/gridRowSelectionModel";
import {useLinkTransactionToRecordMutation} from "../app/api";
import AddCircleIcon from '@mui/icons-material/AddCircle';
import {RecordType} from "../app/types";
import {ServerTransactionGrid} from "../transactions/ServerTransactionGrid";

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
    const [linkTransaction, {}] = useLinkTransactionToRecordMutation()

    const [selectionModel, setSelectionModel] = useState<GridRowSelectionModel>([])

    const [open, setOpen] = useState(false)
    const handleOpen = () => setOpen(true)
    const handleClose = () => setOpen(false)

    const handleSubmit = () => {
        linkTransaction({
            record: record.id,
            transaction: selectionModel[0] as number,
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
                        <ServerTransactionGrid
                            disableMultipleRowSelection
                            rowSelectionModel={selectionModel}
                            onRowSelectionModelChange={handleRowSelectionModelChange}
                            density={'compact'}
                            headerFilters
                            headerFilterHeight={75}
                            initialState={{
                                columns: {
                                    columnVisibilityModel: {
                                        id: false,
                                        is_highlighted: false,
                                        is_duplicate: false,
                                        is_ignored: false,
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
                                                field: "record_count",
                                                operator: "=",
                                                value: 0,
                                            }
                                        ]
                                    }
                                },
                                sorting: {
                                    sortModel: [
                                        {
                                            field: "booking_date",
                                            sort: "desc",
                                        }
                                    ]
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
                            Hinzufügen
                        </Button>
                    </Box>
                </Box>
            </Modal>
        </React.Fragment>
    )
}