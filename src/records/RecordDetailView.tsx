import React from 'react'
import {RecordType} from "../app/types";
import {Box, BoxProps, List, ListItemText, Table, TableBody, TableCell, TableRow, Typography} from '@mui/material'
import {CategoryDisplayContainer} from "../categories/CategoryDisplay";
import dayjs from "dayjs";
import {AmountDisplay} from "../core/AmountDisplay";
import {AccountDisplay} from "../core/AccountDisplay";
import {RowModel} from "./RecordGrid/BaseRecordGrid";
import {useGetRecordTransactionsQuery} from "../app/api";
import {TransactionGrid} from "../transactions/TransactionGrid";
import {ContractListItemButton} from "./ContractListItemButton";
import {AddTransactionButton} from "./AddTransactionButton";

interface RecordDetailViewProps extends BoxProps {
    object: RecordType | RowModel
}

export const RecordDetailView = ({object, ...props}: RecordDetailViewProps) => {
    const {data: transactions} = useGetRecordTransactionsQuery(object.id)

    return (
        <Box {...props}>
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
                {object.tags.length > 0 ?
                    <List>
                        {object.tags.map(tagId => (
                            <ListItemText primary={<CategoryDisplayContainer id={tagId}/>}/>
                        ))}
                    </List> :
                    <Typography>keine</Typography>
                }
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
                <Box sx={{display: "flex", alignItems: "center"}}>
                    <Typography variant={"caption"} component={"div"}>Transaktionen</Typography>
                    <AddTransactionButton record={object}/>
                </Box>

                {transactions && transactions.length > 0 ?
                    <TransactionGrid
                        transactions={transactions}
                        record={object.id}
                        density={"compact"}
                        hideFooter
                        initialState={{
                            columns: {
                                columnVisibilityModel: {
                                    id: false,
                                    is_highlighted: false,
                                    is_duplicate: false,
                                }
                            },
                            aggregation: {
                                model: {
                                    amount: 'sum',
                                },
                            },
                        }}
                    /> :
                    <Typography>keine</Typography>
                }
            </Box>
        </Box>
    )
}
