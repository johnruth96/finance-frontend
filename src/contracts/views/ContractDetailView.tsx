import React from 'react'
import {Page} from '../../core/Page'
import {getPaymentCycleDisplay} from '../PaymentCycleInput'
import {AmountDisplay} from '../../core/AmountDisplay'
import {CategoryDisplayContainer} from '../../categories/CategoryDisplay'
import {Box, Table, TableBody, TableCell, TableRow, Typography} from '@mui/material'
import {GridFilterModel} from '@mui/x-data-grid'
import {Contract} from "../../app/types";
import {QueryProvider} from "../../core/QueryProvider";
import {useParams} from "react-router-dom";
import {useGetContractQuery} from "../../app/api";
import dayjs from "dayjs";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import {green, red} from "@mui/material/colors";
import DoNotDisturbAltIcon from "@mui/icons-material/DoNotDisturbAlt";
import {RecordGrid} from "../../records/RecordGrid/RecordGrid";

interface ContractDetailViewProps {
    object: Contract
}

const ContractDetailView = ({object}: ContractDetailViewProps) => {
    const filterModel: GridFilterModel = {
        items: [
            {
                field: 'contract',
                operator: 'is',
                value: object.id,
            },
        ],
    }

    return (
        <Page
            title={object.name}
            updateUrl={`update/`}
        >
            <Box sx={{mb: 3, width: "50%"}}>
                <Typography variant={"caption"}>Details</Typography>

                <Table size="small" sx={{tableLayout: "fixed"}}>
                    <TableBody>
                        <TableRow>
                            <TableCell sx={{pl: 0}}>Name</TableCell>
                            <TableCell>{object.name}</TableCell>
                        </TableRow>

                        <TableRow>
                            <TableCell sx={{pl: 0}}>Status</TableCell>
                            <TableCell>
                                {object.is_active ?
                                    <span><CheckCircleIcon sx={{color: green[500]}}/> Aktiv</span> :
                                    <span><DoNotDisturbAltIcon sx={{color: red[500]}}/> Inaktiv</span>
                                }
                            </TableCell>
                        </TableRow>

                        <TableRow>
                            <TableCell sx={{pl: 0}}>Kategorie</TableCell>
                            <TableCell>
                                <CategoryDisplayContainer id={object.category} variant={"body2"}/>
                            </TableCell>
                        </TableRow>

                        <TableRow>
                            <TableCell sx={{pl: 0}}>Vertragsbeginn</TableCell>
                            <TableCell>{dayjs(object.date_start).format("DD.MM.YYYY")}</TableCell>
                        </TableRow>

                        {object.minimum_duration !== null && (
                            <TableRow>
                                <TableCell sx={{pl: 0}}>Mindestlaufzeit</TableCell>
                                <TableCell>
                                    {object.minimum_duration} Monate
                                </TableCell>
                            </TableRow>
                        )}

                        <TableRow>
                            <TableCell sx={{pl: 0}}>Kündigungsfrist</TableCell>
                            <TableCell>
                                {
                                    object.cancelation_period !== null
                                        ? `${object.cancelation_period} Monate`
                                        : 'keine'
                                }
                            </TableCell>
                        </TableRow>

                        {object.next_extension_date !== null && (
                            <TableRow>
                                <TableCell sx={{pl: 0}}>Automatische Verlängerung</TableCell>
                                <TableCell>
                                    {dayjs(object.next_extension_date).format("DD.MM.YYYY")}
                                </TableCell>
                            </TableRow>
                        )}

                        {object.next_cancelation_date !== null && (
                            <TableRow>
                                <TableCell sx={{pl: 0}}>Kündigung bis</TableCell>
                                <TableCell>
                                    {dayjs(object.next_cancelation_date).format("DD.MM.YYYY")}
                                </TableCell>
                            </TableRow>
                        )}
                    </TableBody>
                </Table>
            </Box>

            <Box sx={{mb: 3, width: "50%"}}>
                <Typography variant={'caption'}>Zahlung</Typography>

                <Table size="small" sx={{tableLayout: "fixed"}}>
                    <TableBody>
                        <TableRow>
                            <TableCell sx={{pl: 0}}>Betrag</TableCell>
                            <TableCell>
                                <AmountDisplay value={object.amount}/>
                            </TableCell>
                        </TableRow>

                        <TableRow>
                            <TableCell sx={{pl: 0}}>Turnus</TableCell>
                            <TableCell>
                                {getPaymentCycleDisplay(object.payment_cycle)}
                            </TableCell>
                        </TableRow>

                        <TableRow>
                            <TableCell sx={{pl: 0}}>Datum</TableCell>
                            <TableCell>
                                {dayjs(object.payment_date).format("DD.MM.YYYY")}
                            </TableCell>
                        </TableRow>
                    </TableBody>
                </Table>
            </Box>

            <Box>
                <Typography variant={'caption'}>Buchungen</Typography>
                <RecordGrid
                    initialState={{
                        filter: {
                            filterModel: filterModel
                        },
                        columns: {
                            columnVisibilityModel: {
                                id: false,
                                contract: false,
                                category: false,
                                account: false,
                                date_created: false,
                                transaction_count: false,
                            }
                        }
                    }}
                />
            </Box>
        </Page>
    )
}

export default () => {
    const params = useParams()
    const {data, ...hookResult} = useGetContractQuery(params.id ? parseInt(params.id) : -1)

    return <QueryProvider {...hookResult}>
        <ContractDetailView object={data as Contract}/>
    </QueryProvider>
}
