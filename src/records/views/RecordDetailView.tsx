import React from 'react'
import {RecordType} from "../../app/types";
import {Box, List, ListItemButton, ListItemText, Table, TableBody, TableCell, TableRow, Typography} from '@mui/material'
import {CategoryDisplayContainer} from "../../categories/CategoryDisplay";
import dayjs from "dayjs";
import {AmountDisplay} from "../../core/AmountDisplay";
import {AccountDisplay} from "../../core/AccountDisplay";
import {RowModel} from "../RecordGrid/BaseRecordGrid";
import {useNavigate} from "react-router-dom";
import {useGetContractsQuery} from "../../app/api";

interface ContractListItemButtonProps {
    id: number
}

const ContractListItemButton = ({id}: ContractListItemButtonProps) => {
    const navigate = useNavigate()
    const {contract} = useGetContractsQuery(undefined, {
        selectFromResult: ({data}) => ({
            contract: data?.find((obj) => obj.id === id),
        }),
    })

    const handleClick = () => {
        navigate(`/contracts/${id}/`)
    }

    return (
        <ListItemButton onClick={handleClick}>
            <ListItemText primary={contract?.name}/>
        </ListItemButton>
    )
}

interface RecordDetailViewProps {
    object: RecordType | RowModel
}

export const RecordDetailView = ({object}: RecordDetailViewProps) => {
    return (
        <Box>
            <Box sx={{mb: 3}}>
                <Typography variant={"caption"}>Details</Typography>
                <Table size="small">
                    <TableBody>
                        {/*<TableRow>
                            <TableCell sx={{pl: 0}}>Betreff</TableCell>
                            <TableCell>{object.subject}</TableCell>
                        </TableRow>*/}
                        <TableRow>
                            <TableCell sx={{pl: 0}}>Betrag</TableCell>
                            <TableCell>
                                <AmountDisplay value={object.amount}/>
                            </TableCell>
                        </TableRow>
                        <TableRow>
                            <TableCell sx={{pl: 0}}>Datum</TableCell>
                            <TableCell>{dayjs(object.date).format("dddd, DD.MM.YYYY")}</TableCell>
                        </TableRow>
                        <TableRow>
                            <TableCell sx={{pl: 0}}>Konto</TableCell>
                            <TableCell>
                                <AccountDisplay id={object.account} variant={"body2"}/>
                            </TableCell>
                        </TableRow>
                    </TableBody>
                </Table>
            </Box>

            <Box sx={{mb: 3}}>
                <Typography variant={"caption"}>Kategorien</Typography>
                <List>
                    <ListItemButton>
                        <ListItemText primary={<CategoryDisplayContainer id={object.category}/>}/>
                    </ListItemButton>
                </List>
            </Box>

            <Box sx={{mb: 3}}>
                <Typography variant={"caption"} component={"div"}>Verträge</Typography>
                {object.contract !== null ?
                    <List>
                        <ContractListItemButton id={object.contract}/>
                    </List> :
                    <Typography>keine</Typography>
                }
            </Box>

            <Box>
                <Typography variant={"caption"} component={"div"}>Transaktionen</Typography>
                {object.transactions.length > 0 ? <List>
                        {object.transactions.map(id => (
                            <ListItemButton key={id}>
                                <ListItemText primary={`Transaction ${id}`}/>
                            </ListItemButton>
                        ))}
                    </List> :
                    <Typography>keine</Typography>
                }
            </Box>
        </Box>
    )
}
